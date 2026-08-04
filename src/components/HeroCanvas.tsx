import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const isPageVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 1024;

    // D4 fix: cap device pixel ratio at 2 to limit GPU/CPU cost on high-DPR screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cssWidth = canvas.offsetWidth;
    let cssHeight = canvas.offsetHeight;

    const setCanvasSize = () => {
      cssWidth = canvas.offsetWidth;
      cssHeight = canvas.offsetHeight;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver: pause entire animation loop when off-screen
    const observer = new IntersectionObserver((entries) => {
      isVisibleRef.current = entries[0].isIntersecting;
      if (isVisibleRef.current && isPageVisibleRef.current && !reducedMotion && !isMobile) {
        // Resume loop if it was paused
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    // D4 fix: visibilitychange — pause entirely when tab is backgrounded
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible';
      if (isPageVisibleRef.current && isVisibleRef.current && !reducedMotion && !isMobile) {
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      } else if (!isPageVisibleRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Kármán vortex parameters
    const u_inf = 2.0;
    const R = Math.min(cssWidth, cssHeight) * 0.08;
    const cx = cssWidth * 0.3;
    const cy = cssHeight * 0.5;
    let time = 0;

    const initParticles = () => {
      // D4 / mobile: ~70% reduction. Desktop: 400, mobile: 120.
      const numParticles = isMobile ? 120 : 400;
      particlesRef.current = Array.from({ length: numParticles }, () => ({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        vx: u_inf,
        vy: 0,
      }));
    };
    initParticles();

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    const coldRgb = hexToRgb('#3B82F6');
    const hotRgb = hexToRgb('#F97316');

    const getVelocityColor = (mag: number) => {
      const maxMag = u_inf * 2.5;
      const t = Math.min(Math.max(mag / maxMag, 0), 1);
      const r = Math.round(coldRgb[0] + (hotRgb[0] - coldRgb[0]) * t);
      const g = Math.round(coldRgb[1] + (hotRgb[1] - coldRgb[1]) * t);
      const b = Math.round(coldRgb[2] + (hotRgb[2] - coldRgb[2]) * t);
      return `rgb(${r},${g},${b})`;
    };

    const computeVelocity = (px: number, py: number, t: number) => {
      let vx = u_inf;
      let vy = 0;
      const dx = px - cx;
      const dy = py - cy;
      const r2 = dx * dx + dy * dy;
      if (r2 > R * R) {
        const r4 = r2 * r2;
        const R2 = R * R;
        vx -= u_inf * R2 * (dx * dx - dy * dy) / r4;
        vy -= u_inf * R2 * 2 * dx * dy / r4;
      } else {
        return { vx: 0, vy: 0 };
      }
      if (px > cx) {
        const St = 0.2;
        const f = St * u_inf / (2 * R);
        const omega = 2 * Math.PI * f;
        const phase = omega * t;
        const xDist = (px - cx) / R;
        if (xDist > 1) {
          const envelope = Math.exp(-xDist * 0.05);
          const waveX = Math.sin(xDist * 0.5 - phase);
          const waveY = Math.cos(xDist * 0.5 - phase);
          vx += u_inf * 0.3 * waveY * envelope * (Math.abs(dy) / R < 2 ? 1 : 0);
          vy += u_inf * 0.5 * waveX * envelope * Math.exp(-Math.pow(dy / (2 * R), 2));
        }
      }
      return { vx, vy };
    };

    const drawMesh = (targetCtx: CanvasRenderingContext2D) => {
      targetCtx.strokeStyle = 'rgba(35, 44, 59, 0.3)';
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      const stepsX = Math.floor(cssWidth / 40);
      const stepsY = Math.floor(cssHeight / 40);
      for (let i = 0; i <= stepsX; i++) {
        for (let j = 0; j <= stepsY; j++) {
          const x = i * 40 + (Math.random() * 20 - 10);
          const y = j * 40 + (Math.random() * 20 - 10);
          if (i > 0 && Math.random() > 0.3) {
            targetCtx.moveTo(x, y);
            targetCtx.lineTo((i - 1) * 40, j * 40);
          }
          if (j > 0 && Math.random() > 0.3) {
            targetCtx.moveTo(x, y);
            targetCtx.lineTo(i * 40, (j - 1) * 40);
          }
        }
      }
      targetCtx.stroke();
    };

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = cssWidth * dpr;
    bgCanvas.height = cssHeight * dpr;
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawMesh(bgCtx);
    }

    const animate = () => {
      // Stop RAF if not visible or tab backgrounded; let observer/visibility resume it
      if (!isVisibleRef.current || !isPageVisibleRef.current) {
        rafRef.current = 0;
        return;
      }

      time += 0.1;
      ctx.fillStyle = 'rgba(8, 11, 17, 0.2)';
      ctx.fillRect(0, 0, cssWidth, cssHeight);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(bgCanvas, 0, 0, cssWidth, cssHeight);
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#10151F';
      ctx.fill();
      ctx.strokeStyle = '#232C3B';
      ctx.lineWidth = 2;
      ctx.stroke();

      particlesRef.current.forEach(p => {
        const { vx, vy } = computeVelocity(p.x, p.y, time);
        p.x += vx;
        p.y += vy;
        if (p.x > cssWidth)  { p.x = 0; p.y = Math.random() * cssHeight; }
        else if (p.x < 0)    { p.x = cssWidth; }
        if (p.y > cssHeight) { p.y = 0; }
        else if (p.y < 0)    { p.y = cssHeight; }
        const mag = Math.sqrt(vx * vx + vy * vy);
        ctx.fillStyle = getVelocityColor(mag);
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    if (reducedMotion || isMobile) {
      // Static single frame — no ongoing RAF
      animate();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ opacity: 0.6 }}
    />
  );
}
