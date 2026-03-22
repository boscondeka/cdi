import { useState } from 'react';
import { 
  Waves,
  MapPin,
  Download,
  TrendingUp,
  AlertTriangle,
  Info,
  Droplets,
  ChevronUp,
  ChevronDown,
  Minus,
  Users,
  Filter,
  Layers
} from 'lucide-react';

interface FloodMonitoringPageProps {
  isDarkMode?: boolean;
}

const floodCategories = [
  { label: 'Extreme Flood', color: 'bg-red-700', textColor: 'text-red-400', range: '> 4m' },
  { label: 'Severe Flood', color: 'bg-red-500', textColor: 'text-red-400', range: '3-4m' },
  { label: 'Moderate Flood', color: 'bg-orange-500', textColor: 'text-orange-400', range: '2-3m' },
  { label: 'Minor Flood', color: 'bg-yellow-500', textColor: 'text-yellow-400', range: '1-2m' },
  { label: 'Normal', color: 'bg-green-500', textColor: 'text-green-400', range: '< 1m' },
];

const riverBasins = [
  { name: 'Nile Basin', level: 4.2, trend: 'up', population: 620000, rainfall: 85, discharge: 3200, status: 'severe' },
  { name: 'Victoria Nile', level: 3.8, trend: 'up', population: 620000, rainfall: 78, discharge: 2800, status: 'severe' },
  { name: 'Albert Nile', level: 2.9, trend: 'stable', population: 540000, rainfall: 65, discharge: 1900, status: 'moderate' },
  { name: 'Kafu River', level: 2.4, trend: 'up', population: 180000, rainfall: 72, discharge: 1200, status: 'moderate' },
  { name: 'Mpologoma', level: 1.8, trend: 'down', population: 95000, rainfall: 45, discharge: 800, status: 'minor' },
  { name: 'Manafwa', level: 1.5, trend: 'stable', population: 78000, rainfall: 38, discharge: 650, status: 'minor' },
  { name: 'Malaba', level: 0.9, trend: 'stable', population: 65000, rainfall: 28, discharge: 420, status: 'normal' },
  { name: 'Okot', level: 0.7, trend: 'down', population: 32000, rainfall: 22, discharge: 310, status: 'normal' },
];

const activeAlerts = [
  { basin: 'Nile Basin', message: 'Water level exceeding critical threshold', time: '2 hours ago', affected: 125000, severity: 'severe' },
  { basin: 'Victoria Nile', message: 'Rapid water level increase detected', time: '4 hours ago', affected: 98000, severity: 'severe' },
  { basin: 'Kafu River', message: 'Flood warning issued for downstream areas', time: '6 hours ago', affected: 45000, severity: 'moderate' },
];

const floodTabs = [
  { id: 'water', label: 'Water Levels', icon: Waves },
  { id: 'rainfall', label: 'Rainfall', icon: Droplets },
  { id: 'trend', label: 'Trend', icon: TrendingUp },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'severe': return 'text-red-400';
    case 'moderate': return 'text-orange-400';
    case 'minor': return 'text-yellow-400';
    default: return 'text-green-400';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'severe': return 'bg-red-500/20';
    case 'moderate': return 'bg-orange-500/20';
    case 'minor': return 'bg-yellow-500/20';
    default: return 'bg-green-500/20';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <ChevronUp className="w-4 h-4 text-red-400" />;
    case 'down': return <ChevronDown className="w-4 h-4 text-green-400" />;
    default: return <Minus className="w-4 h-4 text-yellow-400" />;
  }
};

