
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientBgProps {
  className?: string;
  children?: React.ReactNode;
}

const AnimatedGradientBg = ({ className, children }: AnimatedGradientBgProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const circles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }[] = [];
    
    const colors = [
      'rgba(59, 130, 246, 0.3)', // Blue (primary)
      'rgba(124, 58, 237, 0.3)', // Violet (secondary)
      'rgba(217, 70, 239, 0.3)', // Magenta (accent)
    ];
    
    // Resize canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    // Initialize circles
    const init = () => {
      circles.length = 0;
      
      for (let i = 0; i < 10; i++) {
        const radius = Math.random() * 100 + 50;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const vx = (Math.random() - 0.5) * 0.1;
        const vy = (Math.random() - 0.5) * 0.1;
        
        circles.push({ x, y, radius, color, vx, vy });
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw circles
      for (const circle of circles) {
        circle.x += circle.vx;
        circle.y += circle.vy;
        
        // Bounce off edges
        if (circle.x < circle.radius || circle.x > canvas.width - circle.radius) {
          circle.vx *= -1;
        }
        
        if (circle.y < circle.radius || circle.y > canvas.height - circle.radius) {
          circle.vy *= -1;
        }
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    resize();
    init();
    animate();
    
    window.addEventListener('resize', () => {
      resize();
      init();
    });
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedGradientBg;
