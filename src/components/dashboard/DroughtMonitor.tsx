import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  MapPin,
  TrendingDown,
  Calendar,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Drought monitoring regions data
const droughtRegions = [
  {
    id: 'karamoja',
    name: 'Karamoja Region',
    severity: 'high',
    spi: -2.3,
    soilMoisture: 12,
    vegetationIndex: 0.25,
    temperature: 32,
    rainfall: 45,
    normalRainfall: 350,
    affectedPopulation: 450000,
    lastRain: '45 days ago',
    trend: 'worsening',
    alerts: ['Severe drought conditions', 'Livestock deaths reported', 'Water scarcity'],
  },
  {
    id: 'teso',
    name: 'Teso Sub-region',
    severity: 'medium',
    spi: -1.2,
    soilMoisture: 28,
    vegetationIndex: 0.45,
    temperature: 29,
    rainfall: 120,
    normalRainfall: 280,
    affectedPopulation: 180000,
    lastRain: '21 days ago',
    trend: 'stable',
    alerts: ['Moderate drought', 'Crop yield reduction'],
  },
  {
    id: 'acholi',
    name: 'Acholi Sub-region',
    severity: 'medium',
    spi: -1.0,
    soilMoisture: 32,
    vegetationIndex: 0.52,
    temperature: 28,
    rainfall: 145,
    normalRainfall: 300,
    affectedPopulation: 120000,
    lastRain: '18 days ago',
    trend: 'improving',
    alerts: ['Early drought warning'],
  },
  {
    id: 'ankole',
    name: 'Ankole Region',
    severity: 'low',
    spi: -0.3,
    soilMoisture: 55,
    vegetationIndex: 0.68,
    temperature: 26,
    rainfall: 220,
    normalRainfall: 280,
    affectedPopulation: 25000,
    lastRain: '5 days ago',
    trend: 'stable',
    alerts: ['Normal conditions'],
  },
  {
    id: 'buganda',
    name: 'Buganda Region',
    severity: 'low',
    spi: 0.2,
    soilMoisture: 62,
    vegetationIndex: 0.75,
    temperature: 25,
    rainfall: 280,
    normalRainfall: 320,
    affectedPopulation: 0,
    lastRain: '2 days ago',
    trend: 'stable',
    alerts: ['Normal conditions'],
  },
  {
    id: 'bukedi',
    name: 'Bukedi Sub-region',
    severity: 'medium',
    spi: -0.8,
    soilMoisture: 38,
    vegetationIndex: 0.58,
    temperature: 27,
    rainfall: 165,
    normalRainfall: 250,
    affectedPopulation: 85000,
    lastRain: '14 days ago',
    trend: 'stable',
    alerts: ['Moderate dryness'],
  },
];

const severityConfig = {
  high: { color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'Severe' },
  medium: { color: 'amber', bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Moderate' },
  low: { color: 'green', bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Normal' },
};

const SPIIndicator = ({ value }: { value: number }) => {
  let color = 'text-green-400';
  let label = 'Normal';
  if (value < -2) {
    color = 'text-red-400';
    label = 'Extreme Drought';
  } else if (value < -1.5) {
    color = 'text-orange-400';
    label = 'Severe Drought';
  } else if (value < -1) {
    color = 'text-amber-400';
    label = 'Moderate Drought';
  } else if (value < 0) {
    color = 'text-yellow-400';
    label = 'Mild Drought';
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-lg font-bold ${color}`}>{value.toFixed(1)}</span>
      <Badge variant="outline" className={color}>{label}</Badge>
    </div>
  );
};

const RegionCard = ({ region }: { region: typeof droughtRegions[0] }) => {
  const config = severityConfig[region.severity as keyof typeof severityConfig];
  const rainfallDeficit = ((region.normalRainfall - region.rainfall) / region.normalRainfall * 100).toFixed(0);

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
            <MapPin className="w-4 h-4" />
            {region.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${config.bg} ${config.text} border-${config.color}-500`}>
              {config.label}
            </Badge>
            {region.trend === 'worsening' && (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        <SPIIndicator value={region.spi} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-slate-400">Soil Moisture</p>
            <p className="text-sm font-semibold text-white">{region.soilMoisture}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-red-400" />
          <div>
            <p className="text-xs text-slate-400">Temperature</p>
            <p className="text-sm font-semibold text-white">{region.temperature}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">Rainfall</p>
            <p className="text-sm font-semibold text-white">{region.rainfall}mm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">Last Rain</p>
            <p className="text-sm font-semibold text-white">{region.lastRain}</p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Rainfall Deficit</span>
          <span className={Number(rainfallDeficit) > 50 ? 'text-red-400' : 'text-amber-400'}>
            {rainfallDeficit}%
          </span>
        </div>
        <Progress 
          value={100 - Number(rainfallDeficit)} 
          className="h-2"
        />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400">Vegetation Index: {region.vegetationIndex.toFixed(2)}</span>
      </div>

      {region.alerts.length > 0 && (
        <div className="space-y-1">
          {region.alerts.map((alert, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300">{alert}</span>
            </div>
          ))}
        </div>
      )}

      {region.affectedPopulation > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400">Affected Population</p>
          <p className="text-lg font-bold text-red-400">
            {region.affectedPopulation.toLocaleString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};

const NationalOverview = () => {
  const totalAffected = droughtRegions.reduce((acc, r) => acc + r.affectedPopulation, 0);
  const severeRegions = droughtRegions.filter(r => r.severity === 'high').length;
  const moderateRegions = droughtRegions.filter(r => r.severity === 'medium').length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Total Affected</p>
          <p className="text-2xl font-bold text-red-400">{totalAffected.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Severe Regions</p>
          <p className="text-2xl font-bold text-red-500">{severeRegions}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Moderate Regions</p>
          <p className="text-2xl font-bold text-amber-400">{moderateRegions}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">National SPI</p>
          <p className="text-2xl font-bold text-amber-400">
            {(droughtRegions.reduce((acc, r) => acc + r.spi, 0) / droughtRegions.length).toFixed(1)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DroughtMonitor() {
  useState<string | null>(null);

  return (
    <div className="h-full space-y-4">
      <NationalOverview />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">All Regions</TabsTrigger>
          <TabsTrigger value="severe" className="data-[state=active]:bg-red-600">Severe</TabsTrigger>
          <TabsTrigger value="moderate" className="data-[state=active]:bg-amber-600">Moderate</TabsTrigger>
          <TabsTrigger value="normal" className="data-[state=active]:bg-green-600">Normal</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {droughtRegions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="severe" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {droughtRegions.filter(r => r.severity === 'high').map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moderate" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {droughtRegions.filter(r => r.severity === 'medium').map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="normal" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {droughtRegions.filter(r => r.severity === 'low').map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
