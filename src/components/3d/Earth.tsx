import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Uganda coordinates (approximately)
const UGANDA_COORDS = { lat: 1.3733, lon: 32.2903 };

// Convert lat/lon to 3D position on sphere
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Weather station locations in Uganda
const WEATHER_STATIONS = [
  { name: 'Kampala', lat: 0.3476, lon: 32.5825, type: 'aws' },
  { name: 'Entebbe', lat: 0.0516, lon: 32.4636, type: 'aws' },
  { name: 'Jinja', lat: 0.4250, lon: 33.2022, type: 'aws' },
  { name: 'Mbale', lat: 1.0756, lon: 34.1756, type: 'aws' },
  { name: 'Mbarara', lat: -0.6072, lon: 30.6545, type: 'aws' },
  { name: 'Gulu', lat: 2.7747, lon: 32.2990, type: 'aws' },
  { name: 'Arua', lat: 3.0201, lon: 30.9111, type: 'aws' },
  { name: 'Fort Portal', lat: 0.6710, lon: 30.2750, type: 'aws' },
];

// Drought monitoring regions
const DROUGHT_REGIONS = [
  { name: 'Karamoja', lat: 2.5000, lon: 34.0000, severity: 'high' },
  { name: 'Teso', lat: 1.5000, lon: 33.5000, severity: 'medium' },
  { name: 'Ankole', lat: -0.5000, lon: 30.5000, severity: 'low' },
  { name: 'Acholi', lat: 3.0000, lon: 32.5000, severity: 'medium' },
];

// Flood prone areas
const FLOOD_AREAS = [
  { name: 'Lake Victoria Basin', lat: 0.2000, lon: 33.0000, risk: 'high' },
  { name: 'Mt. Elgon Slopes', lat: 1.1000, lon: 34.2000, risk: 'medium' },
  { name: 'Rwenzori Region', lat: 0.5000, lon: 30.0000, risk: 'medium' },
];

function EarthSphere({ onRegionClick }: { onRegionClick: (region: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Create earth texture using canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient for earth
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0, '#1a365d');
    gradient.addColorStop(0.3, '#234876');
    gradient.addColorStop(0.5, '#2d5a8f');
    gradient.addColorStop(0.7, '#234876');
    gradient.addColorStop(1, '#1a365d');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add continent-like shapes
    ctx.fillStyle = '#2d5016';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const w = 30 + Math.random() * 100;
      const h = 20 + Math.random() * 60;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.2}
          emissive="#0a1929"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial
          color="#4a90d9"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Weather Stations */}
      {WEATHER_STATIONS.map((station) => {
        const position = latLonToVector3(station.lat, station.lon, 2.05);
        return (
          <group key={station.name} position={position}>
            <mesh
              onPointerOver={() => setHovered(station.name)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#00ff88" />
            </mesh>
            {/* Pulse effect */}
            <PulseRing position={[0, 0, 0]} color="#00ff88" />
            {hovered === station.name && (
              <Html distanceFactor={10}>
                <div className="bg-slate-900/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-emerald-500/50">
                  <div className="font-semibold text-emerald-400">{station.name}</div>
                  <div className="text-slate-300">AWS Station</div>
                  <div className="text-slate-400">Temp: {22 + Math.floor(Math.random() * 8)}°C</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Drought Regions */}
      {DROUGHT_REGIONS.map((region) => {
        const position = latLonToVector3(region.lat, region.lon, 2.08);
        const color = region.severity === 'high' ? '#ef4444' : region.severity === 'medium' ? '#f59e0b' : '#22c55e';
        return (
          <group key={region.name} position={position}>
            <mesh
              onClick={() => onRegionClick({ ...region, type: 'drought' })}
              onPointerOver={() => setHovered(region.name)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
            {/* Warning ring */}
            <WarningRing position={[0, 0, 0]} color={color} />
            {hovered === region.name && (
              <Html distanceFactor={10}>
                <div className="bg-slate-900/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-red-500/50">
                  <div className="font-semibold text-red-400">{region.name}</div>
                  <div className="text-slate-300">Drought: {region.severity.toUpperCase()}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Flood Areas */}
      {FLOOD_AREAS.map((area) => {
        const position = latLonToVector3(area.lat, area.lon, 2.06);
        const color = area.risk === 'high' ? '#3b82f6' : '#06b6d4';
        return (
          <group key={area.name} position={position}>
            <mesh
              onClick={() => onRegionClick({ ...area, type: 'flood' })}
              onPointerOver={() => setHovered(area.name)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
            {/* Water ripple effect */}
            <RippleRing position={[0, 0, 0]} color={color} />
            {hovered === area.name && (
              <Html distanceFactor={10}>
                <div className="bg-slate-900/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-blue-500/50">
                  <div className="font-semibold text-blue-400">{area.name}</div>
                  <div className="text-slate-300">Flood Risk: {area.risk.toUpperCase()}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Uganda highlight */}
      <UgandaHighlight />
    </group>
  );
}

function PulseRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      ringRef.current.scale.set(scale, scale, scale);
    }
    if (materialRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      materialRef.current.opacity = 0.5 - (scale - 1) * 0.5;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <ringGeometry args={[0.04, 0.05, 32]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function WarningRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.4;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (materialRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.4;
      materialRef.current.opacity = 0.6 - (scale - 1) * 0.4;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <ringGeometry args={[0.07, 0.09, 16]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function RippleRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.35;
      ringRef.current.scale.set(scale, scale, scale);
    }
    if (materialRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.35;
      materialRef.current.opacity = 0.4 - (scale - 1) * 0.4;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <ringGeometry args={[0.06, 0.07, 32]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function UgandaHighlight() {
  const position = latLonToVector3(UGANDA_COORDS.lat, UGANDA_COORDS.lon, 2.02);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main highlight */}
      <mesh>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Rotating ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.16, 0.18, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Label */}
      <Html distanceFactor={10} position={[0, 0.25, 0]}>
        <div className="bg-amber-500/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          UGANDA
        </div>
      </Html>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera to focus on Uganda
    const ugandaPos = latLonToVector3(UGANDA_COORDS.lat, UGANDA_COORDS.lon, 5);
    camera.position.copy(ugandaPos);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

interface EarthProps {
  onRegionClick: (region: any) => void;
}

export default function Earth({ onRegionClick }: EarthProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4a90d9" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <EarthSphere onRegionClick={onRegionClick} />
        <CameraController />
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
