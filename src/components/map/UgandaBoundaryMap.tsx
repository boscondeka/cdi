import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { geoAPI } from '../../services/api';

interface LegendItem {
  label: string;
  color: string;
}

interface UgandaBoundaryMapProps {
  className?: string;
  isDarkMode: boolean;
  badgeText?: string;
  legendTitle?: string;
  legendItems?: LegendItem[];
}

const FAO_BLUE = '#318DDE';

export default function UgandaBoundaryMap({
  className = '',
  isDarkMode,
  badgeText = 'Uganda',
  legendTitle,
  legendItems = [],
}: UgandaBoundaryMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const data = await geoAPI.getUgandaBoundary();
        setGeoData(data);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
      }
    };
    loadGeoData();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <MapContainer
          center={[1.3733, 32.2903]}
          zoom={7}
          style={{ height: '100%', width: '100%', background: isDarkMode ? '#0f172a' : '#f1f5f9' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url={
              isDarkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            }
          />
          {geoData && (
            <GeoJSON
              data={geoData}
              style={{
                fillColor: 'transparent',
                weight: 2,
                opacity: 1,
                color: FAO_BLUE,
                dashArray: '3',
                fillOpacity: 0,
              }}
            />
          )}
        </MapContainer>
      </div>

      {legendTitle && legendItems.length > 0 && (
        <div className={`absolute bottom-2 left-2 z-[400] rounded-lg p-2 shadow-sm ${isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'}`}>
          <div className={`mb-1 text-[10px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{legendTitle}</div>
          <div className="space-y-1">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 z-[400]">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-medium shadow-sm"
          style={{
            backgroundColor: isDarkMode ? `${FAO_BLUE}33` : `${FAO_BLUE}22`,
            color: FAO_BLUE,
          }}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
}
