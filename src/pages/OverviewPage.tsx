import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  ArrowRight,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Cloud,
  Sun,
  Radio,
  BarChart2,
  Activity,
  AlertCircle,
  Signal,
  Timer,
  Users,
  Download,
} from "lucide-react";
import { ThresholdScale } from "../components/shared/ThresholdScale";
import { BulletinDownloadModal } from "../components/shared/BulletinDownloadModal";
import React, { useState, useEffect } from "react";
import type { PageType } from "../App";
import {
  overviewAPI,
  weatherAPI,
  floodAPI,
  stationsAPI,
} from "../services/api";
import type { FloodForecastFull, BasinStatus } from "../services/api";
import { useAppStore } from "@/store/useAppStore";
import { useAssessmentCounts } from "@/hooks/useAssessmentCounts";
import { useWeatherForecast } from "@/hooks/useWeatherForecast";

interface OverviewPageProps {
  onNavigate: (page: PageType) => void;
  isDarkMode?: boolean;
}

const FAO_BLUE = "#2563eb";
const FAO_BLUE_LIGHT = "#3b82f6";
const OCEAN_TEAL = "#0d9488";
const EARTH_GREEN = "#16a34a";
const SUNSET_ORANGE = "#ea580c";
const SKY_CYAN = "#06b6d4";

const formatTimeAgo = (ds: string) => {
  try {
    const s = Math.floor((Date.now() - new Date(ds).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    return `${Math.floor(s / 3600)} hr ago`;
  } catch {
    return "recently";
  }
};

const PATHS = {
  up: "M2,20 C12,17 24,13 34,9  C44,5  54,3  68,2",
  down: "M2,2  C12,5  24,9  34,13 C44,17 54,19  68,21",
  flat: "M2,12 C12,7  18,16 28,11 C38,6  52,15  68,10",
  volatile: "M2,13 C8,4  15,20  23,8  C31,2  41,18  51,7 C59,2  65,15  68,11",
};
const Sparkline = ({
  type,
  color,
}: {
  type: keyof typeof PATHS;
  color: string;
}) => (
  <svg width="72" height="24" viewBox="0 0 72 24" fill="none">
    <path
      d={PATHS[type]}
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IntroOverlay = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const bg = isDarkMode ? "#0f172a" : "#b8d4ee";
  const cA = isDarkMode ? "rgba(180,210,255,0.90)" : "rgba(255,255,255,0.94)";
  const cB = isDarkMode ? "rgba(130,170,230,0.80)" : "rgba(220,238,255,0.88)";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        background: bg,
        animation: "introFade 2.6s ease forwards",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.50) 0%, transparent 65%)",
          animation: "glowPulse 2.6s ease forwards",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: "28%",
          animation: "cloudLeft 2.6s cubic-bezier(0.22,0.61,0.36,1) forwards",
        }}
      >
        <svg
          viewBox="0 0 280 130"
          fill="none"
          style={{ width: 340, display: "block" }}
        >
          <ellipse cx="140" cy="90" rx="118" ry="40" fill={cA} />
          <ellipse cx="85" cy="75" rx="62" ry="48" fill={cA} />
          <ellipse cx="175" cy="68" rx="72" ry="52" fill={cA} />
          <ellipse cx="135" cy="56" rx="55" ry="46" fill={cA} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: "22%",
          animation: "cloudRight 2.6s cubic-bezier(0.22,0.61,0.36,1) forwards",
        }}
      >
        <svg
          viewBox="0 0 260 120"
          fill="none"
          style={{ width: 310, display: "block" }}
        >
          <ellipse cx="130" cy="82" rx="108" ry="37" fill={cB} />
          <ellipse cx="78" cy="68" rx="58" ry="44" fill={cB} />
          <ellipse cx="168" cy="62" rx="66" ry="48" fill={cB} />
          <ellipse cx="126" cy="52" rx="50" ry="42" fill={cB} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            animation: "cloudTop 2.6s cubic-bezier(0.22,0.61,0.36,1) forwards",
          }}
        >
          <svg
            viewBox="0 0 380 165"
            fill="none"
            style={{ width: 420, display: "block" }}
          >
            <ellipse cx="190" cy="110" rx="155" ry="54" fill={cA} />
            <ellipse cx="112" cy="90" rx="85" ry="65" fill={cA} />
            <ellipse cx="258" cy="84" rx="92" ry="68" fill={cA} />
            <ellipse cx="186" cy="68" rx="74" ry="60" fill={cA} />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            animation: "boltFlash 2.6s ease forwards",
            filter:
              "drop-shadow(0 0 16px rgba(251,191,36,1)) drop-shadow(0 0 40px rgba(251,191,36,0.65))",
          }}
        >
          <svg
            viewBox="0 0 64 148"
            fill="none"
            style={{ width: 64, display: "block" }}
          >
            <polygon
              points="42,0 8,82 30,82 14,148 58,60 34,60 50,0"
              fill="#FCD34D"
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          whiteSpace: "nowrap",
          animation: "textReveal 2.6s ease forwards",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={isDarkMode ? "/fao-white.png" : "/fao_logo_3lines_en1.png"}
            alt="FAO"
            style={{ height: 44, width: "auto", objectFit: "contain" }}
          />
          <div
            style={{
              width: 1,
              height: 40,
              background: isDarkMode
                ? "rgba(148,163,184,0.35)"
                : "rgba(51,85,120,0.25)",
            }}
          />
          <img
            src="/uganda-coat-of-arms.svg"
            alt="Uganda Coat of Arms"
            style={{ height: 48, width: "auto", objectFit: "contain" }}
          />
        </div>
        <p
          style={{
            fontSize: "clamp(0.85rem, 2vw, 1.25rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            color: isDarkMode
              ? "rgba(241,245,249,0.92)"
              : "rgba(15,23,42,0.88)",
            marginTop: "2px",
          }}
        >
          Uganda Multi Hazard Observatory System
        </p>
      </div>
    </div>
  );
};

