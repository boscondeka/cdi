import { useEffect, useRef, useCallback } from 'react';

interface WindParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface WindData {
  lat: number;
  lon: number;
  speed: number;
  direction: number;
}

interface WindAnimationProps {
  weatherData: WindData[];
  isPlaying: boolean;
}

export default function WindAnimation({ weatherData, isPlaying }: WindAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<WindParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: WindParticle[] = [];
    const particleCount = 200;

    for (let i = 0; i < particleCount; i++) {
      const windPoint = weatherData[Math.floor(Math.random() * weatherData.length)];
      
      const angleRad = (windPoint.direction * Math.PI) / 180;
      const speed = windPoint.speed * 0.5;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: 1.5 + Math.random() * 2,
      });
    }

    return particles;
  }, [weatherData]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlayingRef.current) {
        particlesRef.current.forEach((particle) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life++;

          // Reset particle if it goes off screen or dies
          if (
            particle.x < -100 ||
            particle.x > canvas.width + 100 ||
            particle.y < -100 ||
            particle.y > canvas.height + 100 ||
            particle.life > particle.maxLife
          ) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.life = 0;
          }

          // Calculate opacity based on life
          const opacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.8;

          // Calculate speed for color
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);

          // Draw particle trail
          const trailLength = Math.min(speed * 4, 40);

          // Color based on wind speed
          let r: number, g: number, b: number;
          if (speed < 5) { r = 74; g = 222; b = 128; } // Green
          else if (speed < 15) { r = 250; g = 204; b = 21; } // Yellow
          else { r = 248; g = 113; b = 113; } // Red

          // Draw trail
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x - particle.vx * trailLength * 0.5,
            particle.y - particle.vy * trailLength * 0.5
          );
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.lineWidth = particle.size;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Draw particle head
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity + 0.2})`;
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [weatherData, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ 
        mixBlendMode: 'screen',
        pointerEvents: 'none'
      }}
    />
  );
}
