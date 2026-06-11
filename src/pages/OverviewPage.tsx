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
  // FileText,
  // Info,
  // Shield,
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

interface OverviewPageProps {
  onNavigate: (page: PageType) => void;
  isDarkMode?: boolean;
}

const FAO_BLUE = "#318DDE";

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

/* ── Sparkline ─────────────────────────────────────────────────── */
const PATHS = {
  up: "M2,20 C12,17 24,13 34,9  C44,5  54,3  68,2",
  down: "M2,2  C12,5  24,9  34,13 C44,17 54,19 68,21",
  flat: "M2,12 C12,7  18,16 28,11 C38,6  52,15 68,10",
  volatile: "M2,13 C8,4  15,20 23,8  C31,2  41,18 51,7 C59,2 65,15 68,11",
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

/* ── Intro animation overlay ────────────────────────────────────── */
const IntroOverlay = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const bg = isDarkMode ? "#080f1e" : "#b8d4ee";
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
      {/* glow behind bolt */}
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

      {/* left cloud */}
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

      {/* right cloud */}
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

      {/* center cloud — drops from above */}
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

      {/* lightning bolt */}
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

      {/* logos + title text */}
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
        {/* logo row */}
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
        {/* title */}
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

/* ── Page ────────────────────────────────────────────────────────── */
export default function OverviewPage({
  onNavigate,
  isDarkMode = true,
}: OverviewPageProps) {
  const { selectedDistrictId, floodAlerts } = useAppStore((s) => s);
  const { extremeCount, trendingCount, improvingCount, month, year } =
    useAssessmentCounts();

  /* ── Module definitions ─────────────────────────────────────────── */
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
      desc: "24-hour nowcasting & 7-day forecasts with high accuracy predictions.",
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
      color: "#f97316",
      desc: "Combined Drought Index with TDI, PDI, VDI components for risk assessment.",
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
      color: "#06b6d4",
      desc: "Real-time river discharge monitoring and early warning systems.",
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
          label: "Rising Levels",
          value: "--",
          sub: undefined,
          Icon: TrendingUp,
        },
        { label: "Active Alerts", value: "--", Icon: AlertCircle },
      ],
    },
    {
      id: "stations",
      title: "Weather Stations",
      color: "#22c55e",
      desc: "Automatic Weather Station network monitoring across Uganda.",
      Icon: Radio,
      ctaLabel: "Open Station Network",
      stats: [
        { label: "Stations Online", value: "--", Icon: Signal },
        { label: "Data Frequency", value: "15 min", Icon: Timer },
        { label: "Missing Reports", value: "0", Icon: AlertCircle },
        { label: "Last Transmission", value: "--", Icon: Clock },
      ],
    },
  ];

  console.log("MODULES ", MODULES);

  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [alertsHover, setAlertsHover] = useState(false);
  // Critical basins derived directly from basin-status + forecasts (same source as FloodMonitoringPage)
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

  // Keep the drought module title in sync whenever month/year resolve from the API
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
        // Fetch from ALL module APIs in parallel — each one independently so a
        // failure in one doesn't block the others.
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

        // ── Quick stats (header) ─────────────────────────────────
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

        // ── Weather Forecast stats ────────────────────────────────
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

        // ── Drought Monitor stats ─────────────────────────────────
        // droughtAPI.getData() schema varies; fall back to ms if no data
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

        // ── Flood Monitor stats ───────────────────────────────────
        // Mirror FloodMonitoringPage's logic exactly so the overview card
        // always shows the same numbers as the flood monitor itself.

        // 1. People at Risk
        //    FloodMonitoringPage sums affected_population from DISTRICT-level impact rows only:
        //      districtImpacts = activeForecast.impacts.filter(i => i.district_name !== null)
        //      total = districtImpacts.reduce((s,i) => s + i.affected_population, 0)
        //    Summing basin-status.population_at_risk instead inflates the figure because
        //    basin rows are not deduplicated — people in multi-basin districts get counted 3x.
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

        // 2. Highest Discharge: from basin status (most real-time) or forecast impacts
        const allDischarges = bs?.map((b) => b.discharge_rate ?? 0) ?? [];
        const impactDischarges = (latestForecast?.impacts ?? []).map(
          (i) => i.max_discharge ?? 0,
        );
        const maxDischarge =
          allDischarges.length > 0
            ? Math.max(...allDischarges)
            : impactDischarges.length > 0
              ? Math.max(...impactDischarges)
              : null;
        const maxDischargeSrc = bs?.find(
          (b) => b.discharge_rate === maxDischarge,
        );
        const dischargeStr =
          maxDischarge != null
            ? `${(Math.round(maxDischarge * 10) / 10).toLocaleString()} m³/s`
            : "--";

        // 3. Rising Levels: basins at moderate/severe/extreme (same filter as FloodMonitoringPage)
        const isElevatedStatus = (s?: string | null) =>
          s === "moderate" || s === "severe" || s === "extreme" || s === "high" || s === "critical";
        const risingBasins = bs?.filter((b) => isElevatedStatus(b.status)) ?? [];
        const risingStr =
          bs != null
            ? risingBasins.length > 0
              ? `${risingBasins.length} basin${risingBasins.length !== 1 ? "s" : ""}`
              : "None"
            : "--";

        // 4. Active Alerts: build named critical-basin list exactly like FloodMonitoringPage does,
        //    then use its length. If the store already has floodAlerts (set by FloodMonitoringPage),
        //    prefer that — otherwise derive here from the same data.
        //    This ensures the overview count and FloodMonitoringPage count always agree.
        const derivedAlerts: Array<{
          id: string; basinName: string; status: string; discharge: number; population: number;
        }> = [];
        // From forecast impacts (flood_risk_level is authoritative per basin)
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
        // Merge elevated basins from basin-status not yet in the list
        risingBasins.forEach((b) => {
          if (!derivedAlerts.find((n) => n.basinName === b.name))
            derivedAlerts.push({
              id: `flood-${b.name}`,
              basinName: b.name,
              status: b.status,
              discharge: Math.round(b.discharge_rate),
              population: b.population_at_risk ?? 0,
            });
        });

        // The store's floodAlerts are set by FloodMonitoringPage (the authoritative view);
        // if they exist use them, otherwise use what we just derived here.
        const effectiveAlerts = floodAlerts.length > 0 ? floodAlerts : derivedAlerts;
        setLiveFloodAlerts(effectiveAlerts);

        const activeAlerts =
          effectiveAlerts.length > 0
            ? effectiveAlerts.length
            : fd?.summary?.active_alerts ?? fd?.summary?.critical_basins ?? qs?.active_alerts;
        const alertsStr = activeAlerts != null ? String(activeAlerts) : "--";

        const floodStats: StatPatch[] = [
          { value: peopleStr, sub: undefined },
          { value: dischargeStr, sub: maxDischargeSrc?.name ?? undefined },
          { value: risingStr, sub: undefined },
          { value: alertsStr, sub: undefined },
        ];

        // ── Weather Stations stats ────────────────────────────────
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
        const missingReports =
          net?.offline_count ??
          allStations.filter((s: any) => s.status === "offline").length ??
          0;

        const stationStats: StatPatch[] = [
          { value: onlineStr },
          { value: "15 min" },
          { value: String(missingReports) },
          { value: lastTxStr },
        ];

        // ── Merge into modules state ──────────────────────────────
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

  /* theme */
  const bg = isDarkMode ? "#0f172a" : "#f0f5fb";
  const card = isDarkMode ? "#1e293b" : "#ffffff";
  const bdr = isDarkMode ? "rgba(71,85,105,0.45)" : "#e2e8f0";
  const hd = isDarkMode ? "#f1f5f9" : "#0f172a";
  const bd = isDarkMode ? "#cbd5e1" : "#475569";
  const mt = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: bg }}
    >
      {(showIntro || isLoading) && <IntroOverlay isDarkMode={isDarkMode} />}
      {/* Background Climate Illustration Watermark */}
      <img
        src="/climate_illustration.jpg"
        alt="Climate Illustration"
        className="fixed bottom-[-5%] right-[-5%] w-[600px] h-[600px] pointer-events-none z-0 object-contain transition-opacity duration-1000"
        style={{
          opacity: 0.15,
          mixBlendMode: isDarkMode ? "screen" : "multiply",
          filter: isDarkMode ? "invert(1) hue-rotate(180deg)" : "none",
        }}
      />

      <div className="relative z-10 px-4 md:px-6 xl:px-10 2xl:px-16 py-6 space-y-6">
        {apiError && (
          <div
            className="text-xs px-3 py-2 rounded-lg border-l-4 border-yellow-500 bg-yellow-500/10"
            style={{ color: isDarkMode ? "#fcd34d" : "#92400e" }}
          >
            {apiError}
          </div>
        )}

        {/* ── HEADER ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black" style={{ color: hd }}>
                Dashboard Overview
              </h1>
            </div>
            <p className="text-xs mt-0.5" style={{ color: mt }}>
              Uganda Multi Hazard Observatory System
            </p>
            {selectedDistrictId?.name && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3 h-3" style={{ color: FAO_BLUE }} />
                <span className="text-xs font-medium" style={{ color: bd }}>
                  {selectedDistrictId?.name} , {selectedDistrictId?.region}{" "}
                  Region
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: `${FAO_BLUE}18`, color: FAO_BLUE }}
                >
                  Live
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            {quickStats.lastUpdated && (
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: mt }}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Updated {quickStats.lastUpdated}</span>
                <span className="flex items-center gap-1 text-green-500 font-semibold ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  Live
                </span>
              </div>
            )}
            <button
              onClick={() => setShowBulletinModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: FAO_BLUE, color: "#ffffff" }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Weekly Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* ── WEATHER STATS ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Temperature",
              Icon: Thermometer,
              color: "#f97316",
              val: temp,
              Δ: tΔ,
              unit: "°C",
              valStr: `${temp}°C`,
              spark: (tΔ >= 0 ? "up" : "down") as keyof typeof PATHS,
              min: 15,
              max: 40,
              thresholds: [
                { value: 20, color: "#3b82f6", label: "Cool" },
                { value: 28, color: "#22c55e", label: "Mild" },
                { value: 35, color: "#f97316", label: "Warm" },
                { value: 40, color: "#ef4444", label: "Hot" },
              ],
            },
            {
              label: "Rainfall",
              Icon: CloudRain,
              color: "#0284c7",
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
              color: FAO_BLUE,
              val: humid,
              Δ: hΔ,
              unit: "%",
              valStr: `${humid}%`,
              spark: (hΔ >= 0 ? "up" : "down") as keyof typeof PATHS,
              min: 0,
              max: 100,
              thresholds: [
                { value: 30, color: "#dc2626", label: "Dry" },
                { value: 50, color: "#fbbf24", label: "Low" },
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
                { value: 40, color: "#f97316", label: "Windy" },
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
                className="rounded-xl p-4 border"
                style={{ background: card, borderColor: bdr }}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${m.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: bd }}
                    >
                      {m.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className="text-[9px] font-medium mb-0.5"
                      style={{ color: mt }}
                    >
                      7-Day Trend
                    </span>
                    <Sparkline type={m.spark} color={m.color} />
                  </div>
                </div>
                <p
                  className="text-2xl font-black leading-none mb-1"
                  style={{ color: hd }}
                >
                  {m.valStr}
                </p>
                <div
                  className="flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: dCol }}
                >
                  <DeltaIcon className="w-3 h-3" />
                  <span>
                    {up ? "+" : ""}
                    {m.Δ}
                    {m.unit} (24h)
                  </span>
                </div>
                <ThresholdScale
                  value={m.val}
                  min={m.min}
                  max={m.max}
                  thresholds={m.thresholds}
                  isDarkMode={isDarkMode}
                />
              </div>
            );
          })}
        </div>

        {/* ── MONITORING SYSTEMS HEADER ─────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: FAO_BLUE }}
            >
              Monitoring Systems
            </p>
            <h2 className="text-lg font-black mt-0.5" style={{ color: hd }}>
              Select a module to explore
            </h2>
          </div>
          <div
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: mt }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Live Data
          </div>
        </div>

        {/* ── MODULE CARDS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const ModIcon = mod.Icon;
            const isFlood = mod.id === "flood";
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id as PageType)}
                className="group rounded-2xl border text-left focus:outline-none p-5 flex flex-col"
                style={{
                  background: card,
                  borderColor: bdr,
                  transition:
                    "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 8px 28px ${mod.color}22`;
                  (e.currentTarget as HTMLElement).style.borderColor =
                    `${mod.color}50`;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = bdr;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Header: module icon + title + description */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${mod.color}15` }}
                  >
                    <ModIcon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-bold leading-tight"
                      style={{ color: hd }}
                    >
                      {mod.id === "drought" ? (
                        <>
                          {mod.title.replace(/\s+\S+,\S+$/, "")}{" "}
                          <span style={{ color: "#f97316" }}>
                            {mod.title.match(/\S+,\S+$/)?.[0]}
                          </span>
                        </>
                      ) : (
                        mod.title
                      )}
                    </h3>
                    <p
                      className="text-[11px] mt-1 leading-relaxed"
                      style={{ color: mt }}
                    >
                      {mod.desc}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
                    marginBottom: "16px",
                  }}
                />

                {/* Stats: 4 items */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {mod.stats.map((s) => {
                    const StatIcon = s.Icon;
                    const isAlertsCell = isFlood && s.label === "Active Alerts";
                    return (
                      <div
                        key={s.label}
                        className="flex flex-col gap-1 relative"
                        onMouseEnter={isAlertsCell ? (e) => { e.stopPropagation(); setAlertsHover(true); } : undefined}
                        onMouseLeave={isAlertsCell ? (e) => { e.stopPropagation(); setAlertsHover(false); } : undefined}
                      >
                        {StatIcon && (
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center mb-0.5"
                            style={{ background: `${mod.color}12` }}
                          >
                            <StatIcon
                              className="w-3.5 h-3.5"
                              style={{ color: mod.color }}
                            />
                          </div>
                        )}
                        <span
                          className="text-[9px] font-medium leading-tight"
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
                            className="text-[9px] leading-tight truncate"
                            style={{ color: mod.color, opacity: 0.85 }}
                          >
                            {s.sub}
                          </span>
                        )}

                        {/* Alerts mini-list popover — only on "Active Alerts" cell */}
                        {isAlertsCell && alertsHover && liveFloodAlerts.length > 0 && (
                          <div
                            className="absolute bottom-full mb-2 left-1/2 z-50 w-52 rounded-xl border shadow-xl overflow-hidden"
                            style={{
                              transform: "translateX(-60%)",
                              background: isDarkMode ? "#1e293b" : "#ffffff",
                              borderColor: isDarkMode ? "rgba(71,85,105,0.6)" : "#e2e8f0",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className="px-3 py-2 border-b flex items-center justify-between"
                              style={{ borderColor: isDarkMode ? "rgba(71,85,105,0.4)" : "#f1f5f9" }}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#ef4444" }}>
                                Active Alerts
                              </span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#ef44441a", color: "#ef4444" }}>
                                {liveFloodAlerts.length}
                              </span>
                            </div>
                            <div className="py-1 max-h-40 overflow-y-auto">
                              {liveFloodAlerts.map((a) => {
                                const statusColor =
                                  a.status === "extreme" || a.status === "critical" ? "#ef4444"
                                    : a.status === "severe" || a.status === "high" ? "#f97316"
                                    : "#eab308";
                                return (
                                  <div
                                    key={a.id}
                                    className="px-3 py-1.5 flex items-center justify-between gap-2"
                                    style={{ borderBottom: `1px solid ${isDarkMode ? "rgba(71,85,105,0.2)" : "#f8fafc"}` }}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ background: statusColor }}
                                      />
                                      <span
                                        className="text-[10px] font-semibold truncate"
                                        style={{ color: isDarkMode ? "#e2e8f0" : "#1e293b" }}
                                      >
                                        {a.basinName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <span className="text-[9px] font-bold" style={{ color: statusColor }}>
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

                {/* Footer CTA */}
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold mt-auto group-hover:gap-2.5 transition-all duration-200"
                  style={{ color: mod.color }}
                >
                  <span>{mod.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <footer
          className="mt-12 pt-6"
          style={{ borderTop: `1px solid ${bdr}` }}
        >
          <div
            className="flex flex-col sm:flex-row items-center justify-between text-xs gap-1"
            style={{ color: mt }}
          >
            <p>© 2026 FAO Uganda · Uganda Multi Hazard Observatory System</p>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
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
      />
    </div>
  );
}