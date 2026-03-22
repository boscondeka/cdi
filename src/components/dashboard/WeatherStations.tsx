import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  MapPin,
  Battery,
  Signal,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Weather station data
const weatherStations = [
  {
    id: 'KAMP-001',
    name: 'Kampala Central',
    location: { lat: 0.3476, lon: 32.5825, elevation: 1200 },
    status: 'online',
    battery: 87,
    signal: 95,
    lastUpdate: '2 min ago',
    sensors: {
      temperature: 26.5,
      humidity: 68,
      pressure: 1013.2,
      windSpeed: 8.5,
      windDirection: 'NE',
      rainfall: 12.5,
      solarRadiation: 850,
      soilMoisture: 45,
    },
    trends: {
      temperature: 'rising',
      humidity: 'falling',
      pressure: 'stable',
    },
    history: {
      temperature: [24, 25, 26, 26.5, 27, 26.5],
      rainfall: [0, 0, 5, 12.5, 8, 0],
    },
  },
  {
    id: 'ENTB-002',
    name: 'Entebbe Airport',
    location: { lat: 0.0516, lon: 32.4636, elevation: 1155 },
    status: 'online',
    battery: 92,
    signal: 98,
    lastUpdate: '1 min ago',
    sensors: {
      temperature: 25.8,
      humidity: 75,
      pressure: 1014.5,
      windSpeed: 12.3,
      windDirection: 'E',
      rainfall: 8.2,
      solarRadiation: 780,
      soilMoisture: 52,
    },
    trends: {
      temperature: 'stable',
      humidity: 'rising',
      pressure: 'rising',
    },
    history: {
      temperature: [25, 25.5, 25.8, 26, 25.8, 25.5],
      rainfall: [0, 2, 8.2, 5, 3, 0],
    },
  },
  {
    id: 'JINJ-003',
    name: 'Jinja Station',
    location: { lat: 0.4250, lon: 33.2022, elevation: 1175 },
    status: 'online',
    battery: 76,
    signal: 88,
    lastUpdate: '5 min ago',
    sensors: {
      temperature: 27.2,
      humidity: 62,
      pressure: 1012.8,
      windSpeed: 6.8,
      windDirection: 'SE',
      rainfall: 5.5,
      solarRadiation: 920,
      soilMoisture: 38,
    },
    trends: {
      temperature: 'rising',
      humidity: 'falling',
      pressure: 'falling',
    },
    history: {
      temperature: [25, 26, 26.5, 27, 27.2, 27.5],
      rainfall: [0, 0, 0, 5.5, 3, 0],
    },
  },
  {
    id: 'MBAL-004',
    name: 'Mbale Mountain',
    location: { lat: 1.0756, lon: 34.1756, elevation: 1312 },
    status: 'warning',
    battery: 34,
    signal: 72,
    lastUpdate: '12 min ago',
    sensors: {
      temperature: 22.5,
      humidity: 82,
      pressure: 1009.5,
      windSpeed: 15.2,
      windDirection: 'NW',
      rainfall: 28.5,
      solarRadiation: 650,
      soilMoisture: 68,
    },
    trends: {
      temperature: 'falling',
      humidity: 'rising',
      pressure: 'falling',
    },
    history: {
      temperature: [24, 23.5, 23, 22.5, 22, 21.5],
      rainfall: [5, 10, 15, 28.5, 20, 12],
    },
  },
  {
    id: 'MBAR-005',
    name: 'Mbarara West',
    location: { lat: -0.6072, lon: 30.6545, elevation: 1472 },
    status: 'online',
    battery: 81,
    signal: 91,
    lastUpdate: '3 min ago',
    sensors: {
      temperature: 24.8,
      humidity: 58,
      pressure: 1011.2,
      windSpeed: 9.5,
      windDirection: 'SW',
      rainfall: 0,
      solarRadiation: 980,
      soilMoisture: 32,
    },
    trends: {
      temperature: 'stable',
      humidity: 'falling',
      pressure: 'stable',
    },
    history: {
      temperature: [24, 24.5, 25, 24.8, 24.5, 24],
      rainfall: [0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 'GULU-006',
    name: 'Gulu North',
    location: { lat: 2.7747, lon: 32.2990, elevation: 1105 },
    status: 'offline',
    battery: 12,
    signal: 0,
    lastUpdate: '2 hours ago',
    sensors: {
      temperature: null,
      humidity: null,
      pressure: null,
      windSpeed: null,
      windDirection: null,
      rainfall: null,
      solarRadiation: null,
      soilMoisture: null,
    },
    trends: {
      temperature: 'unknown',
      humidity: 'unknown',
      pressure: 'unknown',
    },
    history: {
      temperature: [28, 28.5, 29, 28.5, 28, null],
      rainfall: [0, 0, 0, 0, 0, null],
    },
  },
  {
    id: 'ARUA-007',
    name: 'Arua Border',
    location: { lat: 3.0201, lon: 30.9111, elevation: 1208 },
    status: 'online',
    battery: 69,
    signal: 85,
    lastUpdate: '8 min ago',
    sensors: {
      temperature: 29.2,
      humidity: 45,
      pressure: 1010.8,
      windSpeed: 11.5,
      windDirection: 'N',
      rainfall: 0,
      solarRadiation: 1050,
      soilMoisture: 25,
    },
    trends: {
      temperature: 'rising',
      humidity: 'falling',
      pressure: 'rising',
    },
    history: {
      temperature: [27, 28, 28.5, 29, 29.2, 29.5],
      rainfall: [0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 'FORT-008',
    name: 'Fort Portal',
    location: { lat: 0.6710, lon: 30.2750, elevation: 1520 },
    status: 'online',
    battery: 78,
    signal: 89,
    lastUpdate: '4 min ago',
    sensors: {
      temperature: 21.8,
      humidity: 78,
      pressure: 1008.5,
      windSpeed: 5.2,
      windDirection: 'W',
      rainfall: 15.2,
      solarRadiation: 720,
      soilMoisture: 58,
    },
    trends: {
      temperature: 'falling',
      humidity: 'rising',
      pressure: 'falling',
    },
    history: {
      temperature: [23, 22.5, 22, 21.8, 21.5, 21],
      rainfall: [0, 5, 10, 15.2, 12, 8],
    },
  },
];

const statusConfig = {
  online: { color: 'green', bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Online' },
  warning: { color: 'amber', bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Warning' },
  offline: { color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'Offline' },
};

const StationCard = ({ station }: { station: typeof weatherStations[0] }) => {
  const config = statusConfig[station.status as keyof typeof statusConfig];
  const isOnline = station.status === 'online';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Radio className="w-4 h-4" />
            {station.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{station.id}</p>
        </div>
        <div className="text-right">
          <Badge className={`${config.bg} ${config.text} border-${config.color}-500`}>
            {config.label}
          </Badge>
          <p className="text-xs text-slate-400 mt-1">{station.lastUpdate}</p>
        </div>
      </div>

      {/* Battery & Signal */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Battery className="w-3 h-3" /> Battery
            </span>
            <span className={station.battery < 30 ? 'text-red-400' : 'text-green-400'}>
              {station.battery}%
            </span>
          </div>
          <Progress value={station.battery} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Signal className="w-3 h-3" /> Signal
            </span>
            <span className={station.signal < 50 ? 'text-red-400' : 'text-green-400'}>
              {station.signal}%
            </span>
          </div>
          <Progress value={station.signal} className="h-2" />
        </div>
      </div>

      {/* Sensor Readings */}
      {isOnline && station.sensors.temperature !== null && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-700/50 rounded-lg">
            <Thermometer className="w-4 h-4 mx-auto text-red-400 mb-1" />
            <p className="text-xs text-slate-400">Temp</p>
            <p className="text-sm font-semibold text-white">{station.sensors.temperature}°C</p>
            {station.trends.temperature === 'rising' && <TrendingUp className="w-3 h-3 mx-auto text-red-400" />}
            {station.trends.temperature === 'falling' && <TrendingDown className="w-3 h-3 mx-auto text-blue-400" />}
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded-lg">
            <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
            <p className="text-xs text-slate-400">Humidity</p>
            <p className="text-sm font-semibold text-white">{station.sensors.humidity}%</p>
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded-lg">
            <Wind className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
            <p className="text-xs text-slate-400">Wind</p>
            <p className="text-sm font-semibold text-white">{station.sensors.windSpeed}km/h</p>
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded-lg">
            <Gauge className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <p className="text-xs text-slate-400">Pressure</p>
            <p className="text-sm font-semibold text-white">{station.sensors.pressure}hPa</p>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <MapPin className="w-3 h-3" />
        <span>{station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}</span>
        <span className="text-slate-500">|</span>
        <span>{station.location.elevation}m elevation</span>
      </div>

      {/* Mini Chart */}
      {isOnline && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Temperature History (6h)</p>
          <div className="flex items-end gap-1 h-12">
            {station.history.temperature.map((temp, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-500 to-amber-400 rounded-t"
                style={{ height: temp ? `${((temp - 15) / 20) * 100}%` : '0%' }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const NetworkOverview = () => {
  const onlineCount = weatherStations.filter(s => s.status === 'online').length;
  const warningCount = weatherStations.filter(s => s.status === 'warning').length;
  const offlineCount = weatherStations.filter(s => s.status === 'offline').length;
  const avgBattery = weatherStations.filter(s => s.status !== 'offline').reduce((acc, s) => acc + s.battery, 0) / (weatherStations.length - offlineCount);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Online Stations</p>
          <p className="text-2xl font-bold text-green-400">{onlineCount}/{weatherStations.length}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Warnings</p>
          <p className="text-2xl font-bold text-amber-400">{warningCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Offline</p>
          <p className="text-2xl font-bold text-red-400">{offlineCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Avg Battery</p>
          <p className={`text-2xl font-bold ${avgBattery < 50 ? 'text-red-400' : 'text-green-400'}`}>
            {avgBattery.toFixed(0)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function WeatherStations() {
  const [,] = useState<string | null>(null);

  return (
    <div className="h-full space-y-4">
      <NetworkOverview />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">All Stations</TabsTrigger>
          <TabsTrigger value="online" className="data-[state=active]:bg-green-600">Online</TabsTrigger>
          <TabsTrigger value="warnings" className="data-[state=active]:bg-amber-600">Warnings</TabsTrigger>
          <TabsTrigger value="offline" className="data-[state=active]:bg-red-600">Offline</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {weatherStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="online" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {weatherStations.filter(s => s.status === 'online').map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warnings" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {weatherStations.filter(s => s.status === 'warning').map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {weatherStations.filter(s => s.status === 'offline').map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Download Section */}
      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Last 24h
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Last 7 Days
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Last 30 Days
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
