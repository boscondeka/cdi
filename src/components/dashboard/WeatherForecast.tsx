import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Clock,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock data for 24-hour nowcasting
const nowcastData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  time: `${i}:00`,
  temperature: 22 + Math.sin(i / 3) * 5 + Math.random() * 2,
  rainfall: Math.max(0, Math.sin(i / 4) * 15 + Math.random() * 5),
  humidity: 60 + Math.sin(i / 5) * 20 + Math.random() * 10,
  windSpeed: 5 + Math.random() * 10,
  condition: i % 4 === 0 ? 'rainy' : i % 3 === 0 ? 'cloudy' : 'sunny',
}));

// Mock data for 20-day forecast
const forecastData = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    maxTemp: 26 + Math.sin(i / 3) * 4 + Math.random() * 3,
    minTemp: 18 + Math.sin(i / 3) * 3 + Math.random() * 2,
    rainfall: Math.max(0, Math.sin(i / 5) * 25 + Math.random() * 10),
    humidity: 55 + Math.sin(i / 4) * 25 + Math.random() * 10,
    condition: i % 5 === 0 ? 'heavy-rain' : i % 4 === 0 ? 'light-rain' : i % 3 === 0 ? 'cloudy' : 'sunny',
    confidence: 85 + Math.random() * 10,
  };
});

const WeatherIcon = ({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className={`${className} text-amber-400`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'rainy':
    case 'light-rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'heavy-rain':
      return <CloudRain className={`${className} text-blue-600`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
};

const NowcastPanel = () => {
  const [selectedHour, setSelectedHour] = useState(0);

  return (
    <div className="space-y-4">
      {/* Current Conditions */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-slate-400 text-xs">Temperature</p>
                <p className="text-2xl font-bold text-white">{nowcastData[selectedHour].temperature.toFixed(1)}°C</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-xs">Rainfall</p>
                <p className="text-2xl font-bold text-white">{nowcastData[selectedHour].rainfall.toFixed(1)}mm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wind className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-slate-400 text-xs">Wind Speed</p>
                <p className="text-2xl font-bold text-white">{nowcastData[selectedHour].windSpeed.toFixed(1)}km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-indigo-400" />
              <div>
                <p className="text-slate-400 text-xs">Humidity</p>
                <p className="text-2xl font-bold text-white">{nowcastData[selectedHour].humidity.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Timeline */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            24-Hour Nowcast Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {nowcastData.map((hour, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedHour(index)}
                className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
                  selectedHour === index
                    ? 'bg-blue-600/30 border-blue-500'
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs text-slate-400">{hour.time}</p>
                  <WeatherIcon condition={hour.condition} className="w-6 h-6 mx-auto my-1" />
                  <p className="text-sm font-semibold text-white">{hour.temperature.toFixed(0)}°</p>
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Temperature Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Temperature Trend (Next 24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-end gap-1">
            {nowcastData.map((hour, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${((hour.temperature - 15) / 20) * 100}%` }}
                transition={{ delay: index * 0.02 }}
                className="flex-1 bg-gradient-to-t from-blue-600 to-amber-400 rounded-t"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ForecastPanel = () => {
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-xs mb-1">Avg Temperature</p>
            <p className="text-2xl font-bold text-white">
              {(forecastData.reduce((acc, d) => acc + d.maxTemp, 0) / forecastData.length).toFixed(1)}°C
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-xs mb-1">Total Rainfall</p>
            <p className="text-2xl font-bold text-blue-400">
              {forecastData.reduce((acc, d) => acc + d.rainfall, 0).toFixed(0)}mm
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-xs mb-1">Rainy Days</p>
            <p className="text-2xl font-bold text-cyan-400">
              {forecastData.filter(d => d.rainfall > 5).length} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 20-Day Forecast Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            20-Day Medium Range Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {forecastData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex-shrink-0 w-32 p-3 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <p className="text-xs text-slate-400 text-center">{day.day}</p>
                <p className="text-xs text-slate-500 text-center">{day.date}</p>
                <div className="flex justify-center my-2">
                  <WeatherIcon condition={day.condition} className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{day.maxTemp.toFixed(0)}°</p>
                  <p className="text-xs text-slate-400">{day.minTemp.toFixed(0)}°</p>
                </div>
                {day.rainfall > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">{day.rainfall.toFixed(0)}mm</span>
                  </div>
                )}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Confidence</span>
                    <span className="text-emerald-400">{day.confidence.toFixed(0)}%</span>
                  </div>
                  <Progress value={day.confidence} className="h-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function WeatherForecast() {
  return (
    <div className="h-full">
      <Tabs defaultValue="nowcast" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="nowcast" className="data-[state=active]:bg-blue-600">
            <Clock className="w-4 h-4 mr-2" />
            24-Hour Nowcast
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-600">
            <Calendar className="w-4 h-4 mr-2" />
            20-Day Forecast
          </TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <TabsContent value="nowcast" className="mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <NowcastPanel />
            </motion.div>
          </TabsContent>
          <TabsContent value="forecast" className="mt-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ForecastPanel />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
