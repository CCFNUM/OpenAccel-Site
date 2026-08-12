/**
 * FluidSim — real-time GPU Navier–Stokes fluid, mouse-driven.
 *
 * A genuine incompressible fluid solver (advection · vorticity confinement ·
 * Jacobi pressure projection · gradient subtract), not the hero's curl-noise
 * approximation. Motion is injected only by pointer movement ("splats" add
 * velocity + dye); with no input the field dissipates to rest — so it moves
 * only when the cursor moves, swirls and trails realistically, and plumes
 * interact when they collide.
 *
 * Algorithm after Pavel Dobryakov's WebGL-Fluid-Simulation (MIT-licensed):
 *   https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 * Re-implemented for WebGL2 + this site's token palette and constraints.
 *
 * Accessibility / performance contract (matches FluidCanvas, non-negotiable):
 *   1. prefers-reduced-motion → nothing runs (transparent canvas).
 *   2. mobile (< 768px)       → nothing runs.
 *   3. IntersectionObserver   → paused while off-screen.
 *   4. visibilitychange       → paused on tab blur.
 *   5. WebGL2 + EXT_color_buffer_float required, else silent no-op.
 *   6. DPR capped at 2, sim/dye resolutions capped, 20 pressure iters.
 *   7. Colours read from --cold / --hot (no hardcoded palette).
 */
import { useRef, useEffect } from 'react';

const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 512;
const PRESSURE_ITERATIONS = 20;
const DENSITY_DISSIPATION = 0.9906;
const VELOCITY_DISSIPATION = 0.988;
const PRESSURE_DISSIPATION = 0.8;
const CURL = 30;
const SPLAT_RADIUS = 0.0035;
const SPLAT_FORCE = 6000;
const COLOR_GAIN = 0.25;

