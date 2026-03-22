import { useRef, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Plus, 
  Minus, 
  Layers, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  showLayerControl?: boolean;
  availableLayers?: { id: string; label: string; color: string }[];
  activeLayers?: string[];
  onLayerToggle?: (layerId: string) => void;
}

// Map controller to handle zoom/center changes
function MapController({ zoom, center }: { zoom: number; center: [number, number] }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapContainer({
  center = [1.3733, 32.2903],
  zoom = 7,
  children,
  showLayerControl = true,
  availableLayers = [],
  activeLayers = [],
  onLayerToggle,
}: MapContainerProps) {
  const mapRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 3));
  };

  return (
    <div className="relative w-full h-full">
      {/* Leaflet Map */}
      <LeafletMap
        ref={mapRef}
        center={center}
        zoom={currentZoom}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: isDarkMode ? '#0f172a' : '#f1f5f9',
          zIndex: 1
        }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController zoom={currentZoom} center={center} />
        
        {/* Base Tile Layer */}
        <TileLayer
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        {/* Custom children overlays */}
        {children}
      </LeafletMap>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className={`p-2 rounded-lg shadow-lg transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 text-white hover:bg-slate-700' 
              : 'bg-white text-slate-700 hover:bg-gray-50'
          }`}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className={`p-2 rounded-lg shadow-lg transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 text-white hover:bg-slate-700' 
              : 'bg-white text-slate-700 hover:bg-gray-50'
          }`}
        >
          <Minus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Layer Control Button */}
      {showLayerControl && availableLayers.length > 0 && (
        <div className="absolute top-4 right-4 z-[400]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2 ${
              showLayerPanel
                ? 'bg-blue-500 text-white'
                : isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-white text-slate-700 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">Layers</span>
          </motion.button>
        </div>
      )}

      {/* Layer Panel */}
      <AnimatePresence>
        {showLayerPanel && availableLayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute top-16 right-4 z-[400] w-64 rounded-xl shadow-xl ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Map Layers
                </h3>
                <button
                  onClick={() => setShowLayerPanel(false)}
                  className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'text-slate-500'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {availableLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => onLayerToggle?.(layer.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeLayers.includes(layer.id)
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : isDarkMode
                          ? 'hover:bg-slate-700'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className={`text-sm ${
                      activeLayers.includes(layer.id)
                        ? 'text-blue-500 font-medium'
                        : isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {layer.label}
                    </span>
                    {activeLayers.includes(layer.id) && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Attribution */}
      <div className={`absolute bottom-4 left-4 z-[400] px-3 py-1.5 rounded-lg text-xs ${
        isDarkMode 
          ? 'bg-slate-800/80 text-slate-400' 
          : 'bg-white/80 text-slate-500'
      }`}>
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