type StatIcon = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;
type ModuleStat = {
  label: string;
  value: string;
  sub?: string;
  Icon?: StatIcon;
};

export default function OverviewPage({
  onNavigate,
  isDarkMode = true,
}: OverviewPageProps) {
  const { selectedDistrictId, floodAlerts } = useAppStore((s) => s);
  const { extremeCount, trendingCount, improvingCount, month, year, drought } =
    useAssessmentCounts();
  const { forecast } = useWeatherForecast();

  const MODULES: {
    id: string;
    title: string;
    color: string;
    desc: string;
    ctaLabel: string;
    Icon: StatIcon;
    stats: ModuleStat[];
  }[] = [
    {
      id: "weather",
      title: "Weather Forecast",
      color: FAO_BLUE,
      desc: "Real-time weather data and 7-day forecasts with high precision predictions for accurate planning.",
      Icon: Cloud,
      ctaLabel: "Open Forecast Center",
      stats: [
        {
          label: "Highest Rainfall",
          value: "--",
          sub: undefined,
          Icon: CloudRain,
        },
        {
          label: "Highest Temp",
          value: "--",
          sub: undefined,
          Icon: Thermometer,
        },
        { label: "Highest Wind", value: "--", sub: undefined, Icon: Wind },
        {
          label: "Highest Humidity",
          value: "--",
          sub: undefined,
          Icon: Droplets,
        },
      ],
    },
    {
      id: "drought",
      title: `Drought Monitor ${month},${year}`,
      color: SUNSET_ORANGE,
      desc: "Advanced drought monitoring with combined indices for comprehensive risk assessment and early warning.",
      Icon: Sun,
      ctaLabel: "Open Drought Center",
      stats: [
        { label: "Extreme Severity", value: "--", Icon: AlertCircle },
        { label: "Trending", value: "--", Icon: TrendingUp },
        { label: "Improving", value: "--", Icon: TrendingDown },
        { label: "Districts at Risk", value: "--", Icon: BarChart2 },
      ],
    },
    {
      id: "flood",
      title: "Flood Monitor",
      color: OCEAN_TEAL,
      desc: "River basin monitoring, discharge tracking, and flood risk assessment for timely emergency response.",
      Icon: Droplets,
      ctaLabel: "Open Flood Center",
      stats: [
        { label: "People at Risk", value: "--", sub: undefined, Icon: Users },
        {
          label: "Highest Discharge",
          value: "--",
          sub: undefined,
          Icon: Activity,
        },
        {
          label: "Active Basins",
          value: "--",
          sub: undefined,
          Icon: Activity,
        },
        { label: "Active Alerts", value: "--", Icon: AlertCircle },
      ],
    },
    {
      id: "stations",
      title: "Weather Stations",
      color: EARTH_GREEN,
      desc: "Network of automatic weather stations providing real-time ground truth data across Uganda.",
      Icon: Radio,
      ctaLabel: "Open Station Network",
      stats: [
        { label: "Stations Online", value: "--", Icon: Signal },
        { label: "Data Frequency", value: "15 min", Icon: Timer },
        { label: "Network Health", value: "--", Icon: Signal },
        { label: "Last Transmission", value: "--", Icon: Clock },
      ],
    },
  ];

  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [alertsHover, setAlertsHover] = useState(false);
  const [liveFloodAlerts, setLiveFloodAlerts] = useState<Array<{
    id: string; basinName: string; status: string; discharge: number; population: number;
  }>>([]);
  const [quickStats, setQuickStats] = useState({
    lastUpdated: "",
    alerts: 0,
    online: 0,
    total: 0,
  });
  const [modules, setModules] = useState(MODULES);

  useEffect(() => {
    if (month === "--" && year === "--") return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === "drought"
          ? { ...m, title: `Drought Monitor ${month}, ${year}` }
          : m,
      ),
    );
  }, [month, year]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          msResult,
          qsResult,
          wdResult,
          floodDashResult,
          basinStatusResult,
          forecastsResult,
          stationsResult,
          networkResult,
          extremesResult,
        ] = await Promise.allSettled([
          overviewAPI.getModuleStats() as Promise<any>,
          overviewAPI.getQuickStats() as Promise<any>,
          weatherAPI.getDashboard() as Promise<any>,
          floodAPI.getDashboard(),
          floodAPI.getBasinStatus(),
          floodAPI.getForecasts(),
          stationsAPI.getAll(),
          stationsAPI.getNetworkSummary(),
          weatherAPI.getExtremes() as Promise<any>,
        ]);

        const ms = msResult.status === "fulfilled" ? msResult.value : null;
        const qs = qsResult.status === "fulfilled" ? qsResult.value : null;
        const wd = wdResult.status === "fulfilled" ? wdResult.value : null;
        const fd =
          floodDashResult.status === "fulfilled" ? floodDashResult.value : null;
        const bs =
          basinStatusResult.status === "fulfilled"
            ? (basinStatusResult.value as BasinStatus[] | null)
            : null;
        const fcs =
          forecastsResult.status === "fulfilled"
            ? (forecastsResult.value as FloodForecastFull[])
            : [];
        const allStations =
          stationsResult.status === "fulfilled"
            ? ((stationsResult.value ?? []) as any[])
            : [];
        const net =
          networkResult.status === "fulfilled"
            ? (networkResult.value as any)
            : null;
        const extremes =
          extremesResult.status === "fulfilled"
            ? (extremesResult.value as any)
            : null;

        const stationsOnline =
          net?.online_count ??
          allStations.filter((s: any) => s.status === "online").length ??
          ms?.weather_stations?.online ??
          qs?.stations_online ??
          0;
        const stationsTotal =
          net?.total_stations ??
          allStations.length ??
          ms?.weather_stations?.total ??
          qs?.stations_total ??
          0;
        const lastUpdated =
          net?.last_updated ?? wd?.fetched_at ?? qs?.last_updated ?? "";
        setQuickStats({
          lastUpdated: lastUpdated ? formatTimeAgo(lastUpdated) : "",
          alerts: fd?.summary?.active_alerts ?? qs?.active_alerts ?? 0,
          online: stationsOnline,
          total: stationsTotal,
        });

        if (wd) setWeather(wd);

        type StatPatch = { value: string; sub?: string };

        const weatherStats: StatPatch[] = [
          {
            value:
              extremes?.highest_rainfall?.value != null
                ? `${extremes.highest_rainfall.value} mm`
                : wd?.rainfall_24h != null
                  ? `${wd.rainfall_24h} mm`
                  : "--",
            sub:
              extremes?.highest_rainfall?.district ?? wd?.district ?? undefined,
          },
          {
            value:
              extremes?.highest_temperature?.value != null
                ? `${extremes.highest_temperature.value}°C`
                : wd?.temperature != null
                  ? `${wd.temperature}°C`
                  : "--",
            sub:
              extremes?.highest_temperature?.district ??
              wd?.district ??
              undefined,
          },
          {
            value:
              extremes?.highest_wind?.value != null
                ? `${extremes.highest_wind.value} km/h`
                : wd?.wind_speed != null
                  ? `${wd.wind_speed} km/h`
                  : "--",
            sub: extremes?.highest_wind?.district ?? wd?.district ?? undefined,
          },
          {
            value:
              extremes?.highest_humidity?.value != null
                ? `${extremes.highest_humidity.value}%`
                : wd?.humidity != null
                  ? `${wd.humidity}%`
                  : "--",
            sub:
              extremes?.highest_humidity?.district ?? wd?.district ?? undefined,
          },
        ];

        const droughtStats: StatPatch[] = [
          {
            value: extremeCount != null ? extremeCount?.toString() : "--",
          },
          {
            value: trendingCount != null ? trendingCount?.toString() : "--",
          },
          {
            value: improvingCount != null ? improvingCount?.toString() : "--",
          },
          {
            value:
              ms?.drought_monitor?.districts_at_risk != null
                ? String(ms.drought_monitor.districts_at_risk)
                : "--",
          },
        ];

        const latestForecast = fcs.find((f) => f.leadtime_hours === 24) ?? fcs[0];
        const districtImpacts = (latestForecast?.impacts ?? []).filter(
          (i) => i.district_name !== null,
        );
        const forecastPopulation =
          districtImpacts.length > 0
            ? districtImpacts.reduce((s, i) => s + (i.affected_population ?? 0), 0)
            : null;
        const peopleAtRisk =
          forecastPopulation != null
            ? forecastPopulation
            : fd?.summary?.at_risk_population ?? latestForecast?.total_affected_population;
        const peopleStr =
          peopleAtRisk != null
            ? peopleAtRisk >= 1_000_000
              ? `${(peopleAtRisk / 1_000_000).toFixed(1)}M`
              : peopleAtRisk >= 1_000
                ? `${Math.round(peopleAtRisk / 1_000)}K`
                : String(peopleAtRisk)
            : "--";

        const basinLevelImpacts = (latestForecast?.impacts ?? []).filter(
          (i) => i.district_name === null,
        );
        const maxDischargeRow = basinLevelImpacts.length > 0
          ? basinLevelImpacts.reduce((best, i) =>
              (i.max_discharge ?? 0) > (best.max_discharge ?? 0) ? i : best,
            )
          : null;
        const maxDischarge = maxDischargeRow?.max_discharge ?? null;
        const maxDischargeFallbackRow = bs && bs.length > 0
          ? bs.reduce((best, b) =>
              (b.discharge_rate ?? 0) > (best.discharge_rate ?? 0) ? b : best,
            )
          : null;
        const effectiveMaxDischarge = maxDischarge ?? maxDischargeFallbackRow?.discharge_rate ?? null;
        const effectiveMaxBasinName =
          maxDischargeRow?.river_basin_name ?? maxDischargeFallbackRow?.name ?? undefined;
        const dischargeStr =
          effectiveMaxDischarge != null
            ? `${(Math.round(effectiveMaxDischarge * 10) / 10).toLocaleString()} m³/s`
            : "--";

        const isElevatedStatus = (s?: string | null) =>
          s === "severe" || s === "extreme" || s === "high" || s === "critical";
        const activeBasinNames = Array.from(
          new Set(
            (latestForecast?.impacts ?? [])
              .map((i) => i.river_basin_name)
              .filter((n): n is string => n != null),
          ),
        );
        const totalBasinsStr = activeBasinNames.length > 0
          ? String(activeBasinNames.length)
          : "--";

        const derivedAlerts: Array<{
          id: string; basinName: string; status: string; discharge: number; population: number;
        }> = [];
        const basinImpactsForAlerts = (latestForecast?.impacts ?? [])
          .filter((i) => i.district_name == null && i.river_basin_name != null);
        basinImpactsForAlerts.forEach((i) => {
          if (isElevatedStatus(i.flood_risk_level) && i.river_basin_name &&
              !derivedAlerts.find((n) => n.basinName === i.river_basin_name)) {
            derivedAlerts.push({
              id: `flood-${i.river_basin_name}`,
              basinName: i.river_basin_name,
              status: i.flood_risk_level ?? "high",
              discharge: Math.round(i.max_discharge ?? 0),
              population: i.affected_population ?? 0,
            });
          }
        });
        (bs ?? []).filter((b) => isElevatedStatus(b.status)).forEach((b) => {
          if (!derivedAlerts.find((n) => n.basinName === b.name))
            derivedAlerts.push({
              id: `flood-${b.name}`,
              basinName: b.name,
              status: b.status,
              discharge: Math.round(b.discharge_rate),
              population: b.population_at_risk ?? 0,
            });
        });

        const effectiveAlerts = floodAlerts.length > 0 ? floodAlerts : derivedAlerts;
        setLiveFloodAlerts(effectiveAlerts);

        const activeAlerts =
          effectiveAlerts.length > 0
            ? effectiveAlerts.length
            : fd?.summary?.active_alerts ?? fd?.summary?.critical_basins ?? qs?.active_alerts;
        const alertsStr = activeAlerts != null ? String(activeAlerts) : "--";

        const floodStats: StatPatch[] = [
          { value: peopleStr, sub: undefined },
          { value: dischargeStr, sub: effectiveMaxBasinName },
          { value: totalBasinsStr, sub: undefined },
          { value: alertsStr, sub: undefined },
        ];

        const onlineStr =
          stationsTotal > 0 ? `${stationsOnline}/${stationsTotal}` : "--";
        const lastTxRaw =
          net?.last_updated ??
          allStations
            .map((s: any) => s.last_update ?? s.last_updated ?? "")
            .filter(Boolean)
            .sort()
            .reverse()[0] ??
          qs?.last_updated ??
          "";
        const lastTxStr = lastTxRaw ? formatTimeAgo(lastTxRaw) : "--";
        const networkHealthStr =
          net?.network_uptime_percent != null
            ? `${Math.round(net.network_uptime_percent)}%`
            : net?.online_count != null && net?.total_stations > 0
              ? `${Math.round((net.online_count / net.total_stations) * 100)}%`
              : stationsTotal > 0
                ? `${Math.round((stationsOnline / stationsTotal) * 100)}%`
                : "--";

        const stationStats: StatPatch[] = [
          { value: onlineStr },
          { value: "15 min" },
          { value: networkHealthStr },
          { value: lastTxStr },
        ];

        const allUpdates = [
          weatherStats,
          droughtStats,
          floodStats,
          stationStats,
        ];

        setModules((prev) =>
          prev.map((m, i) => ({
            ...m,
            stats: m.stats.map((s, j) => ({
              ...s,
              value: allUpdates[i]?.[j]?.value ?? s.value,
              sub:
                allUpdates[i]?.[j]?.sub !== undefined
                  ? allUpdates[i][j].sub
                  : s.sub,
            })),
          })),
        );

        setApiError(null);
      } catch (err) {
        console.error("[OverviewPage] load error:", err);
        setApiError("Some live data unavailable — showing last known values.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
    const iv = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [selectedDistrictId, extremeCount, trendingCount, improvingCount, floodAlerts]);

  const temp = weather?.temperature ?? 0;
  const humid = weather?.humidity ?? 0;
  const wind = weather?.wind_speed ?? 0;
  const rain = weather?.rainfall_24h ?? 0;
  const tΔ = weather?.temperature_delta ?? 0;
  const hΔ = weather?.humidity_delta ?? 0;
  const wΔ = weather?.wind_speed_delta ?? 0;
  const rΔ = weather?.rainfall_24h_delta ?? 0;

  const card = isDarkMode ? "rgba(30, 41, 59, 0.88)" : "rgba(255, 255, 255, 0.92)";
  const bdr = isDarkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.8)";
  const hd = isDarkMode ? "#f8fafc" : "#0f172a";
  const bd = isDarkMode ? "#e2e8f0" : "#475569";
  const mt = isDarkMode ? "#94a3b8" : "#64748b";
  const cardShadow = isDarkMode 
    ? "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)"
    : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)";
  const cardHoverShadow = isDarkMode
    ? "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)"
    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      
      {(showIntro || isLoading) && <IntroOverlay isDarkMode={isDarkMode} />}

      <div className="relative z-10 px-6 md:px-10 xl:px-16 2xl:px-24 py-8 space-y-8">
        {apiError && (
          <div
            className="text-sm px-4 py-3 rounded-xl border-l-4 border-amber-500 bg-amber-500/10 flex items-center gap-3"
            style={{ color: isDarkMode ? "#fcd34d" : "#92400e" }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: hd }}>
                Dashboard Overview
              </h1>
            </div>
            <p className="text-base" style={{ color: mt }}>
              Uganda Multi Hazard Observatory System
            </p>
            {selectedDistrictId?.name && (
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" style={{ color: FAO_BLUE }} />
                <span className="text-sm font-medium" style={{ color: bd }}>
                  {selectedDistrictId?.name}, {selectedDistrictId?.region} Region
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: `${FAO_BLUE}15`, color: FAO_BLUE }}
                >
                  Live
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:items-end gap-3">
            {quickStats.lastUpdated && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: mt }}
              >
                <Clock className="w-4 h-4" />
                <span>Updated {quickStats.lastUpdated}</span>
                <span className="flex items-center gap-1.5 text-green-500 font-semibold ml-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                  Live
                </span>
              </div>
            )}
            <button
              onClick={() => setShowBulletinModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: FAO_BLUE, color: "#ffffff", boxShadow: `0 4px 14px 0 ${FAO_BLUE}40` }}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Weekly Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: FAO_BLUE }}
              >
                Current Conditions
              </p>
              <h2 className="text-xl font-bold mt-1" style={{ color: hd }}>
                Real-time Weather Metrics
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Temperature",
                Icon: Thermometer,
                color: SUNSET_ORANGE,
                val: temp,
                Δ: tΔ,
                unit: "°C",
                valStr: `${temp}°C`,
                spark: (tΔ >= 0 ? "up" : "down") as keyof typeof PATHS,
                min: 15,
                max: 40,
                thresholds: [
                  { value: 20, color: "#60a5fa", label: "Cool" },
                  { value: 28, color: "#34d399", label: "Mild" },
                  { value: 35, color: "#ea580c", label: "Warm" },
                  { value: 40, color: "#dc2626", label: "Hot" },
                ],
              },
              {
                label: "Rainfall",
                Icon: CloudRain,
                color: SKY_CYAN,
                val: rain,
                Δ: rΔ,
                unit: " mm",
                valStr: `${rain} mm`,
                spark: "flat" as keyof typeof PATHS,
                min: 0,
                max: 100,
                thresholds: [
                  { value: 5, color: "#e0f2fe", label: "Dry" },
                  { value: 25, color: "#38bdf8", label: "Light" },
                  { value: 50, color: "#0284c7", label: "Moderate" },
                  { value: 100, color: "#1e3a8a", label: "Heavy" },
                ],
              },
              {
                label: "Humidity",
                Icon: Droplets,
                color: FAO_BLUE_LIGHT,
                val: humid,
                Δ: hΔ,
                unit: "%",
                valStr: `${humid}%`,
                spark: (hΔ >= 0 ? "up" : "down") as keyof typeof PATHS,
                min: 0,
                max: 100,
                thresholds: [
                  { value: 30, color: "#dc2626", label: "Dry" },
                  { value: 50, color: "#eab308", label: "Low" },
                  { value: 70, color: "#22c55e", label: "Normal" },
                  { value: 100, color: "#3b82f6", label: "High" },
                ],
              },
              {
                label: "Wind Speed",
                Icon: Wind,
                color: "#64748b",
                val: wind,
                Δ: wΔ,
                unit: " km/h",
                valStr: `${wind} km/h`,
                spark: "volatile" as keyof typeof PATHS,
                min: 0,
                max: 60,
                thresholds: [
                  { value: 10, color: "#22c55e", label: "Calm" },
                  { value: 25, color: "#3b82f6", label: "Breezy" },
                  { value: 40, color: "#ea580c", label: "Windy" },
                  { value: 60, color: "#dc2626", label: "Strong" },
                ],
              },
            ].map((m) => {
              const Icon = m.Icon;
              const up = m.Δ > 0;
              const DeltaIcon =
                m.Δ > 0 ? TrendingUp : m.Δ < 0 ? TrendingDown : Minus;
              const dCol = m.Δ > 0 ? "#22c55e" : m.Δ < 0 ? "#ef4444" : mt;
              return (
                <div
                  key={m.label}
                  className="rounded-2xl p-5 border transition-all duration-200 hover:translate-y-[-2px]"
                  style={{ 
                    background: card, 
                    borderColor: `${m.color}30`, 
                    boxShadow: cardShadow,
                    borderWidth: '1px'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${m.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: m.color }} />
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: bd }}
                      >
                        {m.label}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: mt }}
                      >
                        7-Day Trend
                      </span>
                      <Sparkline type={m.spark} color={m.color} />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-black leading-none mb-2"
                    style={{ color: hd }}
                  >
                    {m.valStr}
                  </p>
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: dCol }}
                  >
                    <DeltaIcon className="w-3.5 h-3.5" />
                    <span>
                      {up ? "+" : ""}
                      {m.Δ}
                      {m.unit} (24h)
                    </span>
                  </div>
                  <div className="mt-4">
                    <ThresholdScale
                      value={m.val}
                      min={m.min}
                      max={m.max}
                      thresholds={m.thresholds}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: FAO_BLUE }}
              >
                Monitoring Systems
              </p>
              <h2 className="text-xl font-bold mt-1" style={{ color: hd }}>
                Explore Specialized Monitoring Modules
              </h2>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: mt }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Live Data
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {modules.map((mod) => {
              const ModIcon = mod.Icon;
              const isFlood = mod.id === "flood";
              return (
                <button
                  key={mod.id}
                  onClick={() => onNavigate(mod.id as PageType)}
                  className="group rounded-2xl border text-left p-6 flex flex-col transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: card,
                    borderColor: `${mod.color}25`,
                    boxShadow: cardShadow,
                    borderWidth: '1px'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 8px 25px -5px ${mod.color}20, ${cardHoverShadow}`;
                    (e.currentTarget as HTMLElement).style.borderColor =
                      `${mod.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                    (e.currentTarget as HTMLElement).style.borderColor =
                      `${mod.color}25`;
                  }}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${mod.color}12` }}
                    >
                      <ModIcon className="w-6 h-6" style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{ color: hd }}
                      >
                        {mod.id === "drought" ? (
                          <>
                            {mod.title.replace(/\s+\S+,\S+$/, "")}{" "}
                            <span style={{ color: mod.color }}>
                              {mod.title.match(/\S+,\S+$/)?.[0]}
                            </span>
                          </>
                        ) : (
                          mod.title
                        )}
                      </h3>
                      <p
                        className="text-sm mt-2 leading-relaxed"
                        style={{ color: mt }}
                      >
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: `1px solid ${isDarkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.8)"}`,
                      marginBottom: "20px",
                    }}
                  />

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {mod.stats.map((s) => {
                      const StatIcon = s.Icon;
                      const isAlertsCell = isFlood && s.label === "Active Alerts";
                      return (
                        <div
                          key={s.label}
                          className="flex flex-col gap-1.5 relative"
                          onMouseEnter={isAlertsCell ? (e) => { e.stopPropagation(); setAlertsHover(true); } : undefined}
                          onMouseLeave={isAlertsCell ? (e) => { e.stopPropagation(); setAlertsHover(false); } : undefined}
                        >
                          {StatIcon && (
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                              style={{ background: `${mod.color}10` }}
                            >
                              <StatIcon
                                className="w-4 h-4"
                                style={{ color: mod.color }}
                              />
                            </div>
                          )}
                          <span
                            className="text-[11px] font-medium leading-tight"
                            style={{ color: mt }}
                          >
                            {s.label}
                          </span>
                          <span
                            className="text-sm font-bold leading-tight"
                            style={{ color: isAlertsCell && liveFloodAlerts.length > 0 ? "#ef4444" : hd }}
                          >
                            {s.value}
                          </span>
                          {s.sub && (
                            <span
                              className="text-[10px] leading-tight truncate"
                              style={{ color: mod.color, opacity: 0.9 }}
                            >
                              {s.sub}
                            </span>
                          )}

                          {isAlertsCell && alertsHover && liveFloodAlerts.length > 0 && (
                            <div
                              className="absolute bottom-full mb-3 left-1/2 z-50 w-64 rounded-2xl border shadow-2xl overflow-hidden"
                              style={{
                                transform: "translateX(-60%)",
                                background: card,
                                borderColor: bdr,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="px-4 py-3 border-b flex items-center justify-between"
                                style={{ borderColor: `${mod.color}20` }}
                              >
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#ef4444" }}>
                                  Active Alerts
                                </span>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "#ef444415", color: "#ef4444" }}>
                                  {liveFloodAlerts.length}
                                </span>
                              </div>
                              <div className="py-2 max-h-48 overflow-y-auto">
                                {liveFloodAlerts.map((a) => {
                                  const statusColor =
                                    a.status === "extreme" || a.status === "critical" ? "#ef4444"
                                      : a.status === "severe" || a.status === "high" ? "#ea580c"
                                      : "#eab308";
                                  return (
                                    <div
                                      key={a.id}
                                      className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                      style={{ borderBottom: `1px solid ${isDarkMode ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.6)"}` }}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span
                                          className="w-2 h-2 rounded-full flex-shrink-0"
                                          style={{ background: statusColor }}
                                        />
                                        <span
                                          className="text-xs font-semibold truncate"
                                          style={{ color: isDarkMode ? "#e2e8f0" : "#1e293b" }}
                                        >
                                          {a.basinName}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-xs font-bold" style={{ color: statusColor }}>
                                          {a.discharge > 0 ? `${a.discharge.toLocaleString()} m³/s` : a.status.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm font-semibold mt-auto group-hover:gap-3 transition-all duration-200"
                    style={{ color: mod.color }}
                  >
                    <span>{mod.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <footer
          className="mt-12 pt-6"
          style={{ borderTop: `1px solid ${bdr}` }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between text-sm gap-2"
            style={{ color: mt }}
          >
            <p className="font-medium">© 2026 FAO Uganda · Uganda Multi Hazard Observatory System</p>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">All Systems Operational</span>
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        @keyframes introFade {
          0%   { opacity: 1; }
          73%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes cloudLeft {
          0%   { transform: translateX(-110%); opacity: 0; }
          10%  { opacity: 1; }
          40%  { transform: translateX(0);     opacity: 1; }
          73%  { transform: translateX(0);     opacity: 1; }
          100% { transform: translateX(0);     opacity: 0; }
        }
        @keyframes cloudRight {
          0%   { transform: translateX(110%); opacity: 0; }
          10%  { opacity: 1; }
          40%  { transform: translateX(0);    opacity: 1; }
          73%  { transform: translateX(0);    opacity: 1; }
          100% { transform: translateX(0);    opacity: 0; }
        }
        @keyframes cloudTop {
          0%   { transform: translateY(-100px); opacity: 0; }
          18%  { opacity: 1; }
          42%  { transform: translateY(0);      opacity: 1; }
          73%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes boltFlash {
          0%,  28% { opacity: 0; }
          31%, 34%  { opacity: 1; }
          36%       { opacity: 0; }
          44%, 47%  { opacity: 0.85; }
          49%       { opacity: 0; }
          56%, 59%  { opacity: 1; }
          61%       { opacity: 0; }
          100%      { opacity: 0; }
        }
        @keyframes glowPulse {
          0%,  28% { opacity: 0; }
          31%, 34%  { opacity: 1; }
          36%       { opacity: 0.1; }
          44%, 47%  { opacity: 0.75; }
          49%       { opacity: 0; }
          56%, 59%  { opacity: 1; }
          61%       { opacity: 0; }
          100%      { opacity: 0; }
        }
        @keyframes textReveal {
          0%   { opacity: 0; transform: translateX(-50%) translateY(12px); }
          22%  { opacity: 0; transform: translateX(-50%) translateY(12px); }
          42%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          73%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <BulletinDownloadModal
        isOpen={showBulletinModal}
        onClose={() => setShowBulletinModal(false)}
        isDarkMode={isDarkMode}
        drought={drought}
        forecast={forecast}
      />
    </div>
  );
}