const BASE_VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main(){
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const SPLAT_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
out vec4 frag;
void main(){
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  frag = vec4(base + splat, 1.0);
}`;

const ADVECTION_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
out vec4 frag;
void main(){
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  frag = dissipation * texture(uSource, coord);
  frag.a = 1.0;
}`;

const DIVERGENCE_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
uniform sampler2D uVelocity;
out vec4 frag;
void main(){
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  float div = 0.5 * (R - L + T - B);
  frag = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
uniform sampler2D uVelocity;
out vec4 frag;
void main(){
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  frag = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
out vec4 frag;
void main(){
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel += force * dt;
  vel = min(max(vel, -1000.0), 1000.0);
  frag = vec4(vel, 0.0, 1.0);
}`;

const PRESSURE_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 frag;
void main(){
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  frag = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 frag;
void main(){
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  frag = vec4(velocity, 0.0, 1.0);
}`;

const CLEAR_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
out vec4 frag;
void main(){ frag = value * texture(uTexture, vUv); }`;

const DISPLAY_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTexture;
out vec4 frag;
void main(){
  vec3 c = texture(uTexture, vUv).rgb;
  float m = max(c.r, max(c.g, c.b));
  vec3 col = c / (1.0 + 0.35 * max(m - 0.9, 0.0));
  float a = clamp(m * 1.2, 0.0, 1.0);
  frag = vec4(col, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}
function program(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
  return p;
}
function uniforms(gl: WebGL2RenderingContext, p: WebGLProgram): Record<string, WebGLUniformLocation> {
  const u: Record<string, WebGLUniformLocation> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i)!;
    const loc = gl.getUniformLocation(p, info.name);
    if (loc) u[info.name] = loc;
  }
  return u;
}

interface FBO { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelSizeX: number; texelSizeY: number; attach: (id: number) => number; }
interface DoubleFBO { width: number; height: number; texelSizeX: number; texelSizeY: number; read: FBO; write: FBO; swap: () => void; }

function readTokenRGB(name: string, fb: [number, number, number]): [number, number, number] {
  try {
    const el = document.createElement('span');
    el.style.color = `var(${name})`;
    el.style.display = 'none';
    document.body.appendChild(el);
    const cs = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = cs.match(/[\d.]+/g);
    if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  } catch { /* fall through */ }
  return fb;
}

function start(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): () => void {
  const ext = gl.getExtension('EXT_color_buffer_float');
  if (!ext) throw new Error('EXT_color_buffer_float unavailable');

  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const blit = (target: FBO | null) => {
    if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.width, target.height); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  function makeFBO(w: number, h: number, internal: number, format: number, type: number): FBO {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture, fbo, width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
      attach(id: number) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
    };
  }
  function makeDouble(w: number, h: number, internal: number, format: number, type: number): DoubleFBO {
    let a = makeFBO(w, h, internal, format, type);
    let b = makeFBO(w, h, internal, format, type);
    return {
      width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
      get read() { return a; }, set read(v) { a = v; },
      get write() { return b; }, set write(v) { b = v; },
      swap() { const t = a; a = b; b = t; },
    };
  }

  const simW = SIM_RESOLUTION, simH = Math.round(SIM_RESOLUTION * (canvas.height / canvas.width)) || SIM_RESOLUTION;
  const dyeW = DYE_RESOLUTION, dyeH = Math.round(DYE_RESOLUTION * (canvas.height / canvas.width)) || DYE_RESOLUTION;

  let velocity = makeDouble(simW, simH, gl.RG16F, gl.RG, gl.HALF_FLOAT);
  let dye      = makeDouble(dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
  const divergenceFBO = makeFBO(simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT);
  const curlFBO       = makeFBO(simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT);
  let pressure = makeDouble(simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT);

  const P = {
    splat: program(gl, BASE_VERT, SPLAT_FRAG),
    advection: program(gl, BASE_VERT, ADVECTION_FRAG),
    divergence: program(gl, BASE_VERT, DIVERGENCE_FRAG),
    curl: program(gl, BASE_VERT, CURL_FRAG),
    vorticity: program(gl, BASE_VERT, VORTICITY_FRAG),
    pressure: program(gl, BASE_VERT, PRESSURE_FRAG),
    gradient: program(gl, BASE_VERT, GRADIENT_FRAG),
    clear: program(gl, BASE_VERT, CLEAR_FRAG),
    display: program(gl, BASE_VERT, DISPLAY_FRAG),
  };
  const U = Object.fromEntries(Object.entries(P).map(([k, p]) => [k, uniforms(gl, p)])) as Record<keyof typeof P, Record<string, WebGLUniformLocation>>;

  const cold   = readTokenRGB('--cold',   [0.231, 0.510, 0.965]);
  const hot    = readTokenRGB('--hot',    [0.976, 0.451, 0.086]);
  const stops = [cold, hot];
  function ramp(s: number): [number, number, number] {
    const seg = stops.length - 1;
    const x = (s % 1) * seg;
    const i = Math.min(Math.floor(x), seg - 1), f = x - i;
    const a = stops[i], b = stops[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    const aspect = canvas.width / canvas.height;
    gl.useProgram(P.splat);
    gl.uniform1i(U.splat.uTarget, velocity.read.attach(0));
    gl.uniform1f(U.splat.aspectRatio, aspect);
    gl.uniform2f(U.splat.point, x, y);
    gl.uniform3f(U.splat.color, dx, dy, 0);
    gl.uniform1f(U.splat.radius, SPLAT_RADIUS * (aspect > 1 ? aspect : 1));
    blit(velocity.write); velocity.swap();

    gl.uniform1i(U.splat.uTarget, dye.read.attach(0));
    gl.uniform3f(U.splat.color, color[0], color[1], color[2]);
    blit(dye.write); dye.swap();
  }

  // pointer state (only movement injects motion)
  let colorPhase = 0;
  const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, prevT: 0 };
  const host = canvas.parentElement || canvas;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    pointer.dx = (nx - pointer.x) * SPLAT_FORCE;
    pointer.dy = (ny - pointer.y) * SPLAT_FORCE;
    pointer.x = nx; pointer.y = ny;
    pointer.moved = true;
  };
  host.addEventListener('pointermove', onMove as EventListener);

  // a few gentle initial splats so the field isn't empty (they settle to rest)
  function seed() {
    for (let i = 0; i < 5; i++) {
      const c = ramp(i / 5).map(v => v * COLOR_GAIN) as [number, number, number];
      splat(Math.random(), Math.random(), (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, c);
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.offsetWidth * dpr);
    const h = Math.round(canvas.offsetHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  resize();
  seed();
  const ro = new ResizeObserver(resize); ro.observe(canvas);

  let paused = false, rafId = 0, last = 0;
  const onVis = () => { paused = document.hidden; };
  document.addEventListener('visibilitychange', onVis);
  const io = new IntersectionObserver(es => {
    paused = !es[0].isIntersecting;
    if (!paused && !rafId) rafId = requestAnimationFrame(frame);
  }, { threshold: 0.01 });
  io.observe(canvas);

  function step(dt: number) {
    gl.disable(gl.BLEND);

    gl.useProgram(P.curl);
    gl.uniform2f(U.curl.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.curl.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    gl.useProgram(P.vorticity);
    gl.uniform2f(U.vorticity.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.vorticity.uVelocity, velocity.read.attach(0));
    gl.uniform1i(U.vorticity.uCurl, curlFBO.attach(1));
    gl.uniform1f(U.vorticity.curl, CURL);
    gl.uniform1f(U.vorticity.dt, dt);
    blit(velocity.write); velocity.swap();

    gl.useProgram(P.divergence);
    gl.uniform2f(U.divergence.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.divergence.uVelocity, velocity.read.attach(0));
    blit(divergenceFBO);

    gl.useProgram(P.clear);
    gl.uniform1i(U.clear.uTexture, pressure.read.attach(0));
    gl.uniform1f(U.clear.value, PRESSURE_DISSIPATION);
    blit(pressure.write); pressure.swap();

    gl.useProgram(P.pressure);
    gl.uniform2f(U.pressure.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.pressure.uDivergence, divergenceFBO.attach(0));
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(U.pressure.uPressure, pressure.read.attach(1));
      blit(pressure.write); pressure.swap();
    }

    gl.useProgram(P.gradient);
    gl.uniform2f(U.gradient.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.gradient.uPressure, pressure.read.attach(0));
    gl.uniform1i(U.gradient.uVelocity, velocity.read.attach(1));
    blit(velocity.write); velocity.swap();

    gl.useProgram(P.advection);
    gl.uniform2f(U.advection.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.advection.uVelocity, velocity.read.attach(0));
    gl.uniform1i(U.advection.uSource, velocity.read.attach(0));
    gl.uniform1f(U.advection.dt, dt);
    gl.uniform1f(U.advection.dissipation, VELOCITY_DISSIPATION);
    blit(velocity.write); velocity.swap();

    gl.uniform2f(U.advection.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(U.advection.uVelocity, velocity.read.attach(0));
    gl.uniform1i(U.advection.uSource, dye.read.attach(1));
    gl.uniform1f(U.advection.dissipation, DENSITY_DISSIPATION);
    blit(dye.write); dye.swap();
  }

  function render() {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(P.display);
    gl.uniform1i(U.display.uTexture, dye.read.attach(0));
    blit(null);
  }

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    if (paused) return;
    const dt = Math.min((now - last) / 1000 || 0.016, 0.0166);
    last = now;
    if (pointer.moved) {
      colorPhase = (colorPhase + 0.09) % 1;
      const c = ramp(colorPhase).map(v => v * COLOR_GAIN) as [number, number, number];
      splat(pointer.x, pointer.y, pointer.dx, pointer.dy, c);
      pointer.moved = false;
    }
    step(dt);
    render();
  }
  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    host.removeEventListener('pointermove', onMove as EventListener);
    Object.values(P).forEach(p => gl.deleteProgram(p));
  };
}

export function FluidSim({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || window.innerWidth < 768) return;
    let cleanup: (() => void) | undefined;
    try {
      const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
      if (!gl) throw new Error('WebGL2 unavailable');
      cleanup = start(gl, canvas);
    } catch (err) {
      console.warn('[FluidSim] disabled:', err);
    }
    return () => cleanup?.();
  }, []);
  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />;
}
