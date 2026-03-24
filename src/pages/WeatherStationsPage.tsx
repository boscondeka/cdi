import { useState, useEffect, useRef } from 'react';
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
  X,
  Bell
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

const stationAlerts = [
  { id: 1, station: 'Lira Station', message: 'Station offline for 3 days', type: 'error', time: '3 days ago' },
  { id: 2, station: 'Fort Portal', message: 'Maintenance required', type: 'warning', time: '2 hours ago' },
  { id: 3, station: 'Entebbe Airport', message: 'Signal strength low', type: 'info', time: '15 min ago' },
];

export default function WeatherStationsPage({ isDarkMode = true }: WeatherStationsPageProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAlertDropdown, setShowAlertDropdown] = useState(true);
  const alertDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-hide alert dropdown after 5 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlertDropdown(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertDropdownRef.current && !alertDropdownRef.current.contains(event.target as Node)) {
        setShowAlertDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-green-500" />
          <h3 className={`text-xs font-semibold ${textSecondary}`}>Status Legend</h3>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div><p className="text-xs font-medium">Online</p><p className={`text-[10px] ${textMuted}`}>Transmitting normally</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div><p className="text-xs font-medium">Maintenance</p><p className={`text-[10px] ${textMuted}`}>Under maintenance</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div><p className="text-xs font-medium">Offline</p><p className={`text-[10px] ${textMuted}`}>Not transmitting</p></div>
          </div>
        </div>
      </div>
      <div className={`pt-3 border-t ${borderColor}`}>
        <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Network Stats</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs"><span className={textMuted}>Total Stations</span><span className={`font-medium ${headerText}`}>{stations.length}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Online</span><span className="text-green-500 font-medium">{onlineCount}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Offline</span><span className="text-red-500 font-medium">{offlineCount}</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Data Quality</span><span className="text-blue-500 font-medium">94%</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Animated Background */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-green-500/20" style={{ width: `${100 + i * 100}px`, height: `${100 + i * 100}px`, left: '10%', top: '30%', animation: `signalPulse ${3 + i * 0.5}s ease-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      )}

      {/* Mobile Filter Button */}
      <button onClick={() => setShowMobileFilters(true)} className={`lg:hidden fixed bottom-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}>
        <Filter className="w-4 h-4" />
      </button>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-72 p-4 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-semibold ${headerText}`}>Station Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}><X className="w-4 h-4" /></button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Header Banner */}
        <div className="relative overflow-hidden rounded-lg md:rounded-xl p-3 md:p-4 mb-3 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.9) 0%, rgba(34, 197, 94, 0.6) 100%)' }}>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">Weather Stations</h1>
                <p className="text-slate-200 text-xs md:text-sm">AWS network monitoring</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="flex items-center gap-1 text-[10px] bg-green-500/30 px-1.5 py-0.5 rounded-md text-green-200"><Wifi className="w-3 h-3" />{onlineCount} Online</span>
                  <span className="flex items-center gap-1 text-[10px] bg-red-500/30 px-1.5 py-0.5 rounded-md text-red-200"><WifiOff className="w-3 h-3" />{offlineCount} Offline</span>
                  <span className="flex items-center gap-1 text-[10px] bg-blue-500/30 px-1.5 py-0.5 rounded-md text-blue-200"><BarChart3 className="w-3 h-3" />98.5% Uptime</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Notification Bell */}
                <div className="relative" ref={alertDropdownRef}>
                  <button 
                    onClick={() => setShowAlertDropdown(!showAlertDropdown)}
                    className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white' : 'bg-white/80 hover:bg-white text-slate-700'}`}
                  >
                    <Bell className="w-3 h-3" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">{stationAlerts.length}</span>
                  </button>
                  
                  {/* Alert Dropdown */}
                  {showAlertDropdown && (
                    <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-up ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                      <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <h4 className={`text-sm font-semibold flex items-center gap-1.5 ${headerText}`}>
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Station Alerts
                        </h4>
                        <button 
                          onClick={() => setShowAlertDropdown(false)}
                          className={`p-1 rounded hover:${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {stationAlerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-3 border-b last:border-b-0 ${isDarkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                alert.type === 'error' ? 'bg-red-500' : 
                                alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium ${headerText}`}>{alert.station}</p>
                                <p className={`text-[11px] ${textMuted} truncate`}>{alert.message}</p>
                                <p className={`text-[10px] ${textMuted} mt-0.5`}>{alert.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={`p-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <button className={`w-full text-center text-xs py-1 rounded transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-slate-700' : 'text-blue-600 hover:bg-slate-100'}`}>
                          View All Alerts
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors"><Download className="w-3 h-3" /><span className="hidden sm:inline">Export</span></button>
                <button className="flex items-center gap-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-xs font-medium text-white transition-colors"><RefreshCw className="w-3 h-3" /><span className="hidden sm:inline">Refresh</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Filter extending to footer */}
          <div className="lg:col-span-3 flex flex-col">
            <div 
              className="flex-1 rounded-xl p-3 shadow-sm flex flex-col"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(180deg, rgba(22, 101, 52, 0.3) 0%, rgba(34, 197, 94, 0.15) 100%)' 
                  : 'linear-gradient(180deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'}`,
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
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-green-500 text-white shadow-sm' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-green-500/80`}`}>
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
                      <MapPin className="w-4 h-4 text-green-500" />
                      <h3 className={`text-sm font-semibold ${headerText}`}>Station Network Map</h3>
                    </div>
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded text-[10px] font-medium">{onlineCount} Active</span>
                  </div>
                  <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center p-4">
                      <Radio className="w-12 h-12 md:w-14 md:h-14 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm mb-1">Interactive Station Map</p>
                      <p className="text-xs text-slate-500 mb-2">AWS locations across Uganda</p>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-white transition-colors mx-auto">
                        <MapPin className="w-3 h-3" />View Full Map
                      </button>
                    </div>
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
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                      <p className="text-xl font-bold text-blue-500">{stations.length}</p>
                      <p className={`text-[10px] ${textMuted}`}>Total</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs ${textMuted}`}>Data Quality</span>
                        <span className="text-xs font-medium text-green-500">94%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full w-[94%] bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs ${textMuted}`}>Network Uptime</span>
                        <span className="text-xs font-medium text-blue-500">98.5%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full w-[98.5%] bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Station Status List */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Station Status</h3>
              <div className="space-y-2">
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
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${station.signal}%` }}></div>
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
                            <Thermometer className="w-3 h-3 text-orange-500" />
                            <span className={`text-[10px] ${textMuted}`}>Temp</span>
                          </div>
                          <p className={`text-xs ${headerText}`}>{station.temp}°C</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-0.5 mb-0.5">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span className={`text-[10px] ${textMuted}`}>Humidity</span>
                          </div>
                          <p className={`text-xs ${headerText}`}>{station.humidity}%</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-0.5 mb-0.5">
                            <Wind className="w-3 h-3 text-green-500" />
                            <span className={`text-[10px] ${textMuted}`}>Wind</span>
                          </div>
                          <p className={`text-xs ${headerText}`}>{station.wind} km/h</p>
                        </div>
                        <div className="text-center hidden sm:block">
                          <div className="flex items-center justify-center gap-0.5 mb-0.5">
                            <Gauge className="w-3 h-3 text-purple-500" />
                            <span className={`text-[10px] ${textMuted}`}>Pressure</span>
                          </div>
                          <p className={`text-xs ${headerText}`}>{station.pressure} hPa</p>
                        </div>
                        <div className="text-center hidden sm:block">
                          <div className="flex items-center justify-center gap-0.5 mb-0.5">
                            <CloudRain className="w-3 h-3 text-cyan-500" />
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

            {/* About AWS Network */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}><Info className="w-4 h-4 text-blue-500" />About AWS Network</h3>
              <p className={`text-xs ${textMuted} mb-2`}>Automatic Weather Stations provide real-time meteorological data across Uganda.</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}><Thermometer className="w-3.5 h-3.5 text-orange-500" />Temperature & Humidity</div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}><Wind className="w-3.5 h-3.5 text-green-500" />Wind Speed & Direction</div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}><CloudRain className="w-3.5 h-3.5 text-blue-500" />Precipitation</div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}><Gauge className="w-3.5 h-3.5 text-purple-500" />Barometric Pressure</div>
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

      <style>{`
        @keyframes signalPulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
