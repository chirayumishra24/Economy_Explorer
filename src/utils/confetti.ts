// Zero-dependency HTML5 Canvas Confetti Burst for Classroom Celebrations

export function triggerConfettiBurst(durationMs = 2500): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#2563EB', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#EF4444', '#FBBF24', '#06B6D4'];

  const particles: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
  }> = [];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: width * (0.2 + Math.random() * 0.6),
      y: height * 0.4 + (Math.random() * 80 - 40),
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: -12 - Math.random() * 10,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
    });
  }

  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > durationMs) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const progress = elapsed / durationMs;
    const alpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rot += p.vrot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    ctx.restore();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