export default function FloodMonitoringPage({ isDarkMode = true }: FloodMonitoringPageProps) {
  const [activeTab, setActiveTab] = useState('water');
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [selectedBasin, setSelectedBasin] = useState('All Basins');
  const [showLegend, setShowLegend] = useState(true);

  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';

  return (
    <div className="p-6">
      {/* Animated Background - Water waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-20 opacity-10"
            style={{
              top: `${10 + i * 15}%`,
              background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
              animation: `wave ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        {/* Water droplets */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`drop-${i}`}
            className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Left Sidebar - Filters */}
      <div className="fixed left-0 top-16 bottom-0 w-64 z-20 overflow-y-auto p-4">
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mb-4 ${borderColor}`}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className={`text-sm font-semibold ${textSecondary}`}>Flood Filters</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Time Range</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>River Basin</label>
              <select 
                value={selectedBasin}
                onChange={(e) => setSelectedBasin(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="All Basins">All Basins</option>
                {riverBasins.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Alert Level</label>
              <div className="space-y-1">
                {['All Levels', 'Critical Only', 'Warning Only', 'Normal'].map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded bg-slate-700 border-slate-600" defaultChecked={level === 'All Levels'} />
                    <span className={textSecondary}>{level}</span>
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
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className={`text-sm font-semibold ${textSecondary}`}>Flood Legend</h3>
            </div>
            {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showLegend && (
            <div className="space-y-2 mt-3">
              {floodCategories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{cat.label}</p>
                    <p className={`text-[10px] ${textMuted}`}>{cat.range}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mt-4 ${borderColor}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Critical Basins</span>
              <span className="text-red-400 font-medium">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>At Risk Population</span>
              <span className="text-orange-400 font-medium">1.6M</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Avg Rainfall</span>
              <span className="text-cyan-400 font-medium">54mm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Active Alerts</span>
              <span className="text-red-400 font-medium">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(22, 78, 99, 0.9) 0%, rgba(6, 182, 212, 0.6) 100%)' }}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Flood Monitoring</h1>
                <p className="text-slate-200">Real-time river levels, rainfall data, and flood risk assessment</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs bg-red-500/30 px-2 py-1 rounded-lg text-red-200">
                    <AlertTriangle className="w-3 h-3" />
                    2 Severe Alerts
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-blue-500/30 px-2 py-1 rounded-lg text-blue-200">
                    <Droplets className="w-3 h-3" />
                    Heavy Rainfall
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-sm font-medium text-white transition-colors">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {floodTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-cyan-500/80`
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
          {/* Left Column - Map & River Basins */}
          <div className="lg:col-span-2 space-y-6">
            {/* River Basin Water Levels */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  River Basin Water Levels
                </h3>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                  2 Critical Basins
                </span>
              </div>

              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden mb-4">
                <div className="text-center">
                  <Waves className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">Interactive Flood Map</p>
                  <p className="text-sm text-slate-500 mb-4">River basins with water level monitoring</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-white transition-colors mx-auto">
                    <MapPin className="w-4 h-4" />
                    Launch Full Map
                  </button>
                </div>
              </div>

              {/* River Basin Cards */}
              <div className="grid grid-cols-4 gap-3">
                {riverBasins.slice(0, 4).map((basin, index) => (
                  <div key={index} className={`rounded-xl p-3 text-center transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(basin.status).replace('text', 'bg')}`}></div>
                        <span className={`text-xs ${textMuted}`}>{basin.name}</span>
                      </div>
                      {getTrendIcon(basin.trend)}
                    </div>
                    <p className={`text-lg font-bold ${getStatusColor(basin.status)}`}>{basin.level}m</p>
                  </div>
                ))}
              </div>
            </div>

            {/* River Basin Status Table */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4">River Basin Status</h3>
              
              <div className="space-y-3">
                {riverBasins.map((basin, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(basin.status).replace('text', 'bg')}`}></div>
                      <div>
                        <p className="text-sm font-medium">{basin.name}</p>
                        <p className={`text-xs ${textMuted}`}>Pop: {basin.population.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className={`text-xs ${textMuted}`}>Rainfall</p>
                        <p className="text-sm">{basin.rainfall}mm</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${textMuted}`}>Discharge</p>
                        <p className="text-sm">{basin.discharge}m³/s</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${textMuted}`}>Trend</p>
                        <div className="flex justify-center">{getTrendIcon(basin.trend)}</div>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${textMuted}`}>Level</p>
                        <p className={`text-sm font-bold ${getStatusColor(basin.status)}`}>{basin.level}m</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Flood Summary */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4">Flood Summary</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-red-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Severe</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-orange-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Moderate</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-yellow-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Minor</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Normal</p>
                </div>
              </div>

              <div className="border-t border-slate-700/30 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className={`w-4 h-4 ${textMuted}`} />
                  <span className={`text-sm ${textMuted}`}>Population at Risk</span>
                </div>
                <p className="text-3xl font-bold">1.6M</p>
                <p className={`text-xs ${textMuted}`}>Across 4 river basins</p>
              </div>
            </div>

            {/* Active Alerts */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Active Alerts
              </h3>
              
              <div className="space-y-3">
                {activeAlerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{alert.basin}</span>
                      <span className={`text-xs px-2 py-1 rounded-lg ${getStatusBg(alert.severity)} ${getStatusColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`text-xs ${textMuted} mb-2`}>{alert.message}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={textMuted}>{alert.time}</span>
                      <span className="text-red-400">{alert.affected.toLocaleString()} affected</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Flood Monitoring */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${borderColor}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                About Flood Monitoring
              </h3>
              
              <p className={`text-sm ${textMuted} mb-4`}>
                Real-time monitoring of Uganda's major river basins with automated alerts when water levels exceed safe thresholds.
              </p>

              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Water level sensors
                </div>
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Rainfall monitoring
                </div>
                <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                  <Waves className="w-4 h-4 text-cyan-400" />
                  Flow discharge tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
