import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface TimelineProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: Date;
  setCurrentTime: (time: Date) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isDarkMode: boolean;
}

export default function Timeline({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  animationSpeed,
  setAnimationSpeed,
  isDarkMode,
}: TimelineProps) {
  const [progress, setProgress] = useState(50);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Generate time markers for 24 hours
  const timeMarkers = [
    { label: '00:00', hour: 0 },
    { label: '03:00', hour: 3 },
    { label: '06:00', hour: 6 },
    { label: '09:00', hour: 9 },
    { label: '12:00', hour: 12 },
    { label: '15:00', hour: 15 },
    { label: '18:00', hour: 18 },
    { label: '21:00', hour: 21 },
    { label: '00:00', hour: 24 },
  ];

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '4x', value: 4 },
  ];

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // Update progress based on current time
  useEffect(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    setProgress((totalMinutes / 1440) * 100);
  }, [currentTime]);

  return (
    <div className="flex items-center justify-center gap-4">
      <Card className={`${isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} backdrop-blur-xl px-4 py-3 flex items-center gap-6 max-w-5xl w-full`}>
        {/* Date & Time Display */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg flex items-center justify-center`}>
            <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatDate(currentTime)}
            </div>
            <div className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTime(new Date(currentTime.getTime() - 3600000))}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentTime(new Date(currentTime.getTime() - 600000))}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-600/30"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTime(new Date(currentTime.getTime() + 600000))}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentTime(new Date(currentTime.getTime() + 3600000))}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 flex flex-col gap-1 min-w-[300px]">
          {/* Time Markers */}
          <div className="flex justify-between px-1">
            {timeMarkers.map((marker, index) => (
              <button
                key={index}
                onClick={() => {
                  const newTime = new Date(currentTime);
                  newTime.setHours(marker.hour);
                  newTime.setMinutes(0);
                  setCurrentTime(newTime);
                }}
                className={`text-xs transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {marker.label}
              </button>
            ))}
          </div>
          
          {/* Slider */}
          <div className="relative">
            <Slider
              value={[progress]}
              onValueChange={(value) => {
                setProgress(value[0]);
                const totalMinutes = (value[0] / 100) * 1440;
                const newTime = new Date(currentTime);
                newTime.setHours(Math.floor(totalMinutes / 60));
                newTime.setMinutes(Math.floor(totalMinutes % 60));
                setCurrentTime(newTime);
              }}
              max={100}
              step={0.1}
              className="w-full"
            />
            
            {/* Current time indicator */}
            <div 
              className="absolute top-0 w-0.5 h-4 bg-blue-500 pointer-events-none"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Settings className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{animationSpeed}x</span>
          </button>

          {showSpeedMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute bottom-full right-0 mb-2 border rounded-lg overflow-hidden shadow-xl ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setAnimationSpeed(option.value);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    animationSpeed === option.value
                      ? 'bg-blue-600 text-white'
                      : isDarkMode 
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Live Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isPlaying ? 'Live' : 'Paused'}
          </span>
        </div>
      </Card>
    </div>
  );
}
