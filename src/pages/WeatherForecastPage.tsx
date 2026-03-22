import { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Navigation
} from 'lucide-react';

interface WeatherForecastPageProps {
  isDarkMode?: boolean;
}

const hourlyForecast = [
  { time: '0:00', temp: 23, rain: 2, icon: 'rain' },
  { time: '1:00', temp: 25, rain: 5, icon: 'sun' },
  { time: '2:00', temp: 26, rain: 9, icon: 'sun' },
  { time: '3:00', temp: 28, rain: 11, icon: 'cloud' },
  { time: '4:00', temp: 28, rain: 14, icon: 'rain' },
  { time: '5:00', temp: 29, rain: 15, icon: 'sun' },
  { time: '6:00', temp: 27, rain: 19, icon: 'cloud' },
  { time: '7:00', temp: 26, rain: 17, icon: 'sun' },
  { time: '8:00', temp: 25, rain: 15, icon: 'rain' },
  { time: '9:00', temp: 23, rain: 13, icon: 'cloud' },
  { time: '10:00', temp: 23, rain: 10, icon: 'sun' },
  { time: '11:00', temp: 20, rain: 10, icon: 'sun' },
  { time: '12:00', temp: 19, rain: 3, icon: 'rain' },
  { time: '13:00', temp: 19, rain: 1, icon: 'sun' },
  { time: '14:00', temp: 19, rain: 0, icon: 'sun' },
  { time: '15:00', temp: 17, rain: 0, icon: 'cloud' },
];

const dailyForecast = [
  { day: 'Sun', date: 'Mar 22', high: 27, low: 18, rain: 7, icon: 'rain', confidence: 93 },
  { day: 'Mon', date: 'Mar 23', high: 28, low: 19, rain: 10, icon: 'sun', confidence: 89 },
  { day: 'Tue', date: 'Mar 24', high: 31, low: 20, rain: 16, icon: 'sun', confidence: 87 },
  { day: 'Wed', date: 'Mar 25', high: 32, low: 22, rain: 21, icon: 'cloud', confidence: 92 },
  { day: 'Thu', date: 'Mar 26', high: 31, low: 22, rain: 23, icon: 'rain', confidence: 95 },
  { day: 'Fri', date: 'Mar 27', high: 29, low: 21, rain: 18, icon: 'rain', confidence: 91 },
  { day: 'Sat', date: 'Mar 28', high: 28, low: 20, rain: 12, icon: 'cloud', confidence: 88 },
  { day: 'Sun', date: 'Mar 29', high: 30, low: 21, rain: 8, icon: 'sun', confidence: 90 },
  { day: 'Mon', date: 'Mar 30', high: 31, low: 22, rain: 5, icon: 'cloud', confidence: 86 },
  { day: 'Tue', date: 'Mar 31', high: 32, low: 23, rain: 2, icon: 'sun', confidence: 89 },
];

const getWeatherIcon = (type: string, className = "w-8 h-8") => {
  switch (type) {
    case 'sun': return <Sun className={`${className} text-yellow-400`} />;
    case 'rain': return <CloudRain className={`${className} text-blue-400`} />;
    case 'cloud': return <Cloud className={`${className} text-slate-400`} />;
    case 'storm': return <CloudLightning className={`${className} text-purple-400`} />;
    default: return <Sun className={`${className} text-yellow-400`} />;
  }
};

