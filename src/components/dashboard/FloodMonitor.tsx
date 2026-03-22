import { motion } from 'framer-motion';
import { 
  Waves, 
  AlertTriangle, 
  MapPin, 
  Droplets, 
  TrendingUp,
  TrendingDown,
  Clock,
  Bell,
  Shield,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Flood monitoring data
const floodAreas = [
  {
    id: 'lake-victoria',
    name: 'Lake Victoria Basin',
    risk: 'high',
    waterLevel: 12.8,
    normalLevel: 11.5,
    trend: 'rising',
    rainfall24h: 85,
    riverDischarge: 2450,
    alertLevel: 'red',
    lastUpdate: '15 min ago',
    affectedDistricts: ['Kalangala', 'Wakiso', 'Mpigi', 'Buikwe'],
    populationAtRisk: 125000,
    evacuationRoutes: 4,
    shelters: 12,
    alerts: ['Water level exceeding critical threshold', 'Evacuation advised for low-lying areas'],
  },
  {
    id: 'mt-elgon',
    name: 'Mt. Elgon Slopes',
    risk: 'medium',
    waterLevel: 6.2,
    normalLevel: 5.8,
    trend: 'rising',
    rainfall24h: 65,
    riverDischarge: 890,
    alertLevel: 'orange',
    lastUpdate: '22 min ago',
    affectedDistricts: ['Mbale', 'Bududa', 'Manafwa', 'Sironko'],
    populationAtRisk: 45000,
    evacuationRoutes: 2,
    shelters: 6,
    alerts: ['Landslide risk elevated', 'Monitor local updates'],
  },
  {
    id: 'rwenzori',
    name: 'Rwenzori Region',
    risk: 'medium',
    waterLevel: 4.8,
    normalLevel: 4.5,
    trend: 'stable',
    rainfall24h: 45,
    riverDischarge: 620,
    alertLevel: 'yellow',
    lastUpdate: '30 min ago',
    affectedDistricts: ['Kasese', 'Bundibugyo', 'Ntoroko'],
    populationAtRisk: 28000,
    evacuationRoutes: 2,
    shelters: 4,
    alerts: ['Elevated water levels', 'Stay alert'],
  },
  {
    id: 'albertine',
    name: 'Albertine Rift',
    risk: 'low',
    waterLevel: 3.2,
    normalLevel: 3.5,
    trend: 'falling',
    rainfall24h: 15,
    riverDischarge: 340,
    alertLevel: 'green',
    lastUpdate: '45 min ago',
    affectedDistricts: ['Hoima', 'Kikuube', 'Buliisa'],
    populationAtRisk: 0,
    evacuationRoutes: 1,
    shelters: 2,
    alerts: ['Normal conditions'],
  },
  {
    id: 'kyoga',
    name: 'Lake Kyoga Basin',
    risk: 'medium',
    waterLevel: 8.5,
    normalLevel: 8.0,
    trend: 'rising',
    rainfall24h: 55,
    riverDischarge: 1100,
    alertLevel: 'orange',
    lastUpdate: '18 min ago',
    affectedDistricts: ['Soroti', 'Serere', 'Amolatar', 'Apac'],
    populationAtRisk: 62000,
    evacuationRoutes: 3,
    shelters: 8,
    alerts: ['Water levels rising', 'Prepare for possible evacuation'],
  },
];

// Early warning alerts
const earlyWarnings = [
  {
    id: 1,
    area: 'Lake Victoria Basin',
    type: 'flood',
    severity: 'critical',
    message: 'Critical water levels detected. Immediate evacuation recommended.',
    issuedAt: '2024-01-15 14:30',
    expiresAt: '2024-01-16 14:30',
    status: 'active',
  },
  {
    id: 2,
    area: 'Mt. Elgon Slopes',
    type: 'landslide',
    severity: 'high',
    message: 'Heavy rainfall may trigger landslides. Avoid steep slopes.',
    issuedAt: '2024-01-15 12:00',
    expiresAt: '2024-01-16 06:00',
    status: 'active',
  },
  {
    id: 3,
    area: 'Rwenzori Region',
    type: 'flood',
    severity: 'moderate',
    message: 'River levels rising. Monitor local conditions.',
    issuedAt: '2024-01-15 10:15',
    expiresAt: '2024-01-16 10:15',
    status: 'active',
  },
];

const riskConfig = {
  high: { color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'High Risk' },
  medium: { color: 'amber', bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Medium Risk' },
  low: { color: 'green', bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Low Risk' },
};

const alertConfig = {
  red: { color: 'red', label: 'RED ALERT' },
  orange: { color: 'amber', label: 'ORANGE ALERT' },
  yellow: { color: 'yellow', label: 'YELLOW ALERT' },
  green: { color: 'green', label: 'GREEN' },
};

const FloodAreaCard = ({ area }: { area: typeof floodAreas[0] }) => {
  const config = riskConfig[area.risk as keyof typeof riskConfig];
  const alert = alertConfig[area.alertLevel as keyof typeof alertConfig];
  const levelPercent = (area.waterLevel / area.normalLevel) * 100;

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
            {area.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${config.bg} ${config.text} border-${config.color}-500`}>
              {config.label}
            </Badge>
            <Badge className={`bg-${alert.color}-500/20 text-${alert.color}-400 border-${alert.color}-500`}>
              {alert.label}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 ${area.trend === 'rising' ? 'text-red-400' : area.trend === 'falling' ? 'text-green-400' : 'text-amber-400'}`}>
            {area.trend === 'rising' ? <TrendingUp className="w-4 h-4" /> : area.trend === 'falling' ? <TrendingDown className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span className="text-xs capitalize">{area.trend}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{area.lastUpdate}</p>
        </div>
      </div>

      {/* Water Level Gauge */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Water Level</span>
          <span className={levelPercent > 110 ? 'text-red-400' : levelPercent > 100 ? 'text-amber-400' : 'text-green-400'}>
            {area.waterLevel}m / {area.normalLevel}m ({levelPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(levelPercent, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${levelPercent > 110 ? 'bg-red-500' : levelPercent > 100 ? 'bg-amber-500' : 'bg-green-500'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-slate-400">24h Rainfall</p>
            <p className="text-sm font-semibold text-white">{area.rainfall24h}mm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">River Discharge</p>
            <p className="text-sm font-semibold text-white">{area.riverDischarge} m³/s</p>
          </div>
        </div>
      </div>

      {area.populationAtRisk > 0 && (
        <div className="mb-3 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">
              {area.populationAtRisk.toLocaleString()} people at risk
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>{area.shelters} shelters</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{area.evacuationRoutes} routes</span>
        </div>
      </div>

      {area.alerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
          {area.alerts.map((alert, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <Bell className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300">{alert}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const WarningAlert = ({ alert }: { alert: typeof earlyWarnings[0] }) => {
  const severityConfig = {
    critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', icon: AlertTriangle },
    high: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', icon: AlertTriangle },
    moderate: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', icon: Info },
  };
  const config = severityConfig[alert.severity as keyof typeof severityConfig];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border ${config.border} ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{alert.area}</span>
            <Badge className={`${config.bg} ${config.text} text-xs`}>
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-300 mb-2">{alert.message}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Issued: {alert.issuedAt}</span>
            <span>Expires: {alert.expiresAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NationalFloodOverview = () => {
  const totalAtRisk = floodAreas.reduce((acc, a) => acc + a.populationAtRisk, 0);
  const highRiskAreas = floodAreas.filter(a => a.risk === 'high').length;
  const activeAlerts = earlyWarnings.filter(w => w.status === 'active').length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Population at Risk</p>
          <p className="text-2xl font-bold text-red-400">{totalAtRisk.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">High Risk Areas</p>
          <p className="text-2xl font-bold text-red-500">{highRiskAreas}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Active Alerts</p>
          <p className="text-2xl font-bold text-amber-400">{activeAlerts}</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <p className="text-slate-400 text-xs mb-1">Total Shelters</p>
          <p className="text-2xl font-bold text-blue-400">
            {floodAreas.reduce((acc, a) => acc + a.shelters, 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function FloodMonitor() {
  return (
    <div className="h-full space-y-4">
      <NationalFloodOverview />

      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="areas" className="data-[state=active]:bg-blue-600">Flood Areas</TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-red-600">Early Warnings</TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-cyan-600">Flood Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {floodAreas.map((area) => (
              <FloodAreaCard key={area.id} area={area} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-3">
            {earlyWarnings.map((alert) => (
              <WarningAlert key={alert.id} alert={alert} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-400" />
                7-Day Flood Risk Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Lake Victoria Basin', 'Mt. Elgon Slopes', 'Rwenzori Region', 'Lake Kyoga Basin'].map((area) => (
                  <div key={area} className="flex items-center gap-4">
                    <span className="text-sm text-white w-40">{area}</span>
                    <div className="flex-1 flex gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const risk = Math.random();
                        let color = 'bg-green-500/50';
                        if (risk > 0.7) color = 'bg-red-500/80';
                        else if (risk > 0.4) color = 'bg-amber-500/60';
                        return (
                          <div key={day} className="flex-1">
                            <div className={`h-8 ${color} rounded`} />
                            <p className="text-xs text-center text-slate-400 mt-1">{day}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/50 rounded" />
                  <span className="text-xs text-slate-400">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500/60 rounded" />
                  <span className="text-xs text-slate-400">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500/80 rounded" />
                  <span className="text-xs text-slate-400">High Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
