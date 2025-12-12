import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const NetworkGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    const numPoints = 60;
    const connectionDistance = 150;
    let mouse = { x: -1000, y: -1000 };

    // New Palette
    const accentColors = [
        'rgba(252, 215, 72, 0.8)',   // Yellow
        'rgba(145, 127, 240, 0.8)',  // Purple
        'rgba(114, 210, 190, 0.8)',  // Aqua
        'rgba(249, 127, 122, 0.8)',  // Red
        'rgba(97, 173, 235, 0.8)',   // Blue
        'rgba(63, 173, 75, 0.8)'     // Green
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 500;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: accentColors[Math.floor(Math.random() * accentColors.length)]
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? '163, 180, 214' : '100, 116, 139'; // Keep lines subtle
      const mouseLineColor = isDark ? '255, 255, 255' : '10, 10, 10';

      // Update and Draw Points
      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Mouse Repulsion/Attraction
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          point.vx -= (dx / dist) * force * 0.5;
          point.vy -= (dy / dist) * force * 0.5;
        }

        // Friction to stabilize speed
        const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        if (speed > 2) {
            point.vx *= 0.9;
            point.vy *= 0.9;
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
      });

      // Draw Connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            // Use subtle line color, but maybe tint it slightly towards one of the point colors?
            // For "Apple Pro", keep lines neutral/clean.
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - dist / connectionDistance})`;
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        const dx = points[i].x - mouse.x;
        const dy = points[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${mouseLineColor}, ${1 - dist / connectionDistance})`;
            ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleClick = () => {
        points.forEach(p => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                const force = 10;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        });
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-[#F5F5F7] dark:bg-brand-black border-y border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="font-display text-2xl font-bold text-slate-400 dark:text-white/50">The Network</h3>
        <p className="text-sm text-slate-400 dark:text-white/30">Interactive Canvas</p>
      </div>
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </section>
  );
};