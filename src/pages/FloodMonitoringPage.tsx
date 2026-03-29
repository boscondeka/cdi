import { useState, useRef, useEffect } from 'react';
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
  X,
  Clock
} from 'lucide-react';

interface FloodMonitoringPageProps {
  isDarkMode?: boolean;
}

const FAO_BLUE = '#318DDE';

const floodCategories = [
  { label: 'Extreme Flood', color: 'bg-red-700', textColor: 'text-red-500', range: '> 4m' },
  { label: 'Severe Flood', color: 'bg-red-500', textColor: 'text-red-500', range: '3-4m' },
  { label: 'Moderate Flood', color: 'bg-orange-500', textColor: 'text-orange-500', range: '2-3m' },
  { label: 'Minor Flood', color: 'bg-yellow-500', textColor: 'text-yellow-500', range: '1-2m' },
  { label: 'Normal', color: 'bg-green-500', textColor: 'text-green-500', range: '< 1m' },
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



// Time series data for Nile Basin
const timeSeriesData = [
  { time: '00:00', level: 3.8 },
  { time: '03:00', level: 3.9 },
  { time: '06:00', level: 4.0 },
  { time: '09:00', level: 4.1 },
  { time: '12:00', level: 4.2 },
  { time: '15:00', level: 4.15 },
  { time: '18:00', level: 4.2 },
  { time: '21:00', level: 4.25 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'severe': return 'text-red-500';
    case 'moderate': return 'text-orange-500';
    case 'minor': return 'text-yellow-500';
    default: return 'text-green-500';
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
    case 'up': return <ChevronUp className="w-4 h-4 text-red-500" />;
    case 'down': return <ChevronDown className="w-4 h-4 text-green-500" />;
    default: return <Minus className="w-4 h-4 text-yellow-500" />;
  }
};

// Map Component with Legend
const FloodMap = ({ isDarkMode, className = "" }: { isDarkMode: boolean; className?: string }) => {
  const [showLegend, setShowLegend] = useState(true);
  
  return (
    <div className={`relative overflow-hidden rounded-lg md:rounded-xl ${className}`}>
      <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="text-center p-4">
          <Waves className="w-12 h-12 md:w-14 md:h-14 text-slate-400 mx-auto mb-2" />
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Interactive Flood Map</p>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>River basins with monitoring</p>
          <button 
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors mx-auto"
            style={{ backgroundColor: FAO_BLUE }}
          >
            <MapPin className="w-3 h-3" />Launch Full Map
          </button>
        </div>
      </div>
      
      {/* Map Legend */}
      {showLegend && (
        <div className={`absolute bottom-2 left-2 rounded-lg p-2 shadow-sm ${isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Flood Levels</span>
            <button 
              onClick={() => setShowLegend(false)}
              className={`text-[10px] ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {floodCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="absolute top-2 left-2">
        <span 
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium shadow-sm`}
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444'
          }}
        >
          2 Critical
        </span>
      </div>
    </div>
  );
};

export default function FloodMonitoringPage({ isDarkMode = true }: FloodMonitoringPageProps) {
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [selectedBasin, setSelectedBasin] = useState('Nile Basin');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedBasin]);

  const cardBg = isDarkMode ? 'bg-slate-800/85' : 'bg-white/95';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';

  const FilterContent = () => (
    <div className="space-y-3">
      <div>
        <label className={`text-xs ${textMuted} mb-1 block`}>Time Range</label>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
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
          className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
        >
          {riverBasins.map(b => (<option key={b.name} value={b.name}>{b.name}</option>))}
        </select>
      </div>
      <div>
        <label className={`text-xs ${textMuted} mb-1 block`}>Alert Level</label>
        <div className="space-y-1.5">
          {['All Levels', 'Critical Only', 'Warning Only', 'Normal'].map((level) => (
            <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className={`rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} defaultChecked={level === 'All Levels'} />
              <span className={textSecondary}>{level}</span>
            </label>
          ))}
        </div>
      </div>
      <div className={`pt-3 border-t ${borderColor}`}>
        <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Quick Stats</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs"><span className={textMuted}>Critical Basins</span><span className="text-red-500 font-medium">2</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>At Risk Population</span><span className="text-orange-500 font-medium">1.6M</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Avg Rainfall</span><span className="font-medium" style={{ color: FAO_BLUE }}>54mm</span></div>
          <div className="flex justify-between text-xs"><span className={textMuted}>Active Alerts</span><span className="text-red-500 font-medium">3</span></div>
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
          <p className={textMuted}>Loading Flood Monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Animated Background */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-full h-20 opacity-10" style={{ top: `${10 + i * 15}%`, background: `linear-gradient(90deg, transparent, ${FAO_BLUE}, transparent)`, animation: `wave ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
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
                <h1 className="text-lg md:text-xl font-bold text-white">Flood Monitoring</h1>
                <p className="text-slate-200 text-xs md:text-sm">Real-time rainfall data and flood risk assessment</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span 
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <AlertTriangle className="w-3 h-3" />2 Severe Alerts
                  </span>
                  <span 
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <Droplets className="w-3 h-3" />Heavy Rainfall
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors">
                  <Download className="w-3 h-3" /><span className="hidden sm:inline">Export</span>
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
              <div className="mt-3 flex-1 flex relative min-h-[140px]">
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    backgroundImage: 'url(/flood-illustration.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-3">
            {/* Map and Charts Row */}
            <div className="grid grid-cols-12 gap-3" style={{ minHeight: '550px' }}>
              {/* Map - 7 columns */}
              <div className="col-span-7 flex">
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col`}>
                  <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" style={{ color: FAO_BLUE }} />
                      <h3 className={`text-sm font-semibold ${headerText}`}>River Basin Map</h3>
                    </div>
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[10px] font-medium">2 Critical</span>
                  </div>
                  <div className="relative flex-1 flex flex-col" style={{ minHeight: '400px' }}>
                    <div className="flex-1 relative">
                      <FloodMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
                    </div>
                    {/* Time Slider */}
                    <div className={`px-4 py-3 border-t ${borderColor} flex items-center gap-4 ${isDarkMode ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                      <span className={`text-xs font-medium ${textMuted}`}>2001</span>
                      <input 
                        type="range" 
                        min="2001" 
                        max={new Date().getFullYear()} 
                        defaultValue={new Date().getFullYear()}
                        className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{ backgroundColor: isDarkMode ? '#334155' : '#cbd5e1', accentColor: FAO_BLUE }}
                      />
                      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${FAO_BLUE}20`, color: FAO_BLUE }}>
                        {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - 5 columns */}
              <div className="col-span-5 flex flex-col gap-3">
                {/* Flood Summary */}
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
                  <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Flood Summary</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-red-500">2</p>
                      <p className={`text-[10px] ${textMuted}`}>Severe</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-orange-500">2</p>
                      <p className={`text-[10px] ${textMuted}`}>Moderate</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-yellow-500">2</p>
                      <p className={`text-[10px] ${textMuted}`}>Minor</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-green-500">2</p>
                      <p className={`text-[10px] ${textMuted}`}>Normal</p>
                    </div>
                  </div>
                  <div className={`mt-2 pt-2 border-t ${borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${textMuted}`} />
                        <span className={`text-xs ${textMuted}`}>Population at Risk</span>
                      </div>
                      <span className={`text-sm font-bold ${headerText}`}>1.6M</span>
                    </div>
                  </div>
                </div>

                {/* Time Series Chart */}
                <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-semibold flex items-center gap-1.5 ${headerText}`}>
                      <Clock className="w-4 h-4" style={{ color: FAO_BLUE }} />
                      {selectedBasin} - 24h Trend
                    </h3>
                  </div>
                  <div className="h-32 relative">
                    <div className={`absolute left-0 top-0 bottom-5 w-6 flex flex-col justify-between text-[10px] ${textMuted}`}>
                      <span>5m</span><span>4m</span><span>3m</span><span>2m</span><span>1m</span>
                    </div>
                    <div className="ml-6 h-full relative">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={`absolute left-0 right-0 h-px ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`} style={{ top: `${i * 25}%` }} />
                      ))}
                      <svg ref={svgRef} key={animationKey} className="w-full h-[85%]" viewBox="0 0 400 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="floodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={FAO_BLUE} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={FAO_BLUE} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d={`M0,${120 - ((timeSeriesData[0].level - 1) / 4) * 120} ${timeSeriesData.map((d, i) => `L${(i / (timeSeriesData.length - 1)) * 400},${120 - ((d.level - 1) / 4) * 120}`).join(' ')} L400,120 L0,120 Z`} 
                          fill="url(#floodGradient)" 
                        />
                        <polyline 
                          fill="none" 
                          stroke={FAO_BLUE} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          points={timeSeriesData.map((d, i) => `${(i / (timeSeriesData.length - 1)) * 400},${120 - ((d.level - 1) / 4) * 120}`).join(' ')} 
                        />
                        {timeSeriesData.map((d, i) => (
                          <circle key={i} cx={(i / (timeSeriesData.length - 1)) * 400} cy={120 - ((d.level - 1) / 4) * 120} r="3" fill={FAO_BLUE} />
                        ))}
                      </svg>
                      <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
                        {timeSeriesData.map((d, i) => (
                          <span key={i}>{d.time}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] ${textMuted}`}>Current: <span className="font-medium" style={{ color: FAO_BLUE }}>4.25m</span></span>
                    <span className={`text-[10px] ${textMuted}`}>Trend: <span className="text-red-500 font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />Rising</span></span>
                  </div>
                </div>

                {/* River Basin Status - Right Column Desktop */}
                <div className={`hidden lg:flex flex-col ${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm flex-1`}>
                  <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>River Basin Status</h3>
                  <div className="overflow-y-auto pr-1" style={{ maxHeight: '170px' }}>
                    <div className="space-y-1.5">
                      {riverBasins.map((basin, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(basin.status).replace('text', 'bg')}`}></div>
                            <div>
                              <p className={`text-xs font-medium truncate max-w-[90px] ${headerText}`} title={basin.name}>{basin.name}</p>
                              <p className={`text-[10px] ${textMuted}`}>Pop: {(basin.population / 1000).toFixed(0)}k</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-right">
                            <div className="hidden xl:block">
                              <p className={`text-[10px] ${textMuted}`}>Trend</p>
                              <div className="flex justify-end">{getTrendIcon(basin.trend)}</div>
                            </div>
                            <div>
                              <p className={`text-[10px] ${textMuted}`}>Level</p>
                              <p className={`text-xs font-bold ${getStatusColor(basin.status)}`}>{basin.level}m</p>
                            </div>
                            <div className="w-14">
                              <span className={`inline-block text-center text-[9px] px-1 py-0.5 rounded w-full ${getStatusBg(basin.status)} ${getStatusColor(basin.status)}`}>
                                {basin.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Container - After Graph */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}>
                <Info className="w-4 h-4" style={{ color: FAO_BLUE }} />About Flood Monitoring
              </h3>
              <p className={`text-xs ${textMuted} mb-2`}>Real-time monitoring of Uganda's major river basins with automated alerts when water levels exceed safe thresholds. Data is collected from multiple sensors and updated every 15 minutes.</p>
              <div className="grid grid-cols-3 gap-2">
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <Droplets className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Rainfall monitoring
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Trend analysis
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${textSecondary}`}>
                  <Waves className="w-3.5 h-3.5" style={{ color: FAO_BLUE }} />Flow discharge tracking
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-3">
          {/* Flood Summary (above map) */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>Flood Summary</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-500">2</p>
                <p className={`text-[10px] ${textMuted}`}>Severe</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-orange-500">2</p>
                <p className={`text-[10px] ${textMuted}`}>Moderate</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-yellow-500">2</p>
                <p className={`text-[10px] ${textMuted}`}>Minor</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-500">2</p>
                <p className={`text-[10px] ${textMuted}`}>Normal</p>
              </div>
            </div>
          </div>

          {/* Map Section with Filter Popup */}
          <div className="relative">
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg overflow-hidden shadow-sm`}>
              <div className={`flex items-center justify-between p-2 border-b ${borderColor}`}>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" style={{ color: FAO_BLUE }} />
                  <h3 className={`text-sm font-semibold ${headerText}`}>River Basin Map</h3>
                </div>
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[10px] font-medium">2 Critical</span>
              </div>
              <div className="relative aspect-video flex flex-col">
                <div className="flex-1 relative">
                  <FloodMap isDarkMode={isDarkMode} className="absolute inset-0 w-full h-full" />
                </div>
                {/* Filter button on map */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center shadow-md z-10 text-white"
                  style={{ backgroundColor: FAO_BLUE }}
                >
                  <Filter className="w-4 h-4" />
                </button>
                
                {/* Time Slider */}
                <div className={`px-2 py-2 border-t ${borderColor} flex items-center gap-2 ${isDarkMode ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                  <span className={`text-[10px] font-medium ${textMuted}`}>2001</span>
                  <input 
                    type="range" 
                    min="2001" 
                    max={new Date().getFullYear()} 
                    defaultValue={new Date().getFullYear()}
                    className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: isDarkMode ? '#334155' : '#cbd5e1', accentColor: FAO_BLUE }}
                  />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${FAO_BLUE}20`, color: FAO_BLUE }}>
                    {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            {/* Filter Popup */}
            {showMobileFilters && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMobileFilters(false)} />
                <div 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-64 rounded-xl shadow-lg border p-3 max-h-[70vh] overflow-y-auto ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-xs font-semibold ${headerText}`}>Flood Filters</h4>
                    <button onClick={() => setShowMobileFilters(false)} className={`p-1 rounded-md ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <FilterContent />
                </div>
              </>
            )}
          </div>

          {/* Time Series Chart */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-semibold flex items-center gap-1.5 ${headerText}`}>
                <Clock className="w-4 h-4" style={{ color: FAO_BLUE }} />
                {selectedBasin} - 24h Trend
              </h3>
            </div>
            <div className="h-32 relative">
              <div className={`absolute left-0 top-0 bottom-5 w-6 flex flex-col justify-between text-[10px] ${textMuted}`}>
                <span>5m</span><span>4m</span><span>3m</span><span>2m</span><span>1m</span>
              </div>
              <div className="ml-6 h-full relative">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`absolute left-0 right-0 h-px ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`} style={{ top: `${i * 25}%` }} />
                ))}
                <svg ref={svgRef} key={animationKey} className="w-full h-[85%]" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="floodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={FAO_BLUE} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={FAO_BLUE} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M0,${120 - ((timeSeriesData[0].level - 1) / 4) * 120} ${timeSeriesData.map((d, i) => `L${(i / (timeSeriesData.length - 1)) * 400},${120 - ((d.level - 1) / 4) * 120}`).join(' ')} L400,120 L0,120 Z`} 
                    fill="url(#floodGradient)" 
                  />
                  <polyline 
                    fill="none" 
                    stroke={FAO_BLUE} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    points={timeSeriesData.map((d, i) => `${(i / (timeSeriesData.length - 1)) * 400},${120 - ((d.level - 1) / 4) * 120}`).join(' ')} 
                  />
                  {timeSeriesData.map((d, i) => (
                    <circle key={i} cx={(i / (timeSeriesData.length - 1)) * 400} cy={120 - ((d.level - 1) / 4) * 120} r="3" fill={FAO_BLUE} />
                  ))}
                </svg>
                <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
                  {timeSeriesData.map((d, i) => (
                    <span key={i}>{d.time}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* River Basin Status - Mobile */}
          <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-2 ${headerText}`}>River Basin Status</h3>
            <div className="space-y-1.5">
              {riverBasins.slice(0, 4).map((basin, idx) => (
                <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(basin.status).replace('text', 'bg')}`}></div>
                    <div>
                      <p className={`text-xs font-medium ${headerText}`}>{basin.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>Level: {basin.level}m</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getStatusBg(basin.status)} ${getStatusColor(basin.status)}`}>
                    {basin.status}
                  </span>
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
        @keyframes wave { 0%, 100% { transform: translateX(-100%); opacity: 0; } 50% { transform: translateX(100%); opacity: 0.2; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
