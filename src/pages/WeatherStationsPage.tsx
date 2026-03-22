import { useState } from 'react';
import { 
  Radio,
  MapPin,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  Settings,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  AlertTriangle,
  Info,
  BarChart3,
  Filter,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface WeatherStationsPageProps {
  isDarkMode?: boolean;
}

const stationTabs = [
  { id: 'all', label: 'All Stations', icon: Radio },
  { id: 'readings', label: 'Recent Readings', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

const stations = [
  { 
    id: 'AWS001', 
    name: 'Entebbe Airport', 
    region: 'Central',
    status: 'online', 
    temp: 26.5, 
    humidity: 78, 
    wind: 12, 
    pressure: 1013,
    rain: 2.4,
    signal: 95,
    lastUpdate: '2 min ago'
  },
  { 
    id: 'AWS002', 
    name: 'Kampala City', 
    region: 'Central',
    status: 'online', 
    temp: 25.8, 
    humidity: 82, 
    wind: 8, 
    pressure: 1012,
    rain: 3.1,
    signal: 88,
    lastUpdate: '1 min ago'
  },
  { 
    id: 'AWS003', 
    name: 'Jinja', 
    region: 'Eastern',
    status: 'online', 
    temp: 27.2, 
    humidity: 75, 
    wind: 10, 
    pressure: 1011,
    rain: 1.8,
    signal: 92,
    lastUpdate: '5 min ago'
  },
  { 
    id: 'AWS004', 
    name: 'Mbale', 
    region: 'Eastern',
    status: 'online', 
    temp: 23.4, 
    humidity: 85, 
    wind: 6, 
    pressure: 1010,
    rain: 5.2,
    signal: 85,
    lastUpdate: '3 min ago'
  },
  { 
    id: 'AWS005', 
    name: 'Mbarara', 
    region: 'Western',
    status: 'online', 
    temp: 24.1, 
    humidity: 70, 
    wind: 14, 
    pressure: 1014,
    rain: 0.5,
    signal: 90,
    lastUpdate: '4 min ago'
  },
  { 
    id: 'AWS006', 
    name: 'Gulu', 
    region: 'Northern',
    status: 'online', 
    temp: 28.5, 
    humidity: 65, 
    wind: 16, 
    pressure: 1009,
    rain: 0,
    signal: 87,
    lastUpdate: '1 min ago'
  },
  { 
    id: 'AWS007', 
    name: 'Fort Portal', 
    region: 'Western',
    status: 'maintenance', 
    temp: 22.8, 
    humidity: 80, 
    wind: 9, 
    pressure: 1015,
    rain: 1.2,
    signal: 60,
    lastUpdate: '2 hours ago'
  },
  { 
    id: 'AWS008', 
    name: 'Lira', 
    region: 'Northern',
    status: 'offline', 
    temp: 0, 
    humidity: 0, 
    wind: 0, 
    pressure: 0,
    rain: 0,
    signal: 0,
    lastUpdate: '3 days ago'
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-green-400';
    case 'maintenance': return 'text-yellow-400';
    case 'offline': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500/20';
    case 'maintenance': return 'bg-yellow-500/20';
    case 'offline': return 'bg-red-500/20';
    default: return 'bg-slate-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return <Wifi className="w-4 h-4" />;
    case 'maintenance': return <Settings className="w-4 h-4" />;
    case 'offline': return <WifiOff className="w-4 h-4" />;
    default: return <WifiOff className="w-4 h-4" />;
  }
};

export default function WeatherStationsPage({ isDarkMode = true }: WeatherStationsPageProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showLegend, setShowLegend] = useState(true);

  const onlineCount = stations.filter(s => s.status === 'online').length;
  const offlineCount = stations.filter(s => s.status === 'offline').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;

  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';

  return (
    <div className="p-6">
      {/* Animated Background - Signal waves - Only in Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Signal rings */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-green-500/20"
              style={{
                width: `${100 + i * 100}px`,
                height: `${100 + i * 100}px`,
                left: '10%',
                top: '30%',
                animation: `signalPulse ${3 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
          {/* Floating signal dots */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`dot-${i}`}
              className="absolute w-2 h-2 rounded-full bg-green-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Left Sidebar - Filters */}
      <div className="fixed left-0 top-16 bottom-0 w-64 z-20 overflow-y-auto p-4">
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mb-4 ${borderColor}`}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-green-400" />
            <h3 className={`text-sm font-semibold ${textSecondary}`}>Station Filters</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Region</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="All Regions">All Regions</option>
                <option value="Central">Central</option>
                <option value="Eastern">Eastern</option>
                <option value="Western">Western</option>
                <option value="Northern">Northern</option>
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="All Status">All Status</option>
                <option value="online">Online</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Parameter</label>
              <div className="space-y-1">
                {['Temperature', 'Humidity', 'Wind', 'Pressure', 'Rainfall'].map((param) => (
                  <label key={param} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded bg-slate-700 border-slate-600" defaultChecked />
                    <span className={textSecondary}>{param}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 ${borderColor}`}>
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between w-full mb-2"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-400" />
              <h3 className={`text-sm font-semibold ${textSecondary}`}>Status Legend</h3>
            </div>
            {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showLegend && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-xs font-medium">Online</p>
                  <p className={`text-[10px] ${textMuted}`}>Transmitting normally</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-xs font-medium">Maintenance</p>
                  <p className={`text-[10px] ${textMuted}`}>Under maintenance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-xs font-medium">Offline</p>
                  <p className={`text-[10px] ${textMuted}`}>Not transmitting</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mt-4 ${borderColor}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Network Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Total Stations</span>
              <span className="font-medium">{stations.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Online</span>
              <span className="text-green-400 font-medium">{onlineCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Offline</span>
              <span className="text-red-400 font-medium">{offlineCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Data Quality</span>
              <span className="text-blue-400 font-medium">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.9) 0%, rgba(34, 197, 94, 0.6) 100%)' }}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Weather Stations</h1>
                <p className="text-slate-200">Automatic Weather Station (AWS) network monitoring</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs bg-green-500/30 px-2 py-1 rounded-lg text-green-200">
                    <Wifi className="w-3 h-3" />
                    {onlineCount} Online
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-red-500/30 px-2 py-1 rounded-lg text-red-200">
                    <WifiOff className="w-3 h-3" />
                    {offlineCount} Offline
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-blue-500/30 px-2 py-1 rounded-lg text-blue-200">
                    <BarChart3 className="w-3 h-3" />
                    98.5% Uptime
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-sm font-medium text-white transition-colors">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-sm font-medium text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {stationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-green-500/80`
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map & Station List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Network Map */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  Station Network Map
                </h3>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                  {onlineCount} Active
                </span>
              </div>

              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden mb-4">
                <div className="text-center">
                  <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">Interactive Station Map</p>
                  <p className="text-sm text-slate-500 mb-4">AWS locations across Uganda</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-white transition-colors mx-auto">
                    <MapPin className="w-4 h-4" />
                    View Full Map
                  </button>
                </div>
              </div>

              {/* Station Quick List */}
              <div className="grid grid-cols-4 gap-3">
                {stations.slice(0, 4).map((station, index) => (
                  <div key={index} className={`rounded-xl p-3 text-center transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(station.status).replace('text', 'bg')}`}></div>
                      <span className={`text-xs ${textMuted}`}>{station.id}</span>
                    </div>
                    <p className={`text-xs truncate ${textSecondary}`}>{station.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Station Status List */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4">Station Status</h3>
              
              <div className="space-y-3">
                {stations.map((station, index) => (
                  <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusBg(station.status)}`}>
                          {getStatusIcon(station.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{station.name}</p>
                          <p className={`text-xs ${textMuted}`}>{station.id} • {station.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-8 bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${station.signal}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs ${textMuted}`}>{station.signal}%</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-lg ${getStatusBg(station.status)} ${getStatusColor(station.status)}`}>
                          {station.status}
                        </span>
                      </div>
                    </div>

                    {station.status !== 'offline' && (
                      <div className="grid grid-cols-5 gap-4 pt-3 border-t border-slate-600/30">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Thermometer className="w-3 h-3 text-orange-400" />
                            <span className={`text-xs ${textMuted}`}>Temp</span>
                          </div>
                          <p className="text-sm">{station.temp}°C</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            <span className={`text-xs ${textMuted}`}>Humidity</span>
                          </div>
                          <p className="text-sm">{station.humidity}%</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Wind className="w-3 h-3 text-green-400" />
                            <span className={`text-xs ${textMuted}`}>Wind</span>
                          </div>
                          <p className="text-sm">{station.wind} km/h</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Gauge className="w-3 h-3 text-purple-400" />
                            <span className={`text-xs ${textMuted}`}>Pressure</span>
                          </div>
                          <p className="text-sm">{station.pressure} hPa</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <CloudRain className="w-3 h-3 text-cyan-400" />
                            <span className={`text-xs ${textMuted}`}>Rain</span>
                          </div>
                          <p className="text-sm">{station.rain} mm</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Network Overview */}
          <div className="space-y-6">
            {/* Network Overview */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4">Network Overview</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-400">{onlineCount}</p>
                  <p className={`text-xs ${textMuted}`}>Online</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-red-400">{offlineCount}</p>
                  <p className={`text-xs ${textMuted}`}>Offline</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-yellow-400">{maintenanceCount}</p>
                  <p className={`text-xs ${textMuted}`}>Maintenance</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-blue-400">{stations.length}</p>
                  <p className={`text-xs ${textMuted}`}>Total</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${textMuted}`}>Data Quality</span>
                    <span className="text-sm font-medium text-green-400">94%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-green-500 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${textMuted}`}>Network Uptime</span>
                    <span className="text-sm font-medium text-blue-400">98.5%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[98.5%] bg-blue-500 rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* About AWS Network */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                About AWS Network
              </h3>
              
              <p className={`text-sm ${textMuted} mb-4`}>
                Automatic Weather Stations provide real-time meteorological data across Uganda for accurate forecasting and early warning systems.
              </p>

              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  Temperature & Humidity
                </div>
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <Wind className="w-4 h-4 text-green-400" />
                  Wind Speed & Direction
                </div>
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  Precipitation
                </div>
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <Gauge className="w-4 h-4 text-purple-400" />
                  Barometric Pressure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes signalPulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
