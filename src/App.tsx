import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  Home, 
  Cloud, 
  Sun, 
  Waves, 
  Radio,
  Bell,
  Settings,
  User,
  Menu,
  X,
  RefreshCw,
  Moon,
  Sun as SunIcon
} from 'lucide-react';
import OverviewPage from './pages/OverviewPage';
import WeatherForecastPage from './pages/WeatherForecastPage';
import DroughtMonitoringPage from './pages/DroughtMonitoringPage';
import FloodMonitoringPage from './pages/FloodMonitoringPage';
import WeatherStationsPage from './pages/WeatherStationsPage';

export type PageType = 'overview' | 'weather' | 'drought' | 'flood' | 'stations';

const navItems: { id: PageType; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'weather', label: 'Weather Forecast', icon: Cloud },
  { id: 'drought', label: 'Drought Monitor', icon: Sun },
  { id: 'flood', label: 'Flood Monitor', icon: Waves },
  { id: 'stations', label: 'Weather Stations', icon: Radio },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detect system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (page: PageType) => {
    if (page === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage onNavigate={handlePageChange} isDarkMode={isDarkMode} />;
      case 'weather':
        return <WeatherForecastPage isDarkMode={isDarkMode} />;
      case 'drought':
        return <DroughtMonitoringPage isDarkMode={isDarkMode} />;
      case 'flood':
        return <FloodMonitoringPage isDarkMode={isDarkMode} />;
      case 'stations':
        return <WeatherStationsPage isDarkMode={isDarkMode} />;
      default:
        return <OverviewPage onNavigate={handlePageChange} isDarkMode={isDarkMode} />;
    }
  };

  // Theme classes
  const themeClasses = isDarkMode 
    ? 'bg-slate-900 text-white' 
    : 'bg-slate-50 text-slate-900';
  
  const headerClasses = isDarkMode 
    ? 'bg-slate-800/50 border-slate-700/50' 
    : 'bg-white/80 border-slate-200';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${themeClasses}`}>
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated gradient orbs */}
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          currentPage === 'weather' ? 'bg-blue-500' :
          currentPage === 'drought' ? 'bg-orange-500' :
          currentPage === 'flood' ? 'bg-cyan-500' :
          currentPage === 'stations' ? 'bg-green-500' :
          'bg-blue-500'
        }`} style={{ animationDuration: '4s' }} />
        <div className={`absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse ${
          currentPage === 'weather' ? 'bg-cyan-400' :
          currentPage === 'drought' ? 'bg-red-400' :
          currentPage === 'flood' ? 'bg-blue-400' :
          currentPage === 'stations' ? 'bg-emerald-400' :
          'bg-purple-400'
        }`} style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className={`absolute -bottom-40 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15 animate-pulse ${
          currentPage === 'weather' ? 'bg-indigo-400' :
          currentPage === 'drought' ? 'bg-yellow-400' :
          currentPage === 'flood' ? 'bg-teal-400' :
          currentPage === 'stations' ? 'bg-lime-400' :
          'bg-pink-400'
        }`} style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-30 animate-float ${
              currentPage === 'weather' ? 'bg-blue-400' :
              currentPage === 'drought' ? 'bg-orange-400' :
              currentPage === 'flood' ? 'bg-cyan-400' :
              currentPage === 'stations' ? 'bg-green-400' :
              'bg-blue-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <header className={`h-16 backdrop-blur-sm border-b flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerClasses}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors lg:hidden ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-200'}`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">FAO Uganda</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Early Warning System</p>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className={`hidden lg:flex items-center gap-1 rounded-xl p-1 ${isDarkMode ? 'bg-slate-800/80' : 'bg-slate-200/80'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-200'}`}
          >
            {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800/80' : 'bg-slate-200/80'}`}>
            <RefreshCw className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{currentDate}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
            Live Data
          </button>
          <button className={`relative p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-200'}`}>
            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-200'}`}>
            <Settings className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </button>
          <div className={`flex items-center gap-3 pl-4 border-l ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>FAO Uganda</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen relative z-10">
        {/* Main Content with transition */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
