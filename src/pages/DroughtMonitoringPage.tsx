import { useState } from 'react';
import { 
  MapPin,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Info,
  Thermometer,
  Droplets,
  Leaf,
  BarChart3,
  Filter,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';

interface DroughtMonitoringPageProps {
  isDarkMode?: boolean;
}

const droughtCategories = [
  { label: 'Extreme Drought', color: 'bg-red-700', textColor: 'text-red-400', range: '< 0.4' },
  { label: 'Severe Drought', color: 'bg-red-500', textColor: 'text-red-400', range: '0.4 - 0.6' },
  { label: 'Moderate Drought', color: 'bg-orange-500', textColor: 'text-orange-400', range: '0.6 - 0.8' },
  { label: 'Mild Drought', color: 'bg-yellow-500', textColor: 'text-yellow-400', range: '0.8 - 1.0' },
  { label: 'Normal', color: 'bg-green-500', textColor: 'text-green-400', range: '> 1.0' },
];

const districtData = [
  { name: 'Moroto', value: 0.25, status: 'Extreme', color: '#7f1d1d' },
  { name: 'Kotido', value: 0.42, status: 'Severe', color: '#dc2626' },
  { name: 'Kaabong', value: 0.48, status: 'Severe', color: '#dc2626' },
  { name: 'Napak', value: 0.65, status: 'Moderate', color: '#f97316' },
  { name: 'Abim', value: 0.72, status: 'Moderate', color: '#f97316' },
  { name: 'Amudat', value: 0.85, status: 'Mild', color: '#eab308' },
  { name: 'Karenga', value: 0.92, status: 'Mild', color: '#eab308' },
  { name: 'Nabilatuk', value: 1.05, status: 'Normal', color: '#22c55e' },
];

const cdiTabs = [
  { id: 'overview', label: 'CDI Overview', icon: BarChart3 },
  { id: 'spi', label: 'SPI Analysis', icon: TrendingUp },
  { id: 'trend', label: 'Monthly Trend', icon: Calendar },
];

export default function DroughtMonitoringPage({ isDarkMode = true }: DroughtMonitoringPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedIndicator, setSelectedIndicator] = useState('CDI');
  const [showLegend, setShowLegend] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="p-6">
      {/* Animated Background - Heat shimmer effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl animate-heat"
            style={{
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#f97316', '#ea580c', '#dc2626', '#fbbf24'][i % 4]}20 0%, transparent 70%)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
        {/* Heat waves */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute w-full h-1 opacity-20"
            style={{
              top: `${20 + i * 15}%`,
              background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
              animation: `heatWave ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Left Sidebar - Filters */}
      <div className="fixed left-0 top-16 bottom-0 w-64 z-20 overflow-y-auto p-4">
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mb-4 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-orange-400" />
            <h3 className={`text-sm font-semibold ${textSecondary}`}>Drought Filters</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Indicator</label>
              <select 
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="CDI">CDI - Combined Drought Index</option>
                <option value="SPI">SPI - Standardized Precipitation</option>
                <option value="TDI">TDI - Temperature Drought Index</option>
                <option value="PDI">PDI - Precipitation Drought Index</option>
                <option value="VDI">VDI - Vegetation Drought Index</option>
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Year</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                {Array.from({ length: 10 }, (_, i) => 2020 + i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>District</label>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="All Districts">All Districts</option>
                {districtData.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between w-full mb-2"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <h3 className={`text-sm font-semibold ${textSecondary}`}>CDI Legend</h3>
            </div>
            {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showLegend && (
            <div className="space-y-2 mt-3">
              {droughtCategories.map((cat, index) => (
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
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mt-4 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Districts at Risk</span>
              <span className="text-red-400 font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Extreme Drought</span>
              <span className="text-red-500 font-medium">1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Severe Drought</span>
              <span className="text-orange-500 font-medium">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Population Affected</span>
              <span className="text-orange-400 font-medium">1.2M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(154, 52, 18, 0.9) 0%, rgba(249, 115, 22, 0.6) 100%)' }}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Drought Monitoring</h1>
                <p className="text-slate-200">Combined Drought Index (CDI) with TDI, PDI, VDI Components</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs bg-red-500/30 px-2 py-1 rounded-lg text-red-200">
                    <AlertTriangle className="w-3 h-3" />
                    3 Districts at Risk
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-orange-500/30 px-2 py-1 rounded-lg text-orange-200">
                    <Calendar className="w-3 h-3" />
                    {selectedMonth} {selectedYear}
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
          {cdiTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-orange-500/80`
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
          {/* Left Column - CDI Map (Embedded) */}
          <div className="lg:col-span-2 space-y-6">
            {/* CDI Map - Embedded iframe */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  Combined Drought Index (CDI) Map
                </h3>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                  Live Data
                </span>
              </div>

              {/* Embedded CDI iframe */}
              <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-400">Loading CDI Map...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src="https://cdi.rosewillbome.space"
                  className="w-full h-full border-0"
                  title="CDI Drought Monitoring System"
                  onLoad={() => setIframeLoaded(true)}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>

              {/* District Cards */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {districtData.slice(0, 4).map((district, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl p-3 text-center transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: district.color }}></div>
                      <span className={`text-xs ${textMuted}`}>{district.name}</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: district.color }}>{district.value.toFixed(2)}</p>
                    <p className={`text-[10px] ${textMuted}`}>{district.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* District Status Table */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <h3 className="text-lg font-semibold mb-4">District Drought Status</h3>
              
              <div className="space-y-3">
                {districtData.map((district, index) => (
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

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Drought Summary */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <h3 className="text-lg font-semibold mb-4">Drought Summary</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-red-400">1</p>
                  <p className={`text-xs ${textMuted}`}>Extreme</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-orange-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Severe</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-yellow-400">2</p>
                  <p className={`text-xs ${textMuted}`}>Moderate</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-400">3</p>
                  <p className={`text-xs ${textMuted}`}>Normal</p>
                </div>
              </div>

              <div className="border-t border-slate-700/30 pt-4">
                <p className={`text-sm ${textMuted} mb-1`}>Affected Population</p>
                <p className="text-3xl font-bold">1.2M</p>
                <p className={`text-xs ${textMuted}`}>Across 5 districts</p>
              </div>
            </div>

            {/* About CDI */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                About CDI
              </h3>
              
              <p className={`text-sm ${textMuted} mb-4`}>
                Combined Drought Index (CDI) integrates three key drought indicators:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">TDI</p>
                    <p className={`text-xs ${textMuted}`}>Temperature Drought Index</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PDI</p>
                    <p className={`text-xs ${textMuted}`}>Precipitation Drought Index</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">VDI</p>
                    <p className={`text-xs ${textMuted}`}>Vegetation Drought Index</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heatWave {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
