import { 
  Cloud, 
  Sun, 
  Waves, 
  Radio,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Layers,
  Filter,
  ChevronDown,
  ArrowRight,
  Info
} from 'lucide-react';
import type { PageType } from '../App';
import { useState } from 'react';

interface OverviewPageProps {
  onNavigate: (page: PageType) => void;
  isDarkMode?: boolean;
}

// FAO Blue color matching the logo
const FAO_BLUE = '#3b82f6';

// Stat cards with thresholds for scale display
const statCards = [
  { 
    label: 'Temperature', 
    value: '26.5°C', 
    change: '+2.3°C', 
    trend: 'up',
    icon: Thermometer, 
    color: 'orange',
    min: 15,
    max: 40,
    thresholds: [
      { value: 20, color: '#3b82f6', label: 'Cool' },
      { value: 28, color: '#22c55e', label: 'Normal' },
      { value: 35, color: '#f97316', label: 'Warm' },
      { value: 40, color: '#dc2626', label: 'Hot' },
    ]
  },
  { 
    label: 'Humidity', 
    value: '68%', 
    change: '-5%', 
    trend: 'down',
    icon: Droplets, 
    color: 'blue',
    min: 0,
    max: 100,
    thresholds: [
      { value: 30, color: '#dc2626', label: 'Dry' },
      { value: 50, color: '#fbbf24', label: 'Low' },
      { value: 70, color: '#22c55e', label: 'Normal' },
      { value: 85, color: '#dc2626', label: 'High' },
    ]
  },
  { 
    label: 'Wind Speed', 
    value: '12 km/h', 
    change: '+3 km/h', 
    trend: 'up',
    icon: Wind, 
    color: 'green',
    min: 0,
    max: 60,
    thresholds: [
      { value: 10, color: '#22c55e', label: 'Calm' },
      { value: 25, color: '#3b82f6', label: 'Breezy' },
      { value: 40, color: '#f97316', label: 'Windy' },
      { value: 60, color: '#dc2626', label: 'Strong' },
    ]
  },
  { 
    label: 'Rainfall (24h)', 
    value: '15.2 mm', 
    change: '+8 mm', 
    trend: 'up',
    icon: CloudRain, 
    color: 'purple',
    min: 0,
    max: 100,
    thresholds: [
      { value: 5, color: '#22c55e', label: 'Dry' },
      { value: 20, color: '#3b82f6', label: 'Light' },
      { value: 50, color: '#f97316', label: 'Moderate' },
      { value: 100, color: '#dc2626', label: 'Heavy' },
    ]
  },
];

const monitoringModules = [
  {
    id: 'weather' as PageType,
    title: 'Weather Forecast',
    description: '48-hour nowcasting & 20-day forecasts with high accuracy predictions',
    icon: Cloud,
    metric: 'Accuracy: 87%',
    alerts: 0,
    color: '#3b82f6',
    bgImage: '/weather-illustration.png',
  },
  {
    id: 'drought' as PageType,
    title: 'Drought Monitor',
    description: 'Combined Drought Index with TDI, PDI, VDI components for risk assessment',
    icon: Sun,
    metric: 'Districts at Risk: 12',
    alerts: 3,
    color: '#f97316',
    bgImage: '/drought-illustration.png',
  },
  {
    id: 'flood' as PageType,
    title: 'Flood Monitor',
    description: 'Real-time river discharge monitoring and early warning systems',
    icon: Waves,
    metric: 'Alert Areas: 8',
    alerts: 2,
    color: '#06b6d4',
    bgImage: '/flood-illustration.png',
  },
  {
    id: 'stations' as PageType,
    title: 'Weather Stations',
    description: 'Automatic Weather Station network monitoring across Uganda',
    icon: Radio,
    metric: 'Online: 7/8',
    alerts: 1,
    color: '#22c55e',
    bgImage: '/stations-illustration.png',
  },
];

const recentAlerts = [
  {
    title: 'Severe drought in Karamoja region',
    location: 'Moroto',
    time: '5 min ago',
    type: 'drought',
    severity: 'high'
  },
  {
    title: 'High flood risk in Lake Victoria Basin',
    location: 'Kalangala',
    time: '12 min ago',
    type: 'flood',
    severity: 'high'
  },
  {
    title: 'Weather station Gulu North offline',
    location: 'Gulu',
    time: '1 hour ago',
    type: 'station',
    severity: 'medium'
  },
  {
    title: 'Heavy rainfall expected in Eastern region',
    location: 'Mbale',
    time: '2 hours ago',
    type: 'weather',
    severity: 'medium'
  },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3" />;
    case 'down': return <TrendingDown className="w-3 h-3" />;
    default: return <Minus className="w-3 h-3" />;
  }
};

