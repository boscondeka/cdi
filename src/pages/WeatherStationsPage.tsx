import { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';

interface WeatherStationsPageProps {
  isDarkMode?: boolean;
}

const FAO_BLUE = '#318DDE';

const stationTabs = [
  { id: 'all', label: 'All Stations', icon: Radio },
  { id: 'readings', label: 'Recent Readings', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

const stations = [
  { id: 'AWS001', name: 'Entebbe Airport', region: 'Central', status: 'online', temp: 26.5, humidity: 78, wind: 12, pressure: 1013, rain: 2.4, signal: 95, lastUpdate: '2 min ago' },
  { id: 'AWS002', name: 'Kampala City', region: 'Central', status: 'online', temp: 25.8, humidity: 82, wind: 8, pressure: 1012, rain: 3.1, signal: 88, lastUpdate: '1 min ago' },
  { id: 'AWS003', name: 'Jinja', region: 'Eastern', status: 'online', temp: 27.2, humidity: 75, wind: 10, pressure: 1011, rain: 1.8, signal: 92, lastUpdate: '5 min ago' },
  { id: 'AWS004', name: 'Mbale', region: 'Eastern', status: 'online', temp: 23.4, humidity: 85, wind: 6, pressure: 1010, rain: 5.2, signal: 85, lastUpdate: '3 min ago' },
  { id: 'AWS005', name: 'Mbarara', region: 'Western', status: 'online', temp: 24.1, humidity: 70, wind: 14, pressure: 1014, rain: 0.5, signal: 90, lastUpdate: '4 min ago' },
  { id: 'AWS006', name: 'Gulu', region: 'Northern', status: 'online', temp: 28.5, humidity: 65, wind: 16, pressure: 1009, rain: 0, signal: 87, lastUpdate: '1 min ago' },
  { id: 'AWS007', name: 'Fort Portal', region: 'Western', status: 'maintenance', temp: 22.8, humidity: 80, wind: 9, pressure: 1015, rain: 1.2, signal: 60, lastUpdate: '2 hours ago' },
  { id: 'AWS008', name: 'Lira', region: 'Northern', status: 'offline', temp: 0, humidity: 0, wind: 0, pressure: 0, rain: 0, signal: 0, lastUpdate: '3 days ago' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-green-500';
    case 'maintenance': return 'text-yellow-500';
    case 'offline': return 'text-red-500';
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

// Map Component with Legend
const StationMap = ({ isDarkMode, className = "" }: { isDarkMode: boolean; className?: string }) => {
  const [showLegend, setShowLegend] = useState(true);
  
  const legendItems = [
    { label: 'Online', color: '#22c55e' },
    { label: 'Maintenance', color: '#eab308' },
    { label: 'Offline', color: '#ef4444' },
  ];
  
  return (
    <div className={`relative overflow-hidden rounded-lg md:rounded-xl ${className}`}>
      <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="text-center p-4">
          <Radio className="w-12 h-12 md:w-14 md:h-14 text-slate-400 mx-auto mb-2" />
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Interactive Station Map</p>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>AWS locations across Uganda</p>
          <button 
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors mx-auto"
            style={{ backgroundColor: FAO_BLUE }}
          >
            <MapPin className="w-3 h-3" />View Full Map
          </button>
        </div>
      </div>
      
      {/* Map Legend */}
      {showLegend && (
        <div className={`absolute bottom-2 left-2 rounded-lg p-2 shadow-sm ${isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Stations</span>
            <button 
              onClick={() => setShowLegend(false)}
              className={`text-[10px] ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="absolute top-2 left-2">
        <span 
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium shadow-sm`}
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
            color: '#22c55e'
          }}
        >
          7 Active
        </span>
      </div>
    </div>
  );
};

export default function WeatherStationsPage({ isDarkMode = true }: WeatherStationsPageProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const onlineCount = stations.filter(s => s.status === 'online').length;
  const offlineCount = stations.filter(s => s.status === 'offline').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;

  const cardBg = isDarkMode ? 'bg-slate-800/85' : 'bg-white/95';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';

  const FilterContent = () => (
    <div className="space-y-3">
      <div>
        <label className={`text-xs ${textMuted} mb-1 block`}>Region</label>
        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <option value="All Regions">All Regions</option>
          <option value="Central">Central</option>
          <option value="Eastern">Eastern</option>
          <option value="Western">Western</option>
          <option value="Northern">Northern</option>
        </select>
      </div>
      <div>
        <label className={`text-xs ${textMuted} mb-1 block`}>Status</label>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <option value="All Status">All Status</option>
          <option value="online">Online</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <div>
        <label className={`text-xs ${textMuted} mb-1 block`}>Parameter</label>
        <div className="space-y-1.5">
          {['Temperature', 'Humidity', 'Wind', 'Pressure', 'Rainfall'].map((param) => (
            <label key={param} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className={`rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} defaultChecked />
              <span className={textSecondary}>{param}</span>
            </label>
          ))}
        </div>
      </div>
      <div className={`pt-3 border-t ${borderColor}`}>
        <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Network Stats</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs"><span className={textMuted}>Total Stations</span><span className={`font-medium ${headerText}`}>{stations.length}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Online</span><span className="text-green-500 font-medium">{onlineCount}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Offline</span><span className="text-red-500 font-medium">{offlineCount}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Data Quality</span><span className="font-medium" style={{ color: FAO_BLUE }}>94%</span></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" 
            style={{ borderColor: `${FAO_BLUE}30`, borderTopColor: FAO_BLUE }}>
          </div>
          <p className={textMuted}>Loading Weather Stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Animated Background */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-blue-500/20" style={{ width: `${100 + i * 100}px`, height: `${100 + i * 100}px`, left: '10%', top: '30%', animation: `signalPulse ${3 + i * 0.5}s ease-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      )}

      {/* Mobile Filter Button - Next to Map */}
      <button 
        onClick={() => setShowMobileFilters(true)} 
        className="lg:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-white"
        style={{ backgroundColor: FAO_BLUE }}
      >
        <Filter className="w-4 h-4" />
        <span className="text-xs">Open Filter</span>
      </button>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-72 p-4 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-semibold ${headerText}`}>Station Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Header Banner - No alert buttons */}
        <div 
          className="relative overflow-hidden rounded-lg md:rounded-xl p-3 md:p-4 mb-3 animate-fade-in-up"
          style={{ background: `linear-gradient(135deg, ${FAO_BLUE}e6 0%, ${FAO_BLUE}99 100%)` }}
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">Weather Stations</h1>
                <p className="text-slate-200 text-xs md:text-sm">AWS network monitoring</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span 
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <Wifi className="w-3 h-3" />{onlineCount} Online
                  </span>
                  <span 
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <WifiOff className="w-3 h-3" />{offlineCount} Offline
                  </span>
                  <span 
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <BarChart3 className="w-3 h-3" />98.5% Uptime
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors">
                  <Download className="w-3 h-3" /><span className="hidden sm:inline">Export</span>
                </button>
                <button 
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                  style={{ backgroundColor: FAO_BLUE }}
                >
                  <RefreshCw className="w-3 h-3" /><span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Filter next to map */}
          <div className="lg:col-span-3 flex flex-col">
            <div 
              className="flex-1 rounded-xl p-3 shadow-sm flex flex-col"
              style={{ 
                background: isDarkMode 
                  ? `linear-gradient(180deg, ${FAO_BLUE}30 0%, ${FAO_BLUE}15 100%)` 
                  : `linear-gradient(180deg, ${FAO_BLUE}15 0%, ${FAO_BLUE}05 100%)`,
                border: `1px solid ${isDarkMode ? `${FAO_BLUE}30` : `${FAO_BLUE}15`}`,
              }}
            >
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800/80' : 'bg-white/90'} border ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
                <FilterContent />
              </div>

              {/* Illustration at bottom */}
              <div className="mt-auto pt-3">
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{ 
                    backgroundImage: 'url(/stations-illustration.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '140px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-3">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {stationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-white' 
                        : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`
                    }`}
                    style={{ backgroundColor: activeTab === tab.id ? FAO_BLUE : undefined }}
                  >
                    <Icon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                );
              })}
            </div>

            {/* Map and Network Overview Row */}
            <div className="grid grid-cols-12 gap-3">
              {/* Map - 8 columns */}
              <div className="col-span-8">
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg overflow-hidden shadow-sm h-full`}>
                  <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" style={{ color: FAO_BLUE }} />
                      <h3 className={`text-sm font-semibold ${headerText}`}>Station Network Map</h3>
                    </div>
                    <span 
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e'
                      }}
                    >
                      {onlineCount} Active
                    </span>
                  </div>
                  <div className="aspect-video">
                    <StationMap isDarkMode={isDarkMode} className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Network Overview - 4 columns */}
              <div className="col-span-4">
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm h-full`}>
                  <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Network Overview</h3>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                      <p className="text-xl font-bold text-green-500">{onlineCount}</p>
                      <p className={`text-[10px] ${textMuted}`}>Online</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                      <p className="text-xl font-bold text-red-500">{offlineCount}</p>
                      <p className={`text-[10px] ${textMuted}`}>Offline</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                      <p className="text-xl font-bold text-yellow-500">{maintenanceCount}</p>
                      <p className={`text-[10px] ${textMuted}`}>Maintenance</p>
                    </div>
                    <div className="rounded-lg p-2 border" style={{ backgroundColor: `${FAO_BLUE}10`, borderColor: `${FAO_BLUE}30` }}>
                      <p className="text-xl font-bold" style={{ color: FAO_BLUE }}>{stations.length}</p>
                      <p className={`text-[10px] ${textMuted}`}>Total</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs ${textMuted}`}>Data Quality</span>
                        <span className="text-xs font-medium" style={{ color: FAO_BLUE }}>94%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full rounded-full" style={{ width: '94%', backgroundColor: FAO_BLUE }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs ${textMuted}`}>Network Uptime</span>
                        <span className="text-xs font-medium" style={{ color: FAO_BLUE }}>98.5%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full rounded-full" style={{ width: '98.5%', backgroundColor: FAO_BLUE }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Station Status List - With Scrollbar */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Station Status</h3>
              <div className="overflow-x-auto">
                <div className="space-y-2 min-w-[600px]">
                  {stations.map((station, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStatusBg(station.status)}`}>
                            {getStatusIcon(station.status)}
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${headerText}`}>{station.name}</p>
                            <p className={`text-[10px] ${textMuted}`}>{station.id} • {station.region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="hidden sm:flex items-center gap-1">
                            <div className={`h-1 w-5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                              <div className="h-full rounded-full" style={{ width: `${station.signal}%`, backgroundColor: FAO_BLUE }}></div>
                            </div>
                            <span className={`text-[10px] ${textMuted}`}>{station.signal}%</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${getStatusBg(station.status)} ${getStatusColor(station.status)}`}>{station.status}</span>
                        </div>
                      </div>
                      {station.status !== 'offline' && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1.5 border-t border-slate-600/30">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                              <Thermometer className="w-3 h-3" style={{ color: FAO_BLUE }} />
                              <span className={`text-[10px] ${textMuted}`}>Temp</span>
                            </div>
                            <p className={`text-xs ${headerText}`}>{station.temp}°C</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                              <Droplets className="w-3 h-3" style={{ color: FAO_BLUE }} />
                              <span className={`text-[10px] ${textMuted}`}>Humidity</span>
                            </div>
                            <p className={`text-xs ${headerText}`}>{station.humidity}%</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                              <Wind className="w-3 h-3" style={{ color: FAO_BLUE }} />
                              <span className={`text-[10px] ${textMuted}`}>Wind</span>
                            </div>
                            <p className={`text-xs ${headerText}`}>{station.wind} km/h</p>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                              <Gauge className="w-3 h-3" style={{ color: FAO_BLUE }} />
                              <span className={`text-[10px] ${textMuted}`}>Pressure</span>
                            </div>
                            <p className={`text-xs ${headerText}`}>{station.pressure} hPa</p>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                              <CloudRain className="w-3 h-3" style={{ color: FAO_BLUE }} />
                              <span className={`text-[10px] ${textMuted}`}>Rain</span>
                            </div>
                            <p className={`text-xs ${headerText}`}>{station.rain} mm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About AWS Network */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}>
                <Info className="w-4 h-4" style={{ color: FAO_BLUE }} />About AWS Network
              </h3>
              <p className={`text-xs ${textMuted} mb-2`}>Automatic Weather Stations provide real-time meteorological data across Uganda.</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <Thermometer className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Temperature & Humidity
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <Wind className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Wind Speed & Direction
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <CloudRain className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Precipitation
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <Gauge className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Barometric Pressure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-3">
          {/* Map Section */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg overflow-hidden shadow-sm`}>
            <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" style={{ color: FAO_BLUE }} />
                <h3 className={`text-sm font-semibold ${headerText}`}>Station Network Map</h3>
              </div>
              <span 
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e'
                }}
              >
                {onlineCount} Active
              </span>
            </div>
            <div className="aspect-video">
              <StationMap isDarkMode={isDarkMode} className="w-full h-full" />
            </div>
          </div>

          {/* Network Overview - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Network Overview</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-500">{onlineCount}</p>
                <p className={`text-[10px] ${textMuted}`}>Online</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-500">{offlineCount}</p>
                <p className={`text-[10px] ${textMuted}`}>Offline</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-yellow-500">{maintenanceCount}</p>
                <p className={`text-[10px] ${textMuted}`}>Maint</p>
              </div>
              <div className="rounded-lg p-2 border" style={{ backgroundColor: `${FAO_BLUE}10`, borderColor: `${FAO_BLUE}30` }}>
                <p className="text-lg font-bold" style={{ color: FAO_BLUE }}>{stations.length}</p>
                <p className={`text-[10px] ${textMuted}`}>Total</p>
              </div>
            </div>
          </div>

          {/* Station Status - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Station Status</h3>
            <div className="space-y-2">
              {stations.slice(0, 4).map((station, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getStatusBg(station.status)}`}>
                        {getStatusIcon(station.status)}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${headerText}`}>{station.name}</p>
                        <p className={`text-[10px] ${textMuted}`}>{station.id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${getStatusBg(station.status)} ${getStatusColor(station.status)}`}>
                      {station.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-6 pt-4 border-t ${borderColor}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between text-xs ${textMuted} gap-1`}>
            <p>© 2025 FAO Uganda. All Rights Reserved.</p>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: FAO_BLUE }}></div>
              System Operational
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes signalPulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
