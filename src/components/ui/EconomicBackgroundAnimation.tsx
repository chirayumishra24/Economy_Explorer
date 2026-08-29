'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  sector: 'primary' | 'secondary' | 'tertiary';
  symbol: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface ConnectionNode {
  x: number;
  y: number;
  label: string;
  sector: 'primary' | 'secondary' | 'tertiary';
}

const SECTOR_COLORS = {
  primary: {
    fill: 'rgba(46, 125, 50, 0.18)',
    stroke: 'rgba(76, 175, 80, 0.4)',
    text: '#2E7D32',
    glow: 'rgba(76, 175, 80, 0.15)',
  },
  secondary: {
    fill: 'rgba(230, 81, 0, 0.18)',
    stroke: 'rgba(255, 152, 0, 0.4)',
    text: '#E65100',
    glow: 'rgba(255, 152, 0, 0.15)',
  },
  tertiary: {
    fill: 'rgba(81, 45, 168, 0.18)',
    stroke: 'rgba(126, 87, 194, 0.4)',
    text: '#512DA8',
    glow: 'rgba(126, 87, 194, 0.15)',
  },
};

const ICONS = {
  primary: ['🌱', '🌾', '🐟', '⛏️', '🥛', '🌲'],
  secondary: ['⚙️', '🏭', '🔨', '📦', '🧵', '🍞'],
  tertiary: ['🚚', '🏪', '🏦', '🩺', '📡', '₹'],
};

export const EconomicBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate floating economic symbol particles
    const sectors: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary'];
    const particleCount = Math.min(28, Math.floor((width * height) / 35000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const sector = sectors[i % 3];
      const symbolList = ICONS[sector];
      const symbol = symbolList[Math.floor(Math.random() * symbolList.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 8 + 16, // font size 16 - 24
        sector,
        symbol,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        opacity: Math.random() * 0.25 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Supply Chain Interdependence Anchor Nodes
    let nodes: ConnectionNode[] = [];
    const initNodes = () => {
      nodes = [
        { x: width * 0.15, y: height * 0.35, label: 'Primary (Raw Materials)', sector: 'primary' },
        { x: width * 0.5, y: height * 0.65, label: 'Secondary (Processing)', sector: 'secondary' },
        { x: width * 0.85, y: height * 0.35, label: 'Tertiary (Distribution)', sector: 'tertiary' },
      ];
    };
    initNodes();

    let flowProgress = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient sector gradient glows in the background
      const grad1 = ctx.createRadialGradient(width * 0.15, height * 0.3, 10, width * 0.15, height * 0.3, width * 0.35);
      grad1.addColorStop(0, 'rgba(46, 125, 50, 0.045)');
      grad1.addColorStop(1, 'rgba(46, 125, 50, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.5, height * 0.7, 10, width * 0.5, height * 0.7, width * 0.35);
      grad2.addColorStop(0, 'rgba(230, 81, 0, 0.04)');
      grad2.addColorStop(1, 'rgba(230, 81, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const grad3 = ctx.createRadialGradient(width * 0.85, height * 0.3, 10, width * 0.85, height * 0.3, width * 0.35);
      grad3.addColorStop(0, 'rgba(81, 45, 168, 0.045)');
      grad3.addColorStop(1, 'rgba(81, 45, 168, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Supply Chain Interdependence Flow Lines
      flowProgress += 0.003;
      if (flowProgress > 1) flowProgress = 0;

      // Draw dashed flow bezier: Node 0 -> Node 1 -> Node 2 -> Node 0
      ctx.save();
      ctx.setLineDash([6, 10]);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.18)';

      // Primary to Secondary
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.quadraticCurveTo(width * 0.3, height * 0.55, nodes[1].x, nodes[1].y);
      ctx.stroke();

      // Secondary to Tertiary
      ctx.beginPath();
      ctx.moveTo(nodes[1].x, nodes[1].y);
      ctx.quadraticCurveTo(width * 0.7, height * 0.55, nodes[2].x, nodes[2].y);
      ctx.stroke();

      // Tertiary back to Primary (Consumer Demand Loop)
      ctx.beginPath();
      ctx.moveTo(nodes[2].x, nodes[2].y);
      ctx.quadraticCurveTo(width * 0.5, height * 0.15, nodes[0].x, nodes[0].y);
      ctx.stroke();
      ctx.restore();

      // Draw pulsating supply chain currency/goods flow packet
      const drawFlowPacket = (t: number, from: ConnectionNode, cp: { x: number; y: number }, to: ConnectionNode, color: string) => {
        const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cp.x + t * t * to.x;
        const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cp.y + t * t * to.y;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      };

      drawFlowPacket(flowProgress, nodes[0], { x: width * 0.3, y: height * 0.55 }, nodes[1], 'rgba(46, 125, 50, 0.5)');
      drawFlowPacket((flowProgress + 0.33) % 1, nodes[1], { x: width * 0.7, y: height * 0.55 }, nodes[2], 'rgba(230, 81, 0, 0.5)');
      drawFlowPacket((flowProgress + 0.66) % 1, nodes[2], { x: width * 0.5, y: height * 0.15 }, nodes[0], 'rgba(81, 45, 168, 0.5)');

      // 3. Render and update floating economic particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around screen edges
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Interactive mouse push effect
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;
          if (dist < maxDist && dist > 0) {
            const force = (maxDist - dist) / maxDist;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Pulse opacity
        const currentOpacity = p.opacity + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.06;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.05, Math.min(0.4, currentOpacity));
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};