const getTrendColor = (trend: string, isDarkMode: boolean) => {
  if (trend === 'up') return 'text-green-500';
  if (trend === 'down') return 'text-red-500';
  return isDarkMode ? 'text-slate-400' : 'text-slate-500';
};

// Threshold Scale Component
const ThresholdScale = ({ 
  value, 
  min, 
  max, 
  thresholds,
  isDarkMode 
}: { 
  value: number; 
  min: number; 
  max: number; 
  thresholds: { value: number; color: string; label: string }[];
  isDarkMode: boolean;
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  const getCurrentColor = () => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i].value) return thresholds[i].color;
    }
    return thresholds[0]?.color || '#3b82f6';
  };
  
  return (
    <div className="mt-2">
      <div className={`relative h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
        <div className="absolute inset-0 flex">
          {thresholds.map((t, i) => {
            const prevValue = i === 0 ? min : thresholds[i - 1].value;
            const width = ((Math.min(t.value, max) - prevValue) / (max - min)) * 100;
            return (
              <div 
                key={i}
                className="h-full"
                style={{ width: `${width}%`, backgroundColor: t.color, opacity: 0.7 }}
              />
            );
          })}
        </div>
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm transition-all duration-500"
          style={{ left: `${percentage}%`, backgroundColor: getCurrentColor(), transform: `translate(-50%, -50%)` }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        {thresholds.map((t, i) => (
          <span key={i} className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.label}</span>
        ))}
      </div>
    </div>
  );
};

// OpenStreetMap Component for Uganda
const UgandaMap = ({ 
  isDarkMode, 
  className = "",
}: { 
  isDarkMode: boolean; 
  className?: string;
}) => {
  const [zoom, setZoom] = useState(7);
  const [layer, setLayer] = useState<'mapnik' | 'cyclemap'>('mapnik');
  
  const baseBBox = { minLon: 29.5, minLat: -1.5, maxLon: 35.0, maxLat: 4.5 };
  
  const getBBox = () => {
    const centerLon = (baseBBox.minLon + baseBBox.maxLon) / 2;
    const centerLat = (baseBBox.minLat + baseBBox.maxLat) / 2;
    const spanLon = (baseBBox.maxLon - baseBBox.minLon) / zoom * 7;
    const spanLat = (baseBBox.maxLat - baseBBox.minLat) / zoom * 7;
    return `${centerLon - spanLon / 2}%2C${centerLat - spanLat / 2}%2C${centerLon + spanLon / 2}%2C${centerLat + spanLat / 2}`;
  };
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${getBBox()}&layer=${layer}`;
  
  return (
    <div className={`relative overflow-hidden rounded-xl md:rounded-2xl ${className}`}>
      <iframe
        src={mapUrl}
        className="w-full h-full border-0"
        title="OpenStreetMap Uganda"
        loading="lazy"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        <button 
          onClick={() => setZoom(z => Math.min(z + 1, 12))}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 1, 5))}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute bottom-2 right-2">
        <button 
          onClick={() => setLayer(l => l === 'mapnik' ? 'cyclemap' : 'mapnik')}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute top-2 left-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium shadow-sm ${isDarkMode ? 'bg-green-500/20 text-green-400 backdrop-blur-sm' : 'bg-green-100 text-green-700'}`}>
          Uganda
        </span>
      </div>
    </div>
  );
};

// Map Filters with Dropdown
const MapFilters = ({ 
  isDarkMode, 
  selectedModule,
  onModuleChange 
}: { 
  isDarkMode: boolean; 
  selectedModule: string;
  onModuleChange: (module: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const modules = [
    { id: 'all', label: 'All Modules', icon: Filter, color: '#3b82f6' },
    { id: 'weather', label: 'Weather Forecast', icon: Cloud, color: '#3b82f6' },
    { id: 'drought', label: 'Drought Monitor', icon: Sun, color: '#f97316' },
    { id: 'flood', label: 'Flood Monitor', icon: Waves, color: '#06b6d4' },
    { id: 'stations', label: 'Weather Stations', icon: Radio, color: '#22c55e' },
  ];
  
  const selected = modules.find(m => m.id === selectedModule) || modules[0];
  const SelectedIcon = selected.icon;
  
  return (
    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800/80 border-slate-700/30' : 'bg-white/90 border-slate-200'} border shadow-sm`}>
      <label className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1.5 block`}>Select Module</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' 
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${selected.color}20` }}>
              <SelectedIcon className="w-3.5 h-3.5" style={{ color: selected.color }} />
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{selected.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-20 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => { onModuleChange(module.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2 p-2.5 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedModule === module.id 
                      ? (isDarkMode ? 'bg-slate-700' : 'bg-blue-50') 
                      : (isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50')
                  }`}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${module.color}20` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: module.color }} />
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{module.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default function OverviewPage({ onNavigate, isDarkMode = true }: OverviewPageProps) {
  const [selectedModule, setSelectedModule] = useState('all');
  
  const cardBg = isDarkMode ? 'bg-slate-800/85' : 'bg-white/95';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="p-4 md:p-6 min-h-screen relative">
      {/* Animated Background - Only in Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse" style={{ backgroundColor: FAO_BLUE, animationDuration: '4s' }} />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse bg-blue-400" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6 animate-fade-in-up">
          <h1 className={`text-xl md:text-2xl font-bold mb-0.5 md:mb-1 ${headerText}`}>Dashboard Overview</h1>
          <p className={`text-sm ${textMuted}`}>Welcome to Uganda Multi Hazard Observatory System</p>
        </div>

        {/* Stat Cards */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Kampala, Central Region</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Live</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              const numericValue = parseFloat(card.value.replace(/[^0-9.]/g, ''));
              return (
                <div 
                  key={index} 
                  className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-sm animate-fade-in-up transition-all hover:shadow-md`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className={`text-[10px] md:text-xs ${textMuted} mb-0.5`}>{card.label}</p>
                      <p className={`text-base md:text-lg font-bold ${headerText}`}>{card.value}</p>
                    </div>
                    <div 
                      className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color === 'orange' ? '#f97316' : card.color === 'blue' ? '#3b82f6' : card.color === 'green' ? '#22c55e' : '#a855f7'}20` }}
                    >
                      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: card.color === 'orange' ? '#f97316' : card.color === 'blue' ? '#3b82f6' : card.color === 'green' ? '#22c55e' : '#a855f7' }} />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] ${getTrendColor(card.trend, isDarkMode)}`}>
                    {getTrendIcon(card.trend)}
                    <span>{card.change}</span>
                  </div>
                  <ThresholdScale value={numericValue} min={card.min} max={card.max} thresholds={card.thresholds} isDarkMode={isDarkMode} />
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="block lg:hidden space-y-3">
          {/* Monitoring Modules - Mobile */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-500" />
              <h2 className={`text-sm font-semibold ${headerText}`}>Monitoring Modules</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {monitoringModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => onNavigate(module.id)}
                    className="relative overflow-hidden rounded-lg p-3 text-left shadow-sm transition-all hover:shadow-md group"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, ${isDarkMode ? 'rgba(30, 41, 59, 0.97)' : 'rgba(255, 255, 255, 0.97)'}, ${isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)'}), url(${module.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${module.color}25` }}>
                          <Icon className="w-4 h-4" style={{ color: module.color }} />
                        </div>
                        <div className="flex items-center gap-1">
                          <Info className="w-3 h-3 text-slate-400" />
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <p className={`text-xs font-semibold ${headerText} mb-0.5`}>{module.title}</p>
                      <p className={`text-[10px] ${textMuted} line-clamp-2`}>{module.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Section - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg overflow-hidden shadow-sm`}>
            <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
              <div className="flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />
                <h2 className={`text-xs font-semibold ${headerText}`}>Uganda Map</h2>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>Live</span>
            </div>
            <div className="relative aspect-[4/3]">
              <UgandaMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
            </div>
          </div>

          {/* Map Filters - Mobile */}
          <MapFilters isDarkMode={isDarkMode} selectedModule={selectedModule} onModuleChange={setSelectedModule} />

          {/* Recent Alerts - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-2.5 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-orange-500" />
                <h2 className={`text-xs font-semibold ${headerText}`}>Recent Alerts</h2>
              </div>
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[10px] font-medium">4 New</span>
            </div>
            <div className="space-y-1.5">
              {recentAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900/50 border-slate-700/30' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                      <AlertTriangle className={`w-3 h-3 ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-medium truncate ${headerText}`}>{alert.title}</p>
                      <div className={`flex items-center gap-2 text-[10px] ${textMuted}`}>
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{alert.location}</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Filters starting same line as map */}
          <div className="lg:col-span-3 flex flex-col">
            <div 
              className="flex-1 rounded-xl p-3 shadow-sm flex flex-col"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(180deg, rgba(30, 58, 138, 0.3) 0%, rgba(30, 58, 138, 0.15) 100%)' 
                  : 'linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
              }}
            >
              <MapFilters isDarkMode={isDarkMode} selectedModule={selectedModule} onModuleChange={setSelectedModule} />
              
              <div className={`mt-3 p-3 rounded-xl ${isDarkMode ? 'bg-slate-800/60' : 'bg-white/70'} border ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
                <h3 className={`text-xs font-semibold mb-2 ${headerText}`}>Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${textMuted}`}>Active Alerts</span>
                    <span className="text-[11px] font-medium text-red-500">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${textMuted}`}>Stations Online</span>
                    <span className="text-[11px] font-medium text-green-500">7/8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${textMuted}`}>Updated</span>
                    <span className={`text-[11px] ${textSecondary}`}>2 min ago</span>
                  </div>
                </div>
              </div>

              {/* Illustration at bottom */}
              <div className="mt-auto pt-3">
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{ 
                    backgroundImage: 'url(/climate-illustration.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '120px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-4">
            {/* Monitoring Modules Section with Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  <h2 className={`text-base font-semibold ${headerText}`}>Monitoring Modules</h2>
                </div>
                <button className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {monitoringModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => onNavigate(module.id)}
                      className="relative overflow-hidden rounded-xl p-4 text-left shadow-sm transition-all hover:shadow-md group"
                      style={{ 
                        backgroundImage: `linear-gradient(to right, ${isDarkMode ? 'rgba(30, 41, 59, 0.97)' : 'rgba(255, 255, 255, 0.97)'}, ${isDarkMode ? 'rgba(30, 41, 59, 0.88)' : 'rgba(255, 255, 255, 0.88)'}), url(${module.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '140px',
                      }}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${module.color}25` }}>
                            <Icon className="w-5 h-5" style={{ color: module.color }} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-slate-400 hover:text-slate-300 transition-colors" />
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${headerText} mb-1`}>{module.title}</p>
                        <p className={`text-[11px] ${textMuted} line-clamp-2 leading-relaxed`}>{module.description}</p>
                        <p className={`text-[10px] mt-2 font-medium`} style={{ color: module.color }}>{module.metric}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map and Alerts Row */}
            <div className="grid grid-cols-12 gap-4">
              {/* Map Section - 8 columns */}
              <div className="col-span-8">
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl overflow-hidden shadow-sm h-full`}>
                  <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
                    <div className="flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4" style={{ color: FAO_BLUE }} />
                      <h2 className={`text-sm font-semibold ${headerText}`}>Uganda Map View</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] ${textMuted}`}>Lat: 1.3733° N</span>
                      <span className={`text-[11px] ${textMuted}`}>Long: 32.2903° E</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>Live</span>
                    </div>
                  </div>
                  <div className="relative aspect-[16/9]">
                    <UgandaMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Recent Alerts - 4 columns */}
              <div className="col-span-4">
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl p-3 shadow-sm h-full flex flex-col`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-orange-500" />
                      <h3 className={`text-sm font-semibold ${headerText}`}>Recent Alerts</h3>
                    </div>
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[10px] font-medium">4 New</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {recentAlerts.slice(0, 3).map((alert, idx) => (
                      <div key={idx} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900/50 border-slate-700/30' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                            <AlertTriangle className={`w-3.5 h-3.5 ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-medium truncate ${headerText}`}>{alert.title}</p>
                            <div className={`flex items-center gap-2 text-[10px] ${textMuted}`}>
                              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{alert.location}</span>
                              <span>{alert.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-6 pt-4 border-t ${borderColor}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between text-xs ${textMuted} gap-1`}>
            <p>© 2025 FAO Uganda. All Rights Reserved.</p>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              System Operational
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
