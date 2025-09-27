import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  speedCategory: 'slow' | 'medium' | 'fast';
}

export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
      
      // Colors for different speed categories
      const colors = {
        slow: ['#6366f1', '#8b5cf6'],     // Blue/purple for slow particles
        medium: ['#06b6d4', '#3b82f6'],   // Cyan/blue for medium particles  
        fast: ['#a855f7', '#ec4899']      // Purple/pink for fast particles
      };
      
      for (let i = 0; i < particleCount; i++) {
        // Determine speed category (30% slow, 50% medium, 20% fast)
        const rand = Math.random();
        let speedCategory: 'slow' | 'medium' | 'fast';
        let speedMultiplier: number;
        
        if (rand < 0.3) {
          speedCategory = 'slow';
          speedMultiplier = 0.2; // Very slow particles
        } else if (rand < 0.8) {
          speedCategory = 'medium';
          speedMultiplier = 0.8; // Medium speed particles
        } else {
          speedCategory = 'fast';
          speedMultiplier = 2.5; // Fast particles
        }
        
        // Base speed with direction
        const baseSpeedX = (Math.random() - 0.5) * speedMultiplier;
        const baseSpeedY = (Math.random() - 0.5) * speedMultiplier;
        
        // Choose color based on speed category
        const categoryColors = colors[speedCategory];
        const color = categoryColors[Math.floor(Math.random() * categoryColors.length)];
        
        // Size based on speed (faster = smaller, slower = larger)
        const size = speedCategory === 'fast' ? Math.random() * 2 + 0.5 : 
                    speedCategory === 'medium' ? Math.random() * 3 + 1 :
                    Math.random() * 4 + 2;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          speedX: baseSpeedX,
          speedY: baseSpeedY,
          opacity: speedCategory === 'fast' ? Math.random() * 0.4 + 0.6 : 
                   speedCategory === 'medium' ? Math.random() * 0.3 + 0.4 :
                   Math.random() * 0.3 + 0.2,
          color: color,
          speedCategory: speedCategory
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle with glow effect for fast particles
        ctx.globalAlpha = particle.opacity;
        
        // Add glow effect for fast particles
        if (particle.speedCategory === 'fast') {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a subtle trail effect for fast particles
        if (particle.speedCategory === 'fast') {
          ctx.globalAlpha = particle.opacity * 0.3;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x - particle.speedX * 3, particle.y - particle.speedY * 3, particle.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
