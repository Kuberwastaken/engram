
import React, { useEffect, useRef } from 'react';

export const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create static stars with smaller, more varied sizes
    const staticStars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < 200; i++) {
      staticStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.2, // Smaller sizes from 0.2 to 1.7
        opacity: Math.random() * 0.4 + 0.1, // More subtle opacity
        twinkleSpeed: Math.random() * 0.003 + 0.001, // Even slower twinkling
      });
    }

    // Create shooting stars
    const shootingStars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      opacity: number;
      tail: Array<{ x: number; y: number; opacity: number }>;
      life: number;
      maxLife: number;
    }> = [];

    const createShootingStar = () => {
      const side = Math.random();
      let startX, startY, angle;
      
      if (side < 0.5) {
        // From top
        startX = Math.random() * canvas.width;
        startY = -10;
        angle = Math.random() * Math.PI/3 + Math.PI/6; // 30-60 degrees down
      } else {
        // From left
        startX = -10;
        startY = Math.random() * canvas.height * 0.5;
        angle = Math.random() * Math.PI/4 + Math.PI/8; // 22.5-45 degrees
      }

      shootingStars.push({
        x: startX,
        y: startY,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 6 + 4,
        angle: angle,
        opacity: Math.random() * 0.7 + 0.3,
        tail: [],
        life: 0,
        maxLife: Math.random() * 100 + 50,
      });
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw static stars with very subtle twinkling
      staticStars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 0.5 || star.opacity <= 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.fill();
      });

      // Update and draw shooting stars
      shootingStars.forEach((star, index) => {
        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life++;

        // Add to tail
        star.tail.push({ x: star.x, y: star.y, opacity: star.opacity });
        if (star.tail.length > 15) {
          star.tail.shift();
        }

        // Draw tail with gradient effect
        star.tail.forEach((point, i) => {
          const tailOpacity = (point.opacity * (i / star.tail.length)) * 0.8;
          const tailSize = star.size * (i / star.tail.length) * 0.9;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, tailSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${tailOpacity})`;
          ctx.fill();
        });

        // Draw main star with bright glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Add glow effect
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
        ctx.fill();

        // Remove star if it's off screen or life ended
        if (star.x > canvas.width + 50 || star.y > canvas.height + 50 || star.life > star.maxLife) {
          shootingStars.splice(index, 1);
        }
      });

      // Randomly create new shooting stars (more frequent for hero page)
      if (Math.random() < 0.002 && shootingStars.length < 3) {
        createShootingStar();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};
