/**
 * FluidCanvas — WebGL2 curl-noise fluid hero background.
 *
 * Architecture: two textures (ping-pong) for a scalar dye field.
 *   Pass 1 (ADVECT): reads DYE_A, writes DYE_B via semi-Lagrangian advection.
 *   Pass 2 (DISPLAY): reads DYE_B, maps dye → cold/hot colormap → canvas.
 * Velocity field = curl of animated fractal noise (divergence-free by construction;
 * no pressure solver required). Cursor injects local velocity via uniforms.
 *
 * Performance / accessibility contract (non-negotiable):
 *   1. prefers-reduced-motion  → static gradient, loop never starts.
 *   2. mobile (< 768px)        → static gradient, loop never starts.
 *   3. IntersectionObserver    → loop pauses when hero is off-screen.
 *   4. visibilitychange        → loop pauses on tab blur.
 *   5. WebGL2 unavailable      → CSS gradient fallback, no crash.
 *   6. DPR capped at 2.
 *   7. Frame rate capped at 60 fps via timestamp delta.
 */
import { useRef, useEffect } from 'react';

// ── GLSL sources ────────────────────────────────────────────────────────────

const VERT = `#version 300 es
layout(location=0) in vec2 p;
out vec2 uv;
void main(){ uv=p*.5+.5; gl_Position=vec4(p,0,1); }`;

// Advection pass: curl-noise velocity + semi-Lagrangian dye advection
const ADVECT_FRAG = `#version 300 es
precision highp float;
in vec2 uv;
uniform sampler2D uDye;
uniform float uT;
uniform float uDt;
uniform float uAspect;
uniform vec2  uMouse;
uniform vec2  uMouseVel;
out vec4 frag;

float h(vec2 p){ p=fract(p*vec2(127.1,311.7)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float v=0.,a=.5;
  for(int i=0;i<4;i++){ v+=a*vn(p); p=p*2.1+vec2(1.73,3.17); a*=.5; }
  return v; }

// Curl of fbm potential → divergence-free velocity field
vec2 curlVel(vec2 p){
  float e=.006;
  vec2 t=vec2(uT*.09, uT*.07);
  float up  =fbm(p+vec2(0, e)+t);
  float dn  =fbm(p-vec2(0, e)+t);
  float rt  =fbm(p+vec2(e, 0)+t);
  float lt  =fbm(p-vec2(e, 0)+t);
  return vec2((up-dn)/(2.*e), -(rt-lt)/(2.*e));
}

void main(){
  vec2 q  = uv * vec2(uAspect, 1.);
  vec2 vel = curlVel(q * 2.6) * .11;
  vel.x += .024; // steady left→right drift

  // Cursor perturbation (aspect-correct distance)
  vec2 d = uv - uMouse;
  d.x *= uAspect;
  vel += uMouseVel * exp(-dot(d,d)/.008) * .4;

  // Semi-Lagrangian trace-back
  float px = fract(uv.x - vel.x*uDt + 1.); // wrap x
  float py = clamp(uv.y - vel.y*uDt, .001, .999);

  float dye = texture(uDye, vec2(px,py)).r * .994; // dissipation

  // Inject time-varying dye at the left edge
  if(uv.x < .016){
    float stripe = .52 + .48*sin(uv.y*13. - uT*.65);
    dye = mix(dye, stripe*.92, .88);
  }

  frag = vec4(dye, 0., 0., 1.);
}`;

// Display pass: scalar dye → cold/hot colormap
const DISPLAY_FRAG = `#version 300 es
precision highp float;
in vec2 uv;
uniform sampler2D uDye;
out vec4 frag;
void main(){
  float t = clamp(texture(uDye,uv).r, 0., 1.);
  // --cold #3B82F6, --hot #F97316, --ink #0A0A0D
  // Desaturated to ≤38% brightness so hero text remains readable at all frames.
  vec3 cold = vec3(.231,.510,.965);
  vec3 hot  = vec3(.976,.451,.086);
  vec3 base = vec3(.039,.039,.051);
  vec3 col  = mix(base, mix(cold,hot,t*t), t*.38);
  frag = vec4(col, 1.);
}`;

// ── WebGL helpers ────────────────────────────────────────────────────────────

const QUAD = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
const SIM  = 256; // simulation resolution (square)

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(`Shader: ${gl.getShaderInfoLog(s)}`);
  return s;
}

function linkProg(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(`Link: ${gl.getProgramInfoLog(p)}`);
  return p;
}

function makeTex(gl: WebGL2RenderingContext, w: number, h: number, data: Uint8Array | null): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  return t;
}

function makeFBO(gl: WebGL2RenderingContext, tex: WebGLTexture): WebGLFramebuffer {
  const f = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return f;
}

// ── Static fallback (2D canvas gradient) ────────────────────────────────────

