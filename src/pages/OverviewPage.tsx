import { 
  Cloud, 
  Sun, 
  Waves, 
  Radio,
  ArrowRight,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Download,
  Share2,
  RefreshCw,
  Bell,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Layers
} from 'lucide-react';
import type { PageType } from '../App';

interface OverviewPageProps {
  onNavigate: (page: PageType) => void;
  isDarkMode?: boolean;
}

const statCards = [
  { 
    label: 'Temperature', 
    value: '26.5°C', 
    change: '+2.3°C', 
    trend: 'up',
    icon: Thermometer, 
    color: 'orange'
  },
  { 
    label: 'Humidity', 
    value: '68%', 
    change: '-5%', 
    trend: 'down',
    icon: Droplets, 
    color: 'blue'
  },
  { 
    label: 'Wind Speed', 
    value: '12 km/h', 
    change: '+3 km/h', 
    trend: 'up',
    icon: Wind, 
    color: 'green'
  },
  { 
    label: 'Rainfall (24h)', 
    value: '15.2 mm', 
    change: '+8 mm', 
    trend: 'up',
    icon: CloudRain, 
    color: 'purple'
  },
];

const monitoringModules = [
  {
    id: 'weather' as PageType,
    title: 'Weather Forecast',
    description: '48-hour nowcasting & 20-day medium range forecasts',
    icon: Cloud,
    metric: 'Accuracy: 87%',
    alerts: 0,
    alertColor: '',
    gradient: 'from-blue-600 to-blue-800',
    iconBg: 'bg-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'drought' as PageType,
    title: 'Drought Monitor',
    description: 'Combined Drought Index (CDI) with TDI, PDI, VDI components',
    icon: Sun,
    metric: 'Districts at Risk: 12',
    alerts: 3,
    alertColor: 'bg-red-500/80',
    gradient: 'from-orange-600 to-orange-800',
    iconBg: 'bg-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    id: 'flood' as PageType,
    title: 'Flood Monitor',
    description: 'Real-time water levels, river discharge & early warnings',
    icon: Waves,
    metric: 'Alert Areas: 8',
    alerts: 2,
    alertColor: 'bg-red-500/80',
    gradient: 'from-cyan-600 to-cyan-800',
    iconBg: 'bg-cyan-500',
    bgColor: 'bg-cyan-500/10'
  },
  {
    id: 'stations' as PageType,
    title: 'Weather Stations',
    description: 'Automatic Weather Station (AWS) network monitoring',
    icon: Radio,
    metric: 'Online: 7/8',
    alerts: 1,
    alertColor: 'bg-yellow-500/80',
    gradient: 'from-green-600 to-green-800',
    iconBg: 'bg-green-500',
    bgColor: 'bg-green-500/10'
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

const districtDroughtStatus = [
  { name: 'Moroto', value: 0.25, status: 'Extreme', color: '#7f1d1d' },
  { name: 'Kotido', value: 0.42, status: 'Severe', color: '#dc2626' },
  { name: 'Kaabong', value: 0.48, status: 'Severe', color: '#dc2626' },
  { name: 'Napak', value: 0.65, status: 'Moderate', color: '#f97316' },
  { name: 'Abim', value: 0.72, status: 'Moderate', color: '#f97316' },
  { name: 'Amudat', value: 0.85, status: 'Mild', color: '#eab308' },
  { name: 'Karenga', value: 0.92, status: 'Mild', color: '#eab308' },
  { name: 'Nabilatuk', value: 1.05, status: 'Normal', color: '#22c55e' },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3" />;
    case 'down': return <TrendingDown className="w-3 h-3" />;
    default: return <Minus className="w-3 h-3" />;
  }
};

const getTrendColor = (trend: string, isDarkMode: boolean) => {
  if (trend === 'up') return 'text-green-400';
  if (trend === 'down') return 'text-red-400';
  return isDarkMode ? 'text-slate-400' : 'text-slate-500';
};

// OpenStreetMap Component for Uganda
const UgandaMap = ({ isDarkMode, className = "" }: { isDarkMode: boolean; className?: string }) => {
  const [zoom, setZoom] = useState(7);
  const [layer, setLayer] = useState<'mapnik' | 'cyclemap'>('mapnik');
  
  // Uganda bounding box coordinates (approximate)
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
      
      {/* Map Controls Overlay */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        <button 
          onClick={() => setZoom(z => Math.min(z + 1, 12))}
          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 1, 5))}
          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
      
      {/* Layer Toggle */}
      <div className="absolute bottom-3 right-3">
        <button 
          onClick={() => setLayer(l => l === 'mapnik' ? 'cyclemap' : 'mapnik')}
          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-slate-100 text-slate-800'}`}
        >
          <Layers className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
      
      {/* OpenStreetMap Attribution */}
      <div className="absolute bottom-3 left-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-sm text-[10px] md:text-xs ${isDarkMode ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-700'}`}>
          <MapIcon className="w-3 h-3" />
          <span className="font-medium">OpenStreetMap</span>
        </div>
      </div>
      
      {/* Location Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
          Uganda
        </span>
      </div>
    </div>
  );
};

// Import useState for the map component
import { useState } from 'react';

export default function OverviewPage({ onNavigate, isDarkMode = true }: OverviewPageProps) {
  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';

  return (
    <div className="p-4 md:p-6">
      {/* Animated Background - Only in Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse bg-blue-500" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse bg-purple-400" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute -bottom-40 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15 animate-pulse bg-cyan-400" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30 animate-float bg-blue-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dashboard Overview</h1>
          <p className={`text-sm md:text-base ${textMuted}`}>Welcome to Uganda Multi Hazard Observatory System</p>
        </div>

        {/* Stat Cards - Horizontal scroll on mobile */}
        <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index} 
                className={`flex-shrink-0 w-36 md:w-auto ${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl md:rounded-2xl p-3 md:p-5 card-hover animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2 md:mb-4">
                  <div>
                    <p className={`text-xs md:text-sm ${textMuted} mb-0.5 md:mb-1`}>{card.label}</p>
                    <p className="text-lg md:text-2xl font-bold">{card.value}</p>
                  </div>
                  <div className={`w-8 h-8 md:w-12 md:h-12 bg-${card.color}-500/20 rounded-lg md:rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 md:w-6 md:h-6 text-${card.color}-400`} />
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(card.trend, isDarkMode)}`}>
                  {getTrendIcon(card.trend)}
                  <span>{card.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE LAYOUT: Map Second, Then Alerts (Monitoring Modules Hidden) */}
        <div className="block lg:hidden space-y-6">
          {/* OpenStreetMap - Mobile (Second Item) */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl md:rounded-2xl overflow-hidden animate-fade-in-up`}>
            {/* Map Header */}
            <div className={`flex items-center justify-between p-3 md:p-4 border-b ${borderColor}`}>
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <h2 className="text-sm md:text-lg font-semibold">Uganda Map View</h2>
              </div>
              <span className={`px-2 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                Live
              </span>
            </div>
            
            {/* Map Container */}
            <div className="relative aspect-[4/3] md:aspect-video">
              <UgandaMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
            </div>
            
            {/* Map Footer */}
            <div className={`flex items-center justify-between p-2 md:p-3 text-[10px] md:text-xs ${textMuted}`}>
              <div className="flex items-center gap-2 md:gap-4">
                <span>Lat: 1.3733° N</span>
                <span>Long: 32.2903° E</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <span>OpenStreetMap</span>
                <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>● Live</span>
              </div>
            </div>
          </div>

          {/* Recent Alerts - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl md:rounded-2xl p-3 md:p-5 animate-fade-in-up`}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                <h2 className="text-base md:text-lg font-semibold">Recent Alerts</h2>
              </div>
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-red-500/20 text-red-400 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium">
                4 New
              </span>
            </div>

            <div className="space-y-2 md:space-y-3">
              {recentAlerts.slice(0, 3).map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-2 md:p-3 rounded-lg md:rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-700/30 hover:border-slate-600/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      <AlertTriangle className={`w-3 h-3 md:w-4 md:h-4 ${
                        alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium mb-0.5 md:mb-1 truncate">{alert.title}</p>
                      <div className={`flex items-center gap-1 md:gap-3 text-[10px] md:text-xs ${textMuted}`}>
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          {alert.location}
                        </span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT: Original 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monitoring Modules - Desktop Only */}
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Monitoring Modules</h2>
                </div>
                <button className={`flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors`}>
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monitoringModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => onNavigate(module.id)}
                      className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all card-hover ${borderColor} border hover:border-slate-500/50 ${isDarkMode ? 'bg-slate-800/30' : 'bg-white/50'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Alert Badge */}
                      {module.alerts > 0 && (
                        <div className={`absolute top-4 right-4 px-2 py-1 ${module.alertColor} rounded-lg text-xs font-medium text-white`}>
                          {module.alerts} Alert{module.alerts > 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${module.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                          <p className={`text-sm ${textMuted} mb-3`}>{module.description}</p>
                          <div className={`flex items-center justify-between`}>
                            <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                              <Activity className="w-4 h-4" />
                              <span>{module.metric}</span>
                            </div>
                            <ArrowRight className={`w-5 h-5 ${textMuted} group-hover:text-white group-hover:translate-x-1 transition-all`} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OpenStreetMap - Desktop */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl overflow-hidden animate-fade-in-up`}>
              {/* Map Header */}
              <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Uganda Map View</h2>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  Live
                </span>
              </div>
              
              {/* Map Container */}
              <div className="relative aspect-video">
                <UgandaMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
              </div>
              
              {/* Map Footer */}
              <div className={`flex items-center justify-between p-3 text-xs ${textMuted}`}>
                <div className="flex items-center gap-4">
                  <span>Lat: 1.3733° N</span>
                  <span>Long: 32.2903° E</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>OpenStreetMap</span>
                  <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>● Live</span>
                </div>
              </div>
            </div>

            {/* District Drought Status */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">District Drought Status</h2>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View Map
                </button>
              </div>

              <div className="space-y-3">
                {districtDroughtStatus.map((district, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className={`text-sm w-24 ${textSecondary}`}>{district.name}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(district.value / 1.5) * 100}%`, 
                          backgroundColor: district.color,
                          transitionDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    </div>
                    <span className={`text-xs w-16 text-right ${textMuted}`}>{district.status}</span>
                    <span className="text-xs w-12 text-right font-medium" style={{ color: district.color }}>{district.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">Recent Alerts</h2>
                </div>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                  4 New
                </span>
              </div>

              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-700/30 hover:border-slate-600/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.severity === 'high' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1 truncate">{alert.title}</p>
                        <div className={`flex items-center gap-3 text-xs ${textMuted}`}>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up`}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">System Health</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${textMuted}`}>Data Ingestion</span>
                    <span className="text-sm font-medium text-green-400">98.5%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[98.5%] bg-green-500 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${textMuted}`}>API Response</span>
                    <span className="text-sm font-medium text-green-400">99.2%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[99.2%] bg-green-500 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${textMuted}`}>Station Uptime</span>
                    <span className="text-sm font-medium text-yellow-400">87.5%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[87.5%] bg-yellow-500 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/30">
                <p className={`text-xs ${textMuted} text-center`}>
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  Last updated: 2 min ago
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up`}>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                  <Download className="w-5 h-5 text-blue-400" />
                  <span className={`text-sm ${textSecondary}`}>Export Report</span>
                </button>
                <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                  <Share2 className="w-5 h-5 text-green-400" />
                  <span className={`text-sm ${textSecondary}`}>Share Dashboard</span>
                </button>
              </div>
            </div>

            {/* Data Sources */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up`}>
              <h2 className="text-lg font-semibold mb-4">Data Sources</h2>
              <div className="space-y-3">
                {[
                  { name: 'UNMA', status: 'Active', color: 'green' },
                  { name: 'FAO SWALIM', status: 'Active', color: 'green' },
                  { name: 'NASA POWER', status: 'Active', color: 'green' },
                  { name: 'CHIRPS', status: 'Syncing', color: 'yellow' },
                ].map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${textSecondary}`}>{source.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      source.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {source.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-6 md:mt-8 pt-4 md:pt-6 border-t ${borderColor}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between text-xs md:text-sm ${textMuted} gap-2`}>
            <p>© 2025 FAO Uganda. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Operational
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
