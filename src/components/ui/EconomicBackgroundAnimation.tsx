'use client';

import React, { useEffect, useRef } from 'react';

interface EconomicNode {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  label: string;
  symbol: string;
  sector: 'primary' | 'secondary' | 'tertiary';
  radius: number;
  pulseOffset: number;
  connections: number[];
}

interface Sparkle {
  x: number;
  y: number;
  vy: number;
  size: number;
  opacity: number;
  symbol: string;
  color: string;
}

interface FlowPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

const SECTOR_THEME = {
  primary: {
    base: '#10B981',
    glow: 'rgba(16, 185, 129, 0.35)',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(5, 150, 105, 0.5)',
    ambient: 'rgba(16, 185, 129, 0.06)'
  },
  secondary: {
    base: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.35)',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(217, 119, 6, 0.5)',
    ambient: 'rgba(245, 158, 11, 0.05)'
  },
  tertiary: {
    base: '#6366F1',
    glow: 'rgba(99, 102, 241, 0.35)',
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(79, 70, 229, 0.5)',
    ambient: 'rgba(99, 102, 241, 0.06)'
  }
};

export const EconomicBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; radius: number }>({
    x: -1000,
    y: -1000,
    active: false,
    radius: 160
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();

    // 12 Economic Nodes representing the real-world interconnected economy
    const rawNodesData = [
      // Primary Sector (Left / Top-Left)
      { id: 'n1', label: 'Farm Fields', symbol: '🌾', sector: 'primary' as const, relX: 0.12, relY: 0.22 },
      { id: 'n2', label: 'Iron Mine', symbol: '⛏️', sector: 'primary' as const, relX: 0.24, relY: 0.14 },
      { id: 'n3', label: 'Dairy Livestock', symbol: '🐄', sector: 'primary' as const, relX: 0.10, relY: 0.45 },
      { id: 'n4', label: 'Forestry', symbol: '🌲', sector: 'primary' as const, relX: 0.22, relY: 0.58 },

      // Secondary Sector (Center / Middle)
      { id: 'n5', label: 'Textile Mill', symbol: '🧵', sector: 'secondary' as const, relX: 0.42, relY: 0.28 },
      { id: 'n6', label: 'Steel Plant', symbol: '⚙️', sector: 'secondary' as const, relX: 0.54, relY: 0.18 },
      { id: 'n7', label: 'Bakery Processing', symbol: '🍞', sector: 'secondary' as const, relX: 0.40, relY: 0.62 },
      { id: 'n8', label: 'Assembly Line', symbol: '🏭', sector: 'secondary' as const, relX: 0.56, relY: 0.72 },

      // Tertiary Sector (Right / Bottom-Right)
      { id: 'n9', label: 'Freight Transport', symbol: '🚚', sector: 'tertiary' as const, relX: 0.72, relY: 0.24 },
      { id: 'n10', label: 'Banking & Credit', symbol: '🏦', sector: 'tertiary' as const, relX: 0.88, relY: 0.32 },
      { id: 'n11', label: 'Kirana / Market', symbol: '🏪', sector: 'tertiary' as const, relX: 0.75, relY: 0.65 },
      { id: 'n12', label: 'Consumer & Services', symbol: '🛒', sector: 'tertiary' as const, relX: 0.90, relY: 0.75 },
    ];

    // Interdependence Connection Network
    const connectionPairs = [
      [0, 4], [0, 6], [1, 5], [2, 6], [3, 7], // Primary -> Secondary
      [4, 8], [5, 8], [6, 8], [7, 8],          // Secondary -> Transport
      [8, 10], [8, 9], [9, 10], [10, 11],     // Transport & Banking -> Retail & Consumer
      [9, 0], [9, 5], [11, 0]                  // Consumer demand feedback loop & financing
    ];

    let nodes: EconomicNode[] = rawNodesData.map((d, idx) => {
      const connections = connectionPairs
        .filter(pair => pair[0] === idx || pair[1] === idx)
        .map(pair => (pair[0] === idx ? pair[1] : pair[0]));

      return {
        id: d.id,
        x: width * d.relX,
        y: height * d.relY,
        targetX: width * d.relX,
        targetY: height * d.relY,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        label: d.label,
        symbol: d.symbol,
        sector: d.sector,
        radius: 20,
        pulseOffset: Math.random() * Math.PI * 2,
        connections
      };
    });

    const handleResize = () => {
      setCanvasSize();
      nodes.forEach((node, idx) => {
        const d = rawNodesData[idx];
        node.targetX = width * d.relX;
        node.targetY = height * d.relY;
      });
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true, radius: 160 };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false, radius: 160 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Floating value packets travelling on connection lines
    const flowPackets: FlowPacket[] = connectionPairs.map(pair => ({
      fromNode: pair[0],
      toNode: pair[1],
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      color: '#D97706',
      size: 3.5
    }));

    // Floating ambient gold & currency sparkles
    const sparkles: Sparkle[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(0.2 + Math.random() * 0.4),
      size: 10 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
      symbol: Math.random() > 0.4 ? '₹' : '✦',
      color: Math.random() > 0.5 ? '#F59E0B' : '#10B981'
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // ─── LAYER 1: AMBIENT SECTOR AURAS (Radial Breathing Gradients) ───
      const aura1 = ctx.createRadialGradient(
        width * 0.18 + Math.sin(time * 0.5) * 30,
        height * 0.35 + Math.cos(time * 0.4) * 30,
        20,
        width * 0.18,
        height * 0.35,
        width * 0.4
      );
      aura1.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      aura1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = aura1;
      ctx.fillRect(0, 0, width, height);

      const aura2 = ctx.createRadialGradient(
        width * 0.5 + Math.cos(time * 0.6) * 40,
        height * 0.5 + Math.sin(time * 0.5) * 40,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.4
      );
      aura2.addColorStop(0, 'rgba(245, 158, 11, 0.07)');
      aura2.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = aura2;
      ctx.fillRect(0, 0, width, height);

      const aura3 = ctx.createRadialGradient(
        width * 0.82 + Math.sin(time * 0.7) * 30,
        height * 0.5 + Math.cos(time * 0.5) * 30,
        20,
        width * 0.82,
        height * 0.5,
        width * 0.4
      );
      aura3.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      aura3.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = aura3;
      ctx.fillRect(0, 0, width, height);

      // ─── LAYER 2: INTERDEPENDENCE SUPPLY CHAIN GRID LINES ─────────────
      connectionPairs.forEach(pair => {
        const nodeA = nodes[pair[0]];
        const nodeB = nodes[pair[1]];
        if (!nodeA || !nodeB) return;

        // Check if mouse is near line
        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        const dMouse = Math.hypot(mouseRef.current.x - midX, mouseRef.current.y - midY);
        const isHovered = mouseRef.current.active && dMouse < mouseRef.current.radius;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        if (isHovered) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
          ctx.lineWidth = 2.2;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = 'rgba(156, 163, 175, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([6, 8]);
        }
        ctx.stroke();
        ctx.restore();
      });

      // ─── LAYER 3: VALUE FLOW ENERGY PACKETS (Moving along pipelines) ───
      flowPackets.forEach(packet => {
        packet.progress += packet.speed;
        if (packet.progress > 1) packet.progress = 0;

        const nodeA = nodes[packet.fromNode];
        const nodeB = nodes[packet.toNode];
        if (!nodeA || !nodeB) return;

        const px = nodeA.x + (nodeB.x - nodeA.x) * packet.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * packet.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = SECTOR_THEME[nodeB.sector].base;
        ctx.shadowColor = SECTOR_THEME[nodeB.sector].base;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      // ─── LAYER 4: FLOATING CURRENCY & SPARKLE PARTICLES ───────────────
      sparkles.forEach(s => {
        s.y += s.vy;
        if (s.y < -20) {
          s.y = height + 20;
          s.x = Math.random() * width;
        }

        ctx.save();
        ctx.font = `${s.size}px sans-serif`;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity + Math.sin(time * 2 + s.x) * 0.08;
        ctx.textAlign = 'center';
        ctx.fillText(s.symbol, s.x, s.y);
        ctx.restore();
      });

      // ─── LAYER 5: ECONOMIC NODES (Interactive Badges) ─────────────────
      nodes.forEach(node => {
        // Floating gentle wander
        node.x += node.vx;
        node.y += node.vy;

        // Pull back to anchor target
        const dxTarget = node.targetX - node.x;
        const dyTarget = node.targetY - node.y;
        node.vx += dxTarget * 0.002;
        node.vy += dyTarget * 0.002;
        node.vx *= 0.96;
        node.vy *= 0.96;

        // Mouse interaction (Repulsion / Magnetism)
        if (mouseRef.current.active) {
          const dxMouse = node.x - mouseRef.current.x;
          const dyMouse = node.y - mouseRef.current.y;
          const dist = Math.hypot(dxMouse, dyMouse);
          if (dist < mouseRef.current.radius && dist > 0) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
            node.x += (dxMouse / dist) * force * 3.5;
            node.y += (dyMouse / dist) * force * 3.5;
          }
        }

        const theme = SECTOR_THEME[node.sector];
        const pulse = Math.sin(time * 1.5 + node.pulseOffset) * 2;
        const currentR = node.radius + pulse;

        // 1. Radar Pulse Ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR + 8, 0, Math.PI * 2);
        ctx.strokeStyle = theme.glow;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2. Glassmorphic Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // 3. Icon / Symbol inside Node
        ctx.font = `${currentR * 0.9}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.symbol, node.x, node.y + 1);

        // 4. Subtle Sector Label below Node
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = theme.base;
        ctx.globalAlpha = 0.75;
        ctx.fillText(node.label, node.x, node.y + currentR + 12);
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
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
