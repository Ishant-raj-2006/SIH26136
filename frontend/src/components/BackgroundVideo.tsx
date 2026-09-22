import React, { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  videoSrc?: string;
  overlayOpacity?: number;
  mode?: 'light' | 'dark';
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoSrc = '/Vid.mp4',
  overlayOpacity = 0.85,
  mode = 'light',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Canvas light/dark particle & mesh animation
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
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (mode === 'light') {
        // Soft pristine light gradient
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 3,
          100,
          width / 2,
          height / 2,
          width
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#f8fafc');
        grad.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(30, 58, 138, 0.08)';
        ctx.lineWidth = 0.75;
      } else {
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 3,
          100,
          width / 2,
          height / 2,
          width
        );
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#020617');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.lineWidth = 0.75;
      }

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = mode === 'light' ? 'rgba(30, 58, 138, 0.25)' : 'rgba(96, 165, 250, 0.7)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Fallback Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Static Background Image */}
      <img
        src="/dashboard-bg.jpg"
        alt="Background"
        className={`absolute inset-0 w-full h-full object-cover filter transition-opacity duration-1000 ${
          mode === 'light' ? 'opacity-85 brightness-105 contrast-95' : 'opacity-85 brightness-95 contrast-105'
        }`}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />

      {/* Glassmorphism Gradient Overlay */}
      <div
        className={`absolute inset-0 backdrop-blur-[1px] transition-all ${
          mode === 'light' ? 'bg-white/70' : 'bg-slate-950/50'
        }`}
        style={{
          backgroundColor:
            mode === 'light' ? `rgba(255, 255, 255, ${overlayOpacity})` : `rgba(15, 23, 42, ${overlayOpacity})`,
        }}
      />
    </div>
  );
};
