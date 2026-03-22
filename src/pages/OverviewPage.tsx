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
  Bell
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

export default function OverviewPage({ onNavigate, isDarkMode = true }: OverviewPageProps) {
  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white/80';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDarkMode ? 'border-slate-700/30' : 'border-slate-200';

  return (
    <div className="p-6">
      {/* Animated Background */}
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

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className={textMuted}>Welcome to FAO Uganda Early Warning System</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={index} 
                    className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 card-hover animate-fade-in-up stagger-${index + 1}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className={`text-sm ${textMuted} mb-1`}>{card.label}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-${card.color}-500/20 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${card.color}-400`} />
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

            {/* Monitoring Modules */}
            <div className="animate-fade-in-up stagger-2">
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
                      className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all card-hover animate-fade-in-up ${borderColor} border hover:border-slate-500/50 ${isDarkMode ? 'bg-slate-800/30' : 'bg-white/50'}`}
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
                          <div className="flex items-center justify-between">
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

            {/* District Drought Status */}
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up stagger-3`}>
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
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up stagger-2`}>
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
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up stagger-3`}>
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
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up stagger-4`}>
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
            <div className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-2xl p-5 animate-fade-in-up stagger-5`}>
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
        <footer className={`mt-8 pt-6 border-t ${borderColor}`}>
          <div className={`flex items-center justify-between text-sm ${textMuted}`}>
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
