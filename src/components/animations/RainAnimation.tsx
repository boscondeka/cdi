import { useEffect, useRef, useCallback } from 'react';

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  intensity: number;
}

interface PrecipitationData {
  lat: number;
  lon: number;
  intensity: number;
}

interface RainAnimationProps {
  weatherData: PrecipitationData[];
  isPlaying: boolean;
}

export default function RainAnimation({ weatherData, isPlaying }: RainAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<RainDrop[]>([]);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);

  // Convert lat/lon to canvas coordinates
  const latLonToCanvas = useCallback((lat: number, lon: number, width: number, height: number) => {
    const x = ((lon - 29) / 6) * width;
    const y = ((4 - lat) / 5) * height;
    return { x, y };
  }, []);

  // Initialize rain drops
  const initDrops = useCallback((width: number, height: number) => {
    const drops: RainDrop[] = [];
    
    weatherData.forEach((data) => {
      if (data.intensity > 0.1) {
        const pos = latLonToCanvas(data.lat, data.lon, width, height);
        const dropCount = Math.floor(data.intensity * 30);
        
        for (let i = 0; i < dropCount; i++) {
          drops.push({
            x: pos.x + (Math.random() - 0.5) * 100,
            y: Math.random() * height,
            length: 15 + Math.random() * 25,
            speed: 10 + data.intensity * 20,
            opacity: data.intensity * 0.8,
            intensity: data.intensity,
          });
        }
      }
    });

    return drops;
  }, [weatherData, latLonToCanvas]);

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
      dropsRef.current = initDrops(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlayingRef.current) {
        // Draw precipitation areas first (background glow)
        weatherData.forEach((data) => {
          if (data.intensity > 0.1) {
            const pos = latLonToCanvas(data.lat, data.lon, canvas.width, canvas.height);
            const radius = 50 + data.intensity * 80;

            const gradient = ctx.createRadialGradient(
              pos.x, pos.y, 0,
              pos.x, pos.y, radius
            );

            let r: number, g: number, b: number;
            if (data.intensity < 0.3) { r = 147; g = 197; b = 253; }
            else if (data.intensity < 0.6) { r = 59; g = 130; b = 246; }
            else { r = 124; g = 58; b = 237; }

            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${data.intensity * 0.4})`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${data.intensity * 0.2})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        });

        // Draw rain drops
        dropsRef.current.forEach((drop) => {
          drop.y += drop.speed;

          if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x += (Math.random() - 0.5) * 30;
          }

          let r: number, g: number, b: number;
          if (drop.intensity < 0.3) { r = 147; g = 197; b = 253; }
          else if (drop.intensity < 0.6) { r = 59; g = 130; b = 246; }
          else { r = 124; g = 58; b = 237; }

          // Draw drop
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
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
  }, [weatherData, initDrops, latLonToCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