function drawStatic(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width  = canvas.offsetWidth  || 800;
  canvas.height = canvas.offsetHeight || 400;
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0,   'rgba(59,130,246,0.16)');
  g.addColorStop(0.5, 'rgba(167,139,250,0.07)');
  g.addColorStop(1,   'rgba(249,115,22,0.11)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ── Main WebGL simulation ────────────────────────────────────────────────────

function startFluid(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): () => void {
  // Initial dye — alternating bands so the canvas isn't empty on load
  const initData = new Uint8Array(SIM * SIM * 4);
  for (let i = 0; i < SIM * SIM; i++) {
    const x = (i % SIM) / SIM, y = Math.floor(i / SIM) / SIM;
    const v = Math.max(0, Math.sin(x * 22 + y * 11) * 0.38 + 0.28);
    initData[i*4] = Math.round(v * 255);
    initData[i*4+3] = 255;
  }

  let texA = makeTex(gl, SIM, SIM, initData);
  let texB = makeTex(gl, SIM, SIM, null);
  let fboA = makeFBO(gl, texA);
  let fboB = makeFBO(gl, texB);

  const advProg = linkProg(gl, VERT, ADVECT_FRAG);
  const dspProg = linkProg(gl, VERT, DISPLAY_FRAG);

  // Cache uniform locations
  const advU = {
    uDye: gl.getUniformLocation(advProg, 'uDye'),
    uT:   gl.getUniformLocation(advProg, 'uT'),
    uDt:  gl.getUniformLocation(advProg, 'uDt'),
    uAsp: gl.getUniformLocation(advProg, 'uAspect'),
    uM:   gl.getUniformLocation(advProg, 'uMouse'),
    uMV:  gl.getUniformLocation(advProg, 'uMouseVel'),
  };
  const dspU = { uDye: gl.getUniformLocation(dspProg, 'uDye') };

  // Full-screen quad VAO
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  // Cursor tracking
  let mouse   = [0.5, 0.5];
  let mouseVel= [0.0, 0.0];
  let prevT   = 0;

  const onMove = (e: PointerEvent) => {
    const r  = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    const dt = Math.max((performance.now() - prevT) / 1000, 0.004);
    mouseVel = [(nx - mouse[0]) / dt, (ny - mouse[1]) / dt];
    mouse = [nx, ny];
    prevT = performance.now();
  };
  canvas.addEventListener('pointermove', onMove);

  // Resize canvas → physical px, DPR ≤ 2
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.offsetWidth  * dpr);
    const h = Math.round(canvas.offsetHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Pause state
  let paused = false;
  let rafId  = 0;
  let last   = 0;
  const INTERVAL = 1000 / 60; // 60 fps cap

  const onVis = () => { paused = document.hidden; };
  document.addEventListener('visibilitychange', onVis);

  const io = new IntersectionObserver(entries => {
    paused = !entries[0].isIntersecting;
    if (!paused && !rafId) rafId = requestAnimationFrame(frame);
  }, { threshold: 0.01 });
  io.observe(canvas);

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    if (paused) return;
    const elapsed = now - last;
    if (elapsed < INTERVAL - 1) return;
    const dt  = Math.min(elapsed / 1000, 0.05);
    last = now - (elapsed % INTERVAL);
    const t  = now / 1000;
    const asp = canvas.width / canvas.height;

    // Decay cursor velocity
    mouseVel = [mouseVel[0] * 0.82, mouseVel[1] * 0.82];

    // ── Advect pass ──────────────────────────────────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
    gl.viewport(0, 0, SIM, SIM);
    gl.useProgram(advProg);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(advU.uDye, 0);
    gl.uniform1f(advU.uT,   t);
    gl.uniform1f(advU.uDt,  dt);
    gl.uniform1f(advU.uAsp, asp);
    gl.uniform2fv(advU.uM,  mouse);
    gl.uniform2fv(advU.uMV, mouseVel);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Swap ping-pong
    [texA, texB] = [texB, texA];
    [fboA, fboB] = [fboB, fboA];

    // ── Display pass ─────────────────────────────────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(dspProg);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(dspU.uDye, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('pointermove', onMove);
    gl.deleteTexture(texA); gl.deleteTexture(texB);
    gl.deleteFramebuffer(fboA); gl.deleteFramebuffer(fboB);
    gl.deleteProgram(advProg); gl.deleteProgram(dspProg);
    gl.deleteVertexArray(vao); gl.deleteBuffer(buf);
  };
}

// ── React component ──────────────────────────────────────────────────────────

export function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile  = window.innerWidth < 768;

    if (reduced || mobile) {
      drawStatic(canvas);
      return;
    }

    let cleanup: (() => void) | undefined;
    try {
      const gl = canvas.getContext('webgl2');
      if (!gl) throw new Error('WebGL2 not supported');
      cleanup = startFluid(gl, canvas);
    } catch (err) {
      console.warn('[FluidCanvas] falling back to static gradient:', err);
      drawStatic(canvas);
    }
    return () => cleanup?.();
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
