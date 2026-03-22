import { useEffect, useRef, useCallback } from 'react';

interface Cloud {
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
  coverage: number;
  blobs: { x: number; y: number; r: number }[];
}

interface CloudData {
  lat: number;
  lon: number;
  coverage: number;
}

interface CloudAnimationProps {
  weatherData: CloudData[];
  isPlaying: boolean;
}

export default function CloudAnimation({ weatherData, isPlaying }: CloudAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);

  // Convert lat/lon to canvas coordinates
  const latLonToCanvas = useCallback((lat: number, lon: number, width: number, height: number) => {
    const x = ((lon - 29) / 6) * width;
    const y = ((4 - lat) / 5) * height;
    return { x, y };
  }, []);

  // Generate cloud blobs
  const generateCloudBlobs = (size: number): { x: number; y: number; r: number }[] => {
    const blobs = [];
    const blobCount = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: (Math.random() - 0.5) * size * 1.5,
        y: (Math.random() - 0.5) * size * 0.5,
        r: size * (0.3 + Math.random() * 0.4),
      });
    }
    
    return blobs;
  };

  // Initialize clouds
  const initClouds = useCallback((width: number, height: number) => {
    const clouds: Cloud[] = [];
    
    weatherData.forEach((data) => {
      if (data.coverage > 0.2) {
        const pos = latLonToCanvas(data.lat, data.lon, width, height);
        const cloudCount = Math.floor(data.coverage * 4);
        
        for (let i = 0; i < cloudCount; i++) {
          const size = 40 + Math.random() * 60;
          clouds.push({
            x: pos.x + (Math.random() - 0.5) * 120,
            y: pos.y + (Math.random() - 0.5) * 80,
            size,
            opacity: data.coverage * 0.7,
            drift: (Math.random() - 0.5) * 0.4,
            coverage: data.coverage,
            blobs: generateCloudBlobs(size),
          });
        }
      }
    });

    return clouds;
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
      cloudsRef.current = initClouds(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlayingRef.current) {
        // Draw coverage areas first
        weatherData.forEach((data) => {
          if (data.coverage > 0.3) {
            const pos = latLonToCanvas(data.lat, data.lon, canvas.width, canvas.height);
            const radius = 80 + data.coverage * 100;

            const gradient = ctx.createRadialGradient(
              pos.x, pos.y, 0,
              pos.x, pos.y, radius
            );

            gradient.addColorStop(0, `rgba(220, 230, 240, ${data.coverage * 0.25})`);
            gradient.addColorStop(0.7, `rgba(200, 210, 230, ${data.coverage * 0.15})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        });

        // Draw clouds
        cloudsRef.current.forEach((cloud) => {
          cloud.x += cloud.drift;

          if (cloud.x > canvas.width + cloud.size) {
            cloud.x = -cloud.size;
          } else if (cloud.x < -cloud.size) {
            cloud.x = canvas.width + cloud.size;
          }

          cloud.blobs.forEach((blob) => {
            const gradient = ctx.createRadialGradient(
              cloud.x + blob.x, cloud.y + blob.y, 0,
              cloud.x + blob.x, cloud.y + blob.y, blob.r
            );

            gradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 0.9})`);
            gradient.addColorStop(0.5, `rgba(240, 245, 250, ${cloud.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(cloud.x + blob.x, cloud.y + blob.y, blob.r, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          });
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
  }, [weatherData, initClouds, latLonToCanvas]);

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