export default function WeatherForecastPage({ isDarkMode = true }: WeatherForecastPageProps) {
  const [activeTab, setActiveTab] = useState<'nowcast' | 'forecast'>('nowcast');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [animationKey, setAnimationKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Trigger animation on mount and tab change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeTab]);

  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="p-6">
      {/* Animated Background Elements - Only in Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Cloud animations */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${-20 + i * 25}%`,
                top: `${10 + (i % 3) * 20}%`,
                animation: `drift ${20 + i * 5}s linear infinite`,
              }}
            >
              <Cloud className="w-32 h-32 text-blue-300" />
            </div>
          ))}
          {/* Rain drops */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute w-0.5 h-4 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `rain ${0.8 + Math.random() * 0.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Left Sidebar - Filters */}
      <div className="fixed left-0 top-16 bottom-0 w-64 z-20 overflow-y-auto p-4">
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 mb-4 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Filters</h3>
          
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
              <label className={`text-xs ${textMuted} mb-1 block`}>Parameter</label>
              <select 
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="wind">Wind Speed</option>
                <option value="rainfall">Rainfall</option>
                <option value="pressure">Pressure</option>
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} mb-1 block`}>Date Range</label>
              <input 
                type="date" 
                className={`w-full p-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-4 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Avg Temp</span>
              <span className="text-orange-400 font-medium">24.5°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Max Temp</span>
              <span className="text-red-400 font-medium">31.2°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Min Temp</span>
              <span className="text-blue-400 font-medium">17.8°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textMuted}>Total Rain</span>
              <span className="text-cyan-400 font-medium">125mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.6) 100%)' }}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Weather Forecast</h1>
                <p className="text-slate-200">48-hour nowcasting & 20-day medium range forecasts</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs bg-blue-500/30 px-2 py-1 rounded-lg text-blue-200">
                    <Clock className="w-3 h-3" />
                    Updated 5 min ago
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-green-500/30 px-2 py-1 rounded-lg text-green-200">
                    <Navigation className="w-3 h-3" />
                    87% Accuracy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-sm font-medium text-white transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Temperature', value: '26.5°C', sub: 'Feels like 28°C', icon: Thermometer, color: 'orange' },
            { label: 'Humidity', value: '68%', sub: 'Dew point 19°C', icon: Droplets, color: 'blue' },
            { label: 'Wind', value: '12 km/h', sub: 'NE Direction', icon: Wind, color: 'green' },
            { label: 'Rainfall (24h)', value: '15.2 mm', sub: 'Light rain expected', icon: CloudRain, color: 'purple' },
          ].map((stat, index) => (
            <div 
              key={index}
              className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 card-hover animate-fade-in-up stagger-${index + 1} ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
              </div>
              <p className={`text-sm ${textMuted}`}>{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs ${textMuted} mt-1`}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('nowcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'nowcast' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-blue-500/80`
            }`}
          >
            <Clock className="w-4 h-4" />
            48-Hour Nowcast
          </button>
          <button 
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'forecast' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : `${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} hover:text-white hover:bg-blue-500/80`
            }`}
          >
            <Calendar className="w-4 h-4" />
            20-Day Forecast
          </button>
        </div>

        {/* Content */}
        {activeTab === 'nowcast' ? (
          <div className="space-y-6">
            {/* Hourly Forecast */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Hourly Forecast
                </h3>
                <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {hourlyForecast.map((hour, index) => (
                  <div 
                    key={index} 
                    className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all hover:scale-105 ${
                      index === 0 ? 'bg-blue-500/20 border border-blue-500/30' : isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className={`text-xs ${textMuted} mb-2`}>{hour.time}</p>
                    {getWeatherIcon(hour.icon)}
                    <p className="text-lg font-bold mt-2">{hour.temp}°</p>
                    <p className="text-xs text-blue-400">{hour.rain}mm</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Temperature Trend */}
            <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Temperature Trend
              </h3>
              <div className="h-48 relative">
                {/* Y-axis labels */}
                <div className={`absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs ${textMuted}`}>
                  <span>35°</span>
                  <span>30°</span>
                  <span>25°</span>
                  <span>20°</span>
                  <span>15°</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-10 h-full relative">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`absolute left-0 right-0 h-px ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`}
                      style={{ top: `${i * 25}%` }}
                    />
                  ))}
                  
                  {/* Animated SVG line chart */}
                  <svg 
                    ref={svgRef}
                    key={animationKey}
                    className="w-full h-[85%]" 
                    viewBox="0 0 500 150" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area fill */}
                    <path
                      d={`M0,${150 - ((hourlyForecast[0].temp - 15) / 20) * 150} ${hourlyForecast.map((h, i) => `L${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(' ')} L500,150 L0,150 Z`}
                      fill="url(#tempGradient)"
                      className="animate-fade-in-up"
                    />
                    
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="temperature-trend-line"
                      points={hourlyForecast.map((h, i) => `${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(' ')}
                    />
                    
                    {/* Data points */}
                    {hourlyForecast.map((h, i) => (
                      <circle
                        key={i}
                        cx={(i / (hourlyForecast.length - 1)) * 500}
                        cy={150 - ((h.temp - 15) / 20) * 150}
                        r="4"
                        fill="#f97316"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>00:00</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${cardBg} backdrop-blur-sm border rounded-2xl p-5 animate-fade-in-up ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              20-Day Medium Range Forecast
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {dailyForecast.map((day, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl p-4 text-center transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100'}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className={`text-sm ${textMuted}`}>{day.day}</p>
                  <p className="text-xs text-slate-500 mb-2">{day.date}</p>
                  {getWeatherIcon(day.icon)}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-lg font-bold">{day.high}°</span>
                    <span className={`text-sm ${textMuted}`}>{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-blue-400">
                    <CloudRain className="w-3 h-3" />
                    {day.rain}mm
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={textMuted}>Confidence</span>
                      <span className="text-green-400">{day.confidence}%</span>
                    </div>
                    <div className="h-1 bg-slate-600 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${day.confidence}%`, transitionDelay: `${index * 0.1}s` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translateX(-100%); }
          to { transform: translateX(100vw); }
        }
        @keyframes rain {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
