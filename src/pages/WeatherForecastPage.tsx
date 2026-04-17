import { useState, useEffect, useRef } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Navigation,
  Filter,
  X,
  Map as MapIcon,
} from "lucide-react";
import UgandaBoundaryMap from "../components/map/UgandaBoundaryMap";

interface WeatherForecastPageProps {
  isDarkMode?: boolean;
}

const FAO_BLUE = "#318DDE";

// Stat cards with thresholds for scale display (cloned from Overview)
// const statCards = [
//   {
//     label: "Temperature",
//     value: "26.5°C",
//     change: "+2.3°C",
//     trend: "up",
//     icon: Thermometer,
//     color: FAO_BLUE,
//     min: 15,
//     max: 40,
//     thresholds: [
//       { value: 20, color: "#3b82f6", label: "Cool" },
//       { value: 28, color: "#22c55e", label: "Normal" },
//       { value: 35, color: "#f97316", label: "Warm" },
//       { value: 40, color: "#dc2626", label: "Hot" },
//     ],
//   },
//   {
//     label: "Humidity",
//     value: "68%",
//     change: "-5%",
//     trend: "down",
//     icon: Droplets,
//     color: FAO_BLUE,
//     min: 0,
//     max: 100,
//     thresholds: [
//       { value: 30, color: "#dc2626", label: "Dry" },
//       { value: 50, color: "#fbbf24", label: "Low" },
//       { value: 70, color: "#22c55e", label: "Normal" },
//       { value: 85, color: "#dc2626", label: "High" },
//     ],
//   },
//   {
//     label: "Wind Speed",
//     value: "12 km/h",
//     change: "+3 km/h",
//     trend: "up",
//     icon: Wind,
//     color: FAO_BLUE,
//     min: 0,
//     max: 60,
//     thresholds: [
//       { value: 10, color: "#22c55e", label: "Calm" },
//       { value: 25, color: "#3b82f6", label: "Breezy" },
//       { value: 40, color: "#f97316", label: "Windy" },
//       { value: 60, color: "#dc2626", label: "Strong" },
//     ],
//   },
//   {
//     label: "Rainfall (24h)",
//     value: "15.2 mm",
//     change: "+8 mm",
//     trend: "up",
//     icon: CloudRain,
//     color: FAO_BLUE,
//     min: 0,
//     max: 100,
//     thresholds: [
//       { value: 5, color: "#22c55e", label: "Dry" },
//       { value: 20, color: "#3b82f6", label: "Light" },
//       { value: 50, color: "#f97316", label: "Moderate" },
//       { value: 100, color: "#dc2626", label: "Heavy" },
//     ],
//   },
// ];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-3 h-3" />;
    case "down":
      return <TrendingDown className="w-3 h-3" />;
    default:
      return <Minus className="w-3 h-3" />;
  }
};

const getTrendColor = (trend: string, isDarkMode: boolean) => {
  if (trend === "up") return "text-green-500";
  if (trend === "down") return "text-red-500";
  return isDarkMode ? "text-slate-400" : "text-slate-500";
};

const FilterContent = ({
  selectedRegion,
  setSelectedRegion,
  selectedParameter,
  setSelectedParameter,
  isDarkMode,
  textMuted,
  textSecondary,
  borderColor,
}: {
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  selectedParameter: string;
  setSelectedParameter: (val: string) => void;
  isDarkMode: boolean;
  textMuted: string;
  textSecondary: string;
  borderColor: string;
}) => (
  <div className="space-y-3">
    <div>
      <label className={`text-xs ${textMuted} mb-1 block`}>Region</label>
      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
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
        className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
      >
        <option value="temperature">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="wind">Wind Speed</option>
        <option value="rainfall">Rainfall</option>
      </select>
    </div>
    <div>
      <label className={`text-xs ${textMuted} mb-1 block`}>Date Range</label>
      <input
        type="date"
        className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
      />
    </div>
    <div className={`pt-3 border-t ${borderColor}`}>
      <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>
        Quick Stats
      </h4>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className={textMuted}>Avg Temp</span>
          <span className="font-medium" style={{ color: FAO_BLUE }}>
            24.5°C
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className={textMuted}>Max Temp</span>
          <span className="text-red-500 font-medium">31.2°C</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className={textMuted}>Min Temp</span>
          <span className="text-blue-500 font-medium">17.8°C</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className={textMuted}>Total Rain</span>
          <span className="text-cyan-500 font-medium">125mm</span>
        </div>
      </div>
    </div>
  </div>
);

// Threshold Scale Component
const ThresholdScale = ({
  value,
  min,
  max,
  thresholds,
  isDarkMode,
}: {
  value: number;
  min: number;
  max: number;
  thresholds: { value: number; color: string; label: string }[];
  isDarkMode: boolean;
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );

  return (
    <div className="mt-2">
      <div
        className={`relative h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
      >
        <div className="absolute inset-0 flex">
          {thresholds.map((t, i) => {
            const prevValue = i === 0 ? min : thresholds[i - 1].value;
            const width =
              ((Math.min(t.value, max) - prevValue) / (max - min)) * 100;
            return (
              <div
                key={i}
                className="h-full"
                style={{
                  width: `${width}%`,
                  backgroundColor: t.color,
                  opacity: 0.7,
                }}
              />
            );
          })}
        </div>
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 shadow-sm transition-all duration-500 ${isDarkMode ? "bg-white" : "bg-black"}`}
          style={{
            left: `${percentage}%`,
            borderColor: isDarkMode ? "#334155" : "white",
            transform: `translate(-50%, -50%)`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        {thresholds.map((t, i) => (
          <span
            key={i}
            className={`text-[9px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const hourlyForecast = [
  { time: "0:00", temp: 23, rain: 2, icon: "rain" },
  { time: "1:00", temp: 25, rain: 5, icon: "sun" },
  { time: "2:00", temp: 26, rain: 9, icon: "sun" },
  { time: "3:00", temp: 28, rain: 11, icon: "cloud" },
  { time: "4:00", temp: 28, rain: 14, icon: "rain" },
  { time: "5:00", temp: 29, rain: 15, icon: "sun" },
  { time: "6:00", temp: 27, rain: 19, icon: "cloud" },
  { time: "7:00", temp: 26, rain: 17, icon: "sun" },
  { time: "8:00", temp: 25, rain: 15, icon: "rain" },
  { time: "9:00", temp: 23, rain: 13, icon: "cloud" },
  { time: "10:00", temp: 23, rain: 10, icon: "sun" },
  { time: "11:00", temp: 20, rain: 10, icon: "sun" },
  { time: "12:00", temp: 19, rain: 3, icon: "rain" },
  { time: "13:00", temp: 19, rain: 1, icon: "sun" },
  { time: "14:00", temp: 19, rain: 0, icon: "sun" },
  { time: "15:00", temp: 17, rain: 0, icon: "cloud" },
];

const dailyForecast = [
  {
    day: "Sun",
    date: "Mar 22",
    high: 27,
    low: 18,
    rain: 7,
    icon: "rain",
    confidence: 93,
  },
  {
    day: "Mon",
    date: "Mar 23",
    high: 28,
    low: 19,
    rain: 10,
    icon: "sun",
    confidence: 89,
  },
  {
    day: "Tue",
    date: "Mar 24",
    high: 31,
    low: 20,
    rain: 16,
    icon: "sun",
    confidence: 87,
  },
  {
    day: "Wed",
    date: "Mar 25",
    high: 32,
    low: 22,
    rain: 21,
    icon: "cloud",
    confidence: 92,
  },
  {
    day: "Thu",
    date: "Mar 26",
    high: 31,
    low: 22,
    rain: 23,
    icon: "rain",
    confidence: 95,
  },
  {
    day: "Fri",
    date: "Mar 27",
    high: 29,
    low: 21,
    rain: 18,
    icon: "rain",
    confidence: 91,
  },
  {
    day: "Sat",
    date: "Mar 28",
    high: 28,
    low: 20,
    rain: 12,
    icon: "cloud",
    confidence: 88,
  },
];

const getWeatherIcon = (type: string, className = "w-8 h-8") => {
  switch (type) {
    case "sun":
      return <Sun className={`${className} text-yellow-400`} />;
    case "rain":
      return <CloudRain className={`${className} text-blue-400`} />;
    case "cloud":
      return <Cloud className={`${className} text-slate-400`} />;
    case "storm":
      return <CloudLightning className={`${className} text-purple-400`} />;
    default:
      return <Sun className={`${className} text-yellow-400`} />;
  }
};

// OpenStreetMap Component with Legend
const UgandaMap = ({
  isDarkMode,
  className = "",
}: {
  isDarkMode: boolean;
  className?: string;
}) => {
  return (
    <UgandaBoundaryMap
      isDarkMode={isDarkMode}
      className={`rounded-lg md:rounded-xl ${className}`}
      badgeText="Uganda"
      legendTitle="Weather"
      legendItems={[
        { label: "Sunny", color: "#fbbf24" },
        { label: "Cloudy", color: "#94a3b8" },
        { label: "Rainy", color: "#3b82f6" },
        { label: "Storm", color: "#a855f7" },
      ]}
    />
  );
};

export default function WeatherForecastPage({
  isDarkMode = true,
}: WeatherForecastPageProps) {
  const [activeTab, setActiveTab] = useState<"nowcast" | "forecast">("nowcast");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sliderValue, setSliderValue] = useState((2026 - 2001) * 12 + 2); // Mar 2026
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getMonthYear = (months: number) => {
    const year = 2001 + Math.floor(months / 12);
    const month = months % 12;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[month]} ${year}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const cardBg = isDarkMode ? "bg-slate-800/85" : "bg-white/95";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const textSecondary = isDarkMode ? "text-slate-300" : "text-slate-600";
  const borderColor = isDarkMode ? "border-slate-700/30" : "border-slate-200";
  const headerText = isDarkMode ? "text-white" : "text-slate-900";

  // Fetch weather data from API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://multihazard.rosewillbome.space/api/v1/weather/dashboard`,
        ); // <-- Replace with your actual API URL
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: any = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setWeatherError("Failed to load weather data.");
      }
    };

    fetchWeatherData();
  }, []);

  // Derive stat cards from API data

  const statCards = [
    {
      label: "Temperature",
      value: `${weatherData?.temperature ?? 0}°C`,
      change: `${(weatherData?.temperature_delta ?? 0) > 0 ? "+" : ""}${weatherData?.temperature_delta ?? 0}°C`,
      trend:
        (weatherData?.temperature_delta ?? 0) > 0
          ? "up"
          : (weatherData?.temperature_delta ?? 0) < 0
            ? "down"
            : "neutral",
      icon: Thermometer,
      color: FAO_BLUE,
      min: 15,
      max: 40,
      thresholds: [
        { value: 20, color: "#3b82f6", label: "Cool" },
        { value: 28, color: "#22c55e", label: "Normal" },
        { value: 35, color: "#f97316", label: "Warm" },
        { value: 40, color: "#dc2626", label: "Hot" },
      ],
    },
    {
      label: "Humidity",
      value: `${weatherData?.humidity ?? 0}%`,
      change: `${(weatherData?.humidity_delta ?? 0) > 0 ? "+" : ""}${weatherData?.humidity_delta ?? 0}%`,
      trend:
        (weatherData?.humidity_delta ?? 0) > 0
          ? "up"
          : (weatherData?.humidity_delta ?? 0) < 0
            ? "down"
            : "neutral",
      icon: Droplets,
      color: FAO_BLUE,
      min: 0,
      max: 100,
      thresholds: [
        { value: 30, color: "#dc2626", label: "Dry" },
        { value: 50, color: "#fbbf24", label: "Low" },
        { value: 70, color: "#22c55e", label: "Normal" },
        { value: 85, color: "#dc2626", label: "High" },
      ],
    },
    {
      label: "Wind Speed",
      value: `${weatherData?.wind_speed ?? 0} km/h`,
      change: `${(weatherData?.wind_speed_delta ?? 0) > 0 ? "+" : ""}${weatherData?.wind_speed_delta ?? 0} km/h`,
      trend:
        (weatherData?.wind_speed_delta ?? 0) > 0
          ? "up"
          : (weatherData?.wind_speed_delta ?? 0) < 0
            ? "down"
            : "neutral",
      icon: Wind,
      color: FAO_BLUE,
      min: 0,
      max: 60,
      thresholds: [
        { value: 10, color: "#22c55e", label: "Calm" },
        { value: 25, color: "#3b82f6", label: "Breezy" },
        { value: 40, color: "#f97316", label: "Windy" },
        { value: 60, color: "#dc2626", label: "Strong" },
      ],
    },
    {
      label: "Rainfall (24h)",
      value: `${weatherData?.rainfall_24h ?? 0} mm`,
      change: `${(weatherData?.rainfall_24h_delta ?? 0) > 0 ? "+" : ""}${weatherData?.rainfall_24h_delta ?? 0} mm`,
      trend:
        (weatherData?.rainfall_24h_delta ?? 0) > 0
          ? "up"
          : (weatherData?.rainfall_24h_delta ?? 0) < 0
            ? "down"
            : "neutral",
      icon: CloudRain,
      color: FAO_BLUE,
      min: 0,
      max: 100,
      thresholds: [
        { value: 5, color: "#22c55e", label: "Dry" },
        { value: 20, color: "#3b82f6", label: "Light" },
        { value: 50, color: "#f97316", label: "Moderate" },
        { value: 100, color: "#dc2626", label: "Heavy" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: `${FAO_BLUE}30`, borderTopColor: FAO_BLUE }}
          ></div>
          <p className={textMuted}>Loading Weather Forecast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Animated Background */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Header Banner - No alert buttons */}
        <div
          className="relative overflow-hidden rounded-lg md:rounded-xl p-3 md:p-4 mb-3 animate-fade-in-up"
          style={{
            background: `linear-gradient(135deg, ${FAO_BLUE}e6 0%, ${FAO_BLUE}99 100%)`,
          }}
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">
                  Weather Forecast
                </h1>
                <p className="text-slate-200 text-xs md:text-sm">
                  24-hour nowcasting & 7-day forecasts
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Clock className="w-3 h-3" />
                    Updated 5 min ago
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Navigation className="w-3 h-3" />
                    87% Accuracy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors">
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const numericValue = parseFloat(card.value.replace(/[^0-9.]/g, ""));
            return (
              <div
                key={index}
                className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-sm animate-fade-in-up transition-all hover:shadow-md`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className={`text-[10px] md:text-xs ${textMuted} mb-0.5`}>
                      {card.label}
                    </p>
                    <p
                      className={`text-base md:text-lg font-bold ${headerText}`}
                    >
                      {card.value}
                    </p>
                  </div>
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${FAO_BLUE}20` }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                      style={{ color: FAO_BLUE }}
                    />
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-[10px] ${getTrendColor(card.trend, isDarkMode)}`}
                >
                  {getTrendIcon(card.trend)}
                  <span>{card.change}</span>
                </div>
                <ThresholdScale
                  value={numericValue}
                  min={card.min}
                  max={card.max}
                  thresholds={card.thresholds}
                  isDarkMode={isDarkMode}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Filter next to map */}
          <div className="lg:col-span-3 flex flex-col">
            <div
              className="flex-1 rounded-xl p-3 shadow-sm flex flex-col"
              style={{
                background: isDarkMode
                  ? `linear-gradient(180deg, ${FAO_BLUE}30 0%, ${FAO_BLUE}15 100%)`
                  : `linear-gradient(180deg, ${FAO_BLUE}15 0%, ${FAO_BLUE}05 100%)`,
                border: `1px solid ${isDarkMode ? `${FAO_BLUE}30` : `${FAO_BLUE}15`}`,
              }}
            >
              <div
                className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-800/80" : "bg-white/90"} border ${isDarkMode ? "border-slate-700/30" : "border-slate-200"}`}
              >
                <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>
                  Filters
                </h3>
                <FilterContent
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  selectedParameter={selectedParameter}
                  setSelectedParameter={setSelectedParameter}
                  isDarkMode={isDarkMode}
                  textMuted={textMuted}
                  textSecondary={textSecondary}
                  borderColor={borderColor}
                />
              </div>

              {/* Illustration at bottom */}
              <div className="mt-auto pt-3">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: "url(/weather-illustration.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "140px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-3">
            {/* Map and Charts Row */}
            <div
              className="grid grid-cols-12 gap-3"
              style={{ minHeight: "520px" }}
            >
              {/* Map - 7 columns */}
              <div className="col-span-7 flex">
                <div
                  className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col`}
                >
                  <div
                    className={`flex items-center justify-between p-2 border-b ${borderColor}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapIcon
                        className="w-4 h-4"
                        style={{ color: FAO_BLUE }}
                      />
                      <h3 className={`text-sm font-semibold ${headerText}`}>
                        Weather Map
                      </h3>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium`}
                      style={{
                        backgroundColor: isDarkMode
                          ? `${FAO_BLUE}30`
                          : `${FAO_BLUE}20`,
                        color: FAO_BLUE,
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <div
                    className="relative flex-1 flex flex-col"
                    style={{ minHeight: "350px" }}
                  >
                    <div className="flex-1 relative">
                      <UgandaMap
                        isDarkMode={isDarkMode}
                        className="absolute inset-0 w-full h-full rounded-none"
                      />
                    </div>
                    {/* Time Slider */}
                    <div
                      className={`px-4 py-3 border-t ${borderColor} flex items-center gap-4 ${isDarkMode ? "bg-slate-800/80" : "bg-slate-50"}`}
                    >
                      <span className={`text-xs font-medium ${textMuted}`}>
                        2001
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={(2026 - 2001 + 1) * 12 - 1}
                        value={sliderValue}
                        onChange={(e) =>
                          setSliderValue(parseInt(e.target.value))
                        }
                        className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{
                          backgroundColor: isDarkMode ? "#334155" : "#cbd5e1",
                          accentColor: FAO_BLUE,
                        }}
                      />
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
                        style={{
                          backgroundColor: `${FAO_BLUE}20`,
                          color: FAO_BLUE,
                        }}
                      >
                        {getMonthYear(sliderValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nowcast/Forecast Tabs and Temperature Trend - 5 columns */}
              <div className="col-span-5 flex flex-col gap-3">
                {/* Tabbed Forecast Container - Matching Overview Style with White Dots */}
                <div
                  className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg shadow-sm overflow-hidden`}
                >
                  {/* Tabs */}
                  <div className={`flex border-b ${borderColor}`}>
                    <button
                      onClick={() => setActiveTab("nowcast")}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
                        activeTab === "nowcast"
                          ? "text-white"
                          : `${isDarkMode ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600"}`
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === "nowcast" ? FAO_BLUE : undefined,
                      }}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${activeTab === "nowcast" ? "bg-white" : "bg-slate-400"}`}
                      />
                      <Clock className="w-3.5 h-3.5" />
                      24-Hour Nowcast
                    </button>
                    <button
                      onClick={() => setActiveTab("forecast")}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
                        activeTab === "forecast"
                          ? "text-white"
                          : `${isDarkMode ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600"}`
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === "forecast" ? FAO_BLUE : undefined,
                      }}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${activeTab === "forecast" ? "bg-white" : "bg-slate-400"}`}
                      />
                      <Calendar className="w-3.5 h-3.5" />
                      7-Day Forecast
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-3">
                    {activeTab === "nowcast" ? (
                      <div>
                        <h4
                          className={`text-xs font-semibold mb-2 ${headerText}`}
                        >
                          Hourly Forecast
                        </h4>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {hourlyForecast.slice(0, 8).map((hour, idx) => (
                            <div
                              key={idx}
                              className={`flex-shrink-0 w-14 p-2 rounded-lg text-center transition-all hover:scale-105 ${idx === 0 ? "border" : isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
                              style={{
                                borderColor: idx === 0 ? FAO_BLUE : undefined,
                                backgroundColor:
                                  idx === 0 ? `${FAO_BLUE}20` : undefined,
                              }}
                            >
                              <p className={`text-[10px] ${textMuted} mb-1`}>
                                {hour.time}
                              </p>
                              {getWeatherIcon(hour.icon, "w-5 h-5 mx-auto")}
                              <p
                                className={`text-sm font-bold mt-1 ${headerText}`}
                              >
                                {hour.temp}°
                              </p>
                              <p
                                className="text-[10px]"
                                style={{ color: FAO_BLUE }}
                              >
                                {hour.rain}mm
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4
                          className={`text-xs font-semibold mb-2 ${headerText}`}
                        >
                          7-Day Forecast
                        </h4>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                          {dailyForecast.map((day, idx) => (
                            <div
                              key={idx}
                              className={`flex-shrink-0 w-20 p-2 rounded-lg text-center transition-all hover:scale-105 ${isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
                            >
                              <p className={`text-[10px] ${textMuted}`}>
                                {day.day}
                              </p>
                              {getWeatherIcon(day.icon, "w-5 h-5 mx-auto my-1")}
                              <p className={`text-xs font-bold ${headerText}`}>
                                {day.high}°
                              </p>
                              <p className={`text-[9px] ${textMuted}`}>
                                {day.low}°
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Temperature Trend - Increased Height */}
                <div
                  className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm flex-1 flex flex-col`}
                >
                  <h3
                    className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
                  >
                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: FAO_BLUE }}
                    />
                    Temperature Trend
                  </h3>
                  <div
                    className="flex-1 relative"
                    style={{ minHeight: "200px" }}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-5 w-5 flex flex-col justify-between text-[10px] ${textMuted}`}
                    >
                      <span>35°</span>
                      <span>30°</span>
                      <span>25°</span>
                      <span>20°</span>
                      <span>15°</span>
                    </div>
                    <div className="ml-5 h-full relative">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`absolute left-0 right-0 h-px ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200"}`}
                          style={{ top: `${i * 25}%` }}
                        />
                      ))}
                      <svg
                        ref={svgRef}
                        key={activeTab}
                        className="w-full h-[85%]"
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="tempGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor={FAO_BLUE}
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor={FAO_BLUE}
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M0,${150 - ((hourlyForecast[0].temp - 15) / 20) * 150} ${hourlyForecast.map((h, i) => `L${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(" ")} L500,150 L0,150 Z`}
                          fill="url(#tempGradient)"
                        />
                        <polyline
                          fill="none"
                          stroke={FAO_BLUE}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={hourlyForecast
                            .map(
                              (h, i) =>
                                `${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`,
                            )
                            .join(" ")}
                        />
                        {hourlyForecast.map((h, i) => (
                          <circle
                            key={i}
                            cx={(i / (hourlyForecast.length - 1)) * 500}
                            cy={150 - ((h.temp - 15) / 20) * 150}
                            r="3"
                            fill={FAO_BLUE}
                          />
                        ))}
                      </svg>
                      <div
                        className={`flex justify-between text-[10px] ${textMuted} mt-1`}
                      >
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
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-3">
          {/* Tabbed Container - Mobile (above map) */}
          <div
            className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg shadow-sm overflow-hidden`}
          >
            <div className={`flex border-b ${borderColor}`}>
              <button
                onClick={() => setActiveTab("nowcast")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
                  activeTab === "nowcast"
                    ? "text-white"
                    : `${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-100 text-slate-600"}`
                }`}
                style={{
                  backgroundColor:
                    activeTab === "nowcast" ? FAO_BLUE : undefined,
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${activeTab === "nowcast" ? "bg-white" : "bg-slate-400"}`}
                />
                <Clock className="w-3.5 h-3.5" />
                Nowcast
              </button>
              <button
                onClick={() => setActiveTab("forecast")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
                  activeTab === "forecast"
                    ? "text-white"
                    : `${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-100 text-slate-600"}`
                }`}
                style={{
                  backgroundColor:
                    activeTab === "forecast" ? FAO_BLUE : undefined,
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${activeTab === "forecast" ? "bg-white" : "bg-slate-400"}`}
                />
                <Calendar className="w-3.5 h-3.5" />
                Forecast
              </button>
            </div>

            <div className="p-3">
              {activeTab === "nowcast" ? (
                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
                  >
                    <Clock className="w-4 h-4" style={{ color: FAO_BLUE }} />
                    Hourly Forecast
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {hourlyForecast.map((hour, idx) => (
                      <div
                        key={idx}
                        className={`flex-shrink-0 w-14 p-2 rounded-lg text-center transition-all hover:scale-105 ${idx === 0 ? "border" : isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
                        style={{
                          borderColor: idx === 0 ? FAO_BLUE : undefined,
                          backgroundColor:
                            idx === 0 ? `${FAO_BLUE}20` : undefined,
                        }}
                      >
                        <p className={`text-[10px] ${textMuted} mb-1`}>
                          {hour.time}
                        </p>
                        {getWeatherIcon(hour.icon, "w-5 h-5 mx-auto")}
                        <p className={`text-sm font-bold mt-1 ${headerText}`}>
                          {hour.temp}°
                        </p>
                        <p className="text-[10px]" style={{ color: FAO_BLUE }}>
                          {hour.rain}mm
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
                  >
                    <Calendar className="w-4 h-4" style={{ color: FAO_BLUE }} />
                    7-Day Forecast
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {dailyForecast.map((day, idx) => (
                      <div
                        key={idx}
                        className={`flex-shrink-0 w-24 rounded-lg p-2 text-center transition-all hover:scale-105 ${isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
                      >
                        <p className={`text-xs ${textMuted}`}>{day.day}</p>
                        <p className="text-[10px] text-slate-500 mb-1">
                          {day.date}
                        </p>
                        {getWeatherIcon(day.icon, "w-5 h-5 mx-auto")}
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className={`text-sm font-bold ${headerText}`}>
                            {day.high}°
                          </span>
                          <span className={`text-xs ${textMuted}`}>
                            {day.low}°
                          </span>
                        </div>
                        <div
                          className="flex items-center justify-center gap-1 mt-0.5 text-[10px]"
                          style={{ color: FAO_BLUE }}
                        >
                          <CloudRain className="w-2.5 h-2.5" />
                          {day.rain}mm
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Section with Filter Popup */}
          <div className="relative">
            <div
              className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl overflow-hidden shadow-sm`}
            >
              <div
                className={`flex items-center justify-between p-2 border-b ${borderColor}`}
              >
                <div className="flex items-center gap-1.5">
                  <MapIcon className="w-4 h-4" style={{ color: FAO_BLUE }} />
                  <h3 className={`text-sm font-semibold ${headerText}`}>
                    Weather Map
                  </h3>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium`}
                  style={{
                    backgroundColor: isDarkMode
                      ? `${FAO_BLUE}30`
                      : `${FAO_BLUE}20`,
                    color: FAO_BLUE,
                  }}
                >
                  Live
                </span>
              </div>
              <div className="relative aspect-[16/10] flex flex-col">
                <div className="flex-1 relative">
                  <UgandaMap
                    isDarkMode={isDarkMode}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                {/* Filter button on map */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center shadow-md z-[1001] text-white"
                  style={{ backgroundColor: FAO_BLUE }}
                >
                  <Filter className="w-4 h-4" />
                </button>

                {/* Time Slider */}
                <div
                  className={`px-2 py-2 border-t ${borderColor} flex items-center gap-2 ${isDarkMode ? "bg-slate-800/80" : "bg-slate-50"} z-[1001]`}
                >
                  <span className={`text-[10px] font-medium ${textMuted}`}>
                    2001
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={(2026 - 2001 + 1) * 12 - 1}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundColor: isDarkMode ? "#334155" : "#cbd5e1",
                      accentColor: FAO_BLUE,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{
                      backgroundColor: `${FAO_BLUE}20`,
                      color: FAO_BLUE,
                    }}
                  >
                    {getMonthYear(sliderValue)}
                  </span>
                </div>
              </div>
            </div>
            {/* Filter Popup */}
            {showMobileFilters && (
              <>
                <div
                  className="fixed inset-0 z-[1002]"
                  onClick={() => setShowMobileFilters(false)}
                />
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-[1003] w-64 rounded-xl shadow-lg border p-3 max-h-[70vh] overflow-y-auto ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-xs font-semibold ${headerText}`}>
                      Filters
                    </h4>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className={`p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <FilterContent
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedParameter={selectedParameter}
                    setSelectedParameter={setSelectedParameter}
                    isDarkMode={isDarkMode}
                    textMuted={textMuted}
                    textSecondary={textSecondary}
                    borderColor={borderColor}
                  />
                </div>
              </>
            )}
          </div>

          {/* Temperature Trend */}
          <div
            className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}
          >
            <h3
              className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
            >
              <TrendingUp className="w-4 h-4" style={{ color: FAO_BLUE }} />
              Temperature Trend
            </h3>
            <div className="h-36 relative">
              <div
                className={`absolute left-0 top-0 bottom-5 w-5 flex flex-col justify-between text-[10px] ${textMuted}`}
              >
                <span>35°</span>
                <span>30°</span>
                <span>25°</span>
                <span>20°</span>
                <span>15°</span>
              </div>
              <div className="ml-5 h-full relative">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`absolute left-0 right-0 h-px ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200"}`}
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
                <svg
                  ref={svgRef}
                  key={activeTab}
                  className="w-full h-[85%]"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="tempGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={FAO_BLUE}
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor={FAO_BLUE}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,${150 - ((hourlyForecast[0].temp - 15) / 20) * 150} ${hourlyForecast.map((h, i) => `L${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(" ")} L500,150 L0,150 Z`}
                    fill="url(#tempGradient)"
                  />
                  <polyline
                    fill="none"
                    stroke={FAO_BLUE}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={hourlyForecast
                      .map(
                        (h, i) =>
                          `${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`,
                      )
                      .join(" ")}
                  />
                  {hourlyForecast.map((h, i) => (
                    <circle
                      key={i}
                      cx={(i / (hourlyForecast.length - 1)) * 500}
                      cy={150 - ((h.temp - 15) / 20) * 150}
                      r="3"
                      fill={FAO_BLUE}
                    />
                  ))}
                </svg>
                <div
                  className={`flex justify-between text-[10px] ${textMuted} mt-1`}
                >
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

        {/* Footer */}
        <footer className={`mt-6 pt-4 border-t ${borderColor}`}>
          <div
            className={`flex flex-col md:flex-row items-center justify-between text-xs ${textMuted} gap-1`}
          >
            <p>© 2025 FAO Uganda. All Rights Reserved.</p>
            <span className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: FAO_BLUE }}
              ></div>
              System Operational
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes drift { from { transform: translateX(-100%); } to { transform: translateX(100vw); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}

// import { useState, useEffect, useRef } from "react";
// import {
//   Cloud,
//   Sun,
//   CloudRain,
//   CloudLightning,
//   Wind,
//   Droplets,
//   Thermometer,
//   Download,
//   Calendar,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   Minus,
//   Navigation,
//   Filter,
//   X,
//   Map as MapIcon,
// } from "lucide-react";
// import UgandaBoundaryMap from "../components/map/UgandaBoundaryMap";

// interface WeatherForecastPageProps {
//   isDarkMode?: boolean;
// }

// interface WeatherData {
//   district_name: string;
//   forecast_date: string;
//   temperature: number;
//   temperature_delta: number;
//   feels_like: number;
//   humidity: number;
//   humidity_delta: number;
//   dew_point: number;
//   wind_speed: number;
//   wind_speed_delta: number;
//   wind_direction: number;
//   wind_direction_label: string;
//   rainfall_24h: number;
//   rainfall_24h_delta: number;
//   weather_code: number;
//   weather_description: string;
//   avg_temp: number;
//   max_temp: number;
//   min_temp: number;
//   total_rain: number;
//   fetched_at: string;
// }

// const FAO_BLUE = "#318DDE";

// const getTrendIcon = (trend: string) => {
//   switch (trend) {
//     case "up":
//       return <TrendingUp className="w-3 h-3" />;
//     case "down":
//       return <TrendingDown className="w-3 h-3" />;
//     default:
//       return <Minus className="w-3 h-3" />;
//   }
// };

// const getTrendColor = (trend: string, isDarkMode: boolean) => {
//   if (trend === "up") return "text-green-500";
//   if (trend === "down") return "text-red-500";
//   return isDarkMode ? "text-slate-400" : "text-slate-500";
// };

// const FilterContent = ({
//   selectedRegion,
//   setSelectedRegion,
//   selectedParameter,
//   setSelectedParameter,
//   isDarkMode,
//   textMuted,
//   textSecondary,
//   borderColor,
//   weatherData,
// }: {
//   selectedRegion: string;
//   setSelectedRegion: (val: string) => void;
//   selectedParameter: string;
//   setSelectedParameter: (val: string) => void;
//   isDarkMode: boolean;
//   textMuted: string;
//   textSecondary: string;
//   borderColor: string;
//   weatherData: WeatherData | null;
// }) => (
//   <div className="space-y-3">
//     <div>
//       <label className={`text-xs ${textMuted} mb-1 block`}>Region</label>
//       <select
//         value={selectedRegion}
//         onChange={(e) => setSelectedRegion(e.target.value)}
//         className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
//       >
//         <option value="All Regions">All Regions</option>
//         <option value="Central">Central</option>
//         <option value="Eastern">Eastern</option>
//         <option value="Western">Western</option>
//         <option value="Northern">Northern</option>
//       </select>
//     </div>
//     <div>
//       <label className={`text-xs ${textMuted} mb-1 block`}>Parameter</label>
//       <select
//         value={selectedParameter}
//         onChange={(e) => setSelectedParameter(e.target.value)}
//         className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
//       >
//         <option value="temperature">Temperature</option>
//         <option value="humidity">Humidity</option>
//         <option value="wind">Wind Speed</option>
//         <option value="rainfall">Rainfall</option>
//       </select>
//     </div>
//     <div>
//       <label className={`text-xs ${textMuted} mb-1 block`}>Date Range</label>
//       <input
//         type="date"
//         className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}
//       />
//     </div>
//     <div className={`pt-3 border-t ${borderColor}`}>
//       <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>
//         Quick Stats
//       </h4>
//       <div className="space-y-1.5">
//         <div className="flex justify-between text-xs">
//           <span className={textMuted}>Avg Temp</span>
//           <span className="font-medium" style={{ color: FAO_BLUE }}>
//             {weatherData ? `${weatherData.avg_temp}°C` : "—"}
//           </span>
//         </div>
//         <div className="flex justify-between text-xs">
//           <span className={textMuted}>Max Temp</span>
//           <span className="text-red-500 font-medium">
//             {weatherData ? `${weatherData.max_temp}°C` : "—"}
//           </span>
//         </div>
//         <div className="flex justify-between text-xs">
//           <span className={textMuted}>Min Temp</span>
//           <span className="text-blue-500 font-medium">
//             {weatherData ? `${weatherData.min_temp}°C` : "—"}
//           </span>
//         </div>
//         <div className="flex justify-between text-xs">
//           <span className={textMuted}>Total Rain</span>
//           <span className="text-cyan-500 font-medium">
//             {weatherData ? `${weatherData.total_rain}mm` : "—"}
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Threshold Scale Component
// const ThresholdScale = ({
//   value,
//   min,
//   max,
//   thresholds,
//   isDarkMode,
// }: {
//   value: number;
//   min: number;
//   max: number;
//   thresholds: { value: number; color: string; label: string }[];
//   isDarkMode: boolean;
// }) => {
//   const percentage = Math.min(
//     100,
//     Math.max(0, ((value - min) / (max - min)) * 100),
//   );

//   return (
//     <div className="mt-2">
//       <div
//         className={`relative h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
//       >
//         <div className="absolute inset-0 flex">
//           {thresholds.map((t, i) => {
//             const prevValue = i === 0 ? min : thresholds[i - 1].value;
//             const width =
//               ((Math.min(t.value, max) - prevValue) / (max - min)) * 100;
//             return (
//               <div
//                 key={i}
//                 className="h-full"
//                 style={{
//                   width: `${width}%`,
//                   backgroundColor: t.color,
//                   opacity: 0.7,
//                 }}
//               />
//             );
//           })}
//         </div>
//         <div
//           className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 shadow-sm transition-all duration-500 ${isDarkMode ? "bg-white" : "bg-black"}`}
//           style={{
//             left: `${percentage}%`,
//             borderColor: isDarkMode ? "#334155" : "white",
//             transform: `translate(-50%, -50%)`,
//             boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
//           }}
//         />
//       </div>
//       <div className="flex justify-between mt-0.5">
//         {thresholds.map((t, i) => (
//           <span
//             key={i}
//             className={`text-[9px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//           >
//             {t.label}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Stat Card Skeleton
// const StatCardSkeleton = ({
//   isDarkMode,
//   borderColor,
// }: {
//   isDarkMode: boolean;
//   borderColor: string;
// }) => (
//   <div
//     className={`${isDarkMode ? "bg-slate-800/85" : "bg-white/95"} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-sm animate-pulse h-24`}
//   />
// );

// const hourlyForecast = [
//   { time: "0:00", temp: 23, rain: 2, icon: "rain" },
//   { time: "1:00", temp: 25, rain: 5, icon: "sun" },
//   { time: "2:00", temp: 26, rain: 9, icon: "sun" },
//   { time: "3:00", temp: 28, rain: 11, icon: "cloud" },
//   { time: "4:00", temp: 28, rain: 14, icon: "rain" },
//   { time: "5:00", temp: 29, rain: 15, icon: "sun" },
//   { time: "6:00", temp: 27, rain: 19, icon: "cloud" },
//   { time: "7:00", temp: 26, rain: 17, icon: "sun" },
//   { time: "8:00", temp: 25, rain: 15, icon: "rain" },
//   { time: "9:00", temp: 23, rain: 13, icon: "cloud" },
//   { time: "10:00", temp: 23, rain: 10, icon: "sun" },
//   { time: "11:00", temp: 20, rain: 10, icon: "sun" },
//   { time: "12:00", temp: 19, rain: 3, icon: "rain" },
//   { time: "13:00", temp: 19, rain: 1, icon: "sun" },
//   { time: "14:00", temp: 19, rain: 0, icon: "sun" },
//   { time: "15:00", temp: 17, rain: 0, icon: "cloud" },
// ];

// const dailyForecast = [
//   {
//     day: "Sun",
//     date: "Mar 22",
//     high: 27,
//     low: 18,
//     rain: 7,
//     icon: "rain",
//     confidence: 93,
//   },
//   {
//     day: "Mon",
//     date: "Mar 23",
//     high: 28,
//     low: 19,
//     rain: 10,
//     icon: "sun",
//     confidence: 89,
//   },
//   {
//     day: "Tue",
//     date: "Mar 24",
//     high: 31,
//     low: 20,
//     rain: 16,
//     icon: "sun",
//     confidence: 87,
//   },
//   {
//     day: "Wed",
//     date: "Mar 25",
//     high: 32,
//     low: 22,
//     rain: 21,
//     icon: "cloud",
//     confidence: 92,
//   },
//   {
//     day: "Thu",
//     date: "Mar 26",
//     high: 31,
//     low: 22,
//     rain: 23,
//     icon: "rain",
//     confidence: 95,
//   },
//   {
//     day: "Fri",
//     date: "Mar 27",
//     high: 29,
//     low: 21,
//     rain: 18,
//     icon: "rain",
//     confidence: 91,
//   },
//   {
//     day: "Sat",
//     date: "Mar 28",
//     high: 28,
//     low: 20,
//     rain: 12,
//     icon: "cloud",
//     confidence: 88,
//   },
// ];

// const getWeatherIcon = (type: string, className = "w-8 h-8") => {
//   switch (type) {
//     case "sun":
//       return <Sun className={`${className} text-yellow-400`} />;
//     case "rain":
//       return <CloudRain className={`${className} text-blue-400`} />;
//     case "cloud":
//       return <Cloud className={`${className} text-slate-400`} />;
//     case "storm":
//       return <CloudLightning className={`${className} text-purple-400`} />;
//     default:
//       return <Sun className={`${className} text-yellow-400`} />;
//   }
// };

// // OpenStreetMap Component with Legend
// const UgandaMap = ({
//   isDarkMode,
//   className = "",
// }: {
//   isDarkMode: boolean;
//   className?: string;
// }) => {
//   return (
//     <UgandaBoundaryMap
//       isDarkMode={isDarkMode}
//       className={`rounded-lg md:rounded-xl ${className}`}
//       badgeText="Uganda"
//       legendTitle="Weather"
//       legendItems={[
//         { label: "Sunny", color: "#fbbf24" },
//         { label: "Cloudy", color: "#94a3b8" },
//         { label: "Rainy", color: "#3b82f6" },
//         { label: "Storm", color: "#a855f7" },
//       ]}
//     />
//   );
// };

// export default function WeatherForecastPage({
//   isDarkMode = true,
// }: WeatherForecastPageProps) {
//   const [activeTab, setActiveTab] = useState<"nowcast" | "forecast">("nowcast");
//   const [selectedRegion, setSelectedRegion] = useState("All Regions");
//   const [selectedParameter, setSelectedParameter] = useState("temperature");
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
//   const [weatherError, setWeatherError] = useState<string | null>(null);
//   const [sliderValue, setSliderValue] = useState((2026 - 2001) * 12 + 2); // Mar 2026
//   const svgRef = useRef<SVGSVGElement>(null);

//   const getMonthYear = (months: number) => {
//     const year = 2001 + Math.floor(months / 12);
//     const month = months % 12;
//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     return `${monthNames[month]} ${year}`;
//   };

//   // Fetch weather data from API
//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}weather/dashboard`,
//         ); // <-- Replace with your actual API URL
//         if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
//         const data: WeatherData = await response.json();
//         setWeatherData(data);
//       } catch (err) {
//         console.error("Failed to fetch weather data:", err);
//         setWeatherError("Failed to load weather data.");
//       }
//     };

//     fetchWeatherData();
//   }, []);

//   // Derive stat cards from API data
//   const statCards = weatherData
//     ? [
//         {
//           label: "Temperature",
//           value: `${weatherData.temperature}°C`,
//           change: `${weatherData.temperature_delta > 0 ? "+" : ""}${weatherData.temperature_delta}°C`,
//           trend:
//             weatherData.temperature_delta > 0
//               ? "up"
//               : weatherData.temperature_delta < 0
//                 ? "down"
//                 : "neutral",
//           icon: Thermometer,
//           color: FAO_BLUE,
//           min: 15,
//           max: 40,
//           thresholds: [
//             { value: 20, color: "#3b82f6", label: "Cool" },
//             { value: 28, color: "#22c55e", label: "Normal" },
//             { value: 35, color: "#f97316", label: "Warm" },
//             { value: 40, color: "#dc2626", label: "Hot" },
//           ],
//         },
//         {
//           label: "Humidity",
//           value: `${weatherData.humidity}%`,
//           change: `${weatherData.humidity_delta > 0 ? "+" : ""}${weatherData.humidity_delta}%`,
//           trend:
//             weatherData.humidity_delta > 0
//               ? "up"
//               : weatherData.humidity_delta < 0
//                 ? "down"
//                 : "neutral",
//           icon: Droplets,
//           color: FAO_BLUE,
//           min: 0,
//           max: 100,
//           thresholds: [
//             { value: 30, color: "#dc2626", label: "Dry" },
//             { value: 50, color: "#fbbf24", label: "Low" },
//             { value: 70, color: "#22c55e", label: "Normal" },
//             { value: 85, color: "#dc2626", label: "High" },
//           ],
//         },
//         {
//           label: "Wind Speed",
//           value: `${weatherData.wind_speed} km/h`,
//           change: `${weatherData.wind_speed_delta > 0 ? "+" : ""}${weatherData.wind_speed_delta} km/h`,
//           trend:
//             weatherData.wind_speed_delta > 0
//               ? "up"
//               : weatherData.wind_speed_delta < 0
//                 ? "down"
//                 : "neutral",
//           icon: Wind,
//           color: FAO_BLUE,
//           min: 0,
//           max: 60,
//           thresholds: [
//             { value: 10, color: "#22c55e", label: "Calm" },
//             { value: 25, color: "#3b82f6", label: "Breezy" },
//             { value: 40, color: "#f97316", label: "Windy" },
//             { value: 60, color: "#dc2626", label: "Strong" },
//           ],
//         },
//         {
//           label: "Rainfall (24h)",
//           value: `${weatherData.rainfall_24h} mm`,
//           change: `${weatherData.rainfall_24h_delta > 0 ? "+" : ""}${weatherData.rainfall_24h_delta} mm`,
//           trend:
//             weatherData.rainfall_24h_delta > 0
//               ? "up"
//               : weatherData.rainfall_24h_delta < 0
//                 ? "down"
//                 : "neutral",
//           icon: CloudRain,
//           color: FAO_BLUE,
//           min: 0,
//           max: 100,
//           thresholds: [
//             { value: 5, color: "#22c55e", label: "Dry" },
//             { value: 20, color: "#3b82f6", label: "Light" },
//             { value: 50, color: "#f97316", label: "Moderate" },
//             { value: 100, color: "#dc2626", label: "Heavy" },
//           ],
//         },
//       ]
//     : [];

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 500);
//     return () => clearTimeout(timer);
//   }, [activeTab]);

//   const cardBg = isDarkMode ? "bg-slate-800/85" : "bg-white/95";
//   const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
//   const textSecondary = isDarkMode ? "text-slate-300" : "text-slate-600";
//   const borderColor = isDarkMode ? "border-slate-700/30" : "border-slate-200";
//   const headerText = isDarkMode ? "text-white" : "text-slate-900";

//   if (isLoading) {
//     return (
//       <div
//         className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}
//       >
//         <div className="text-center">
//           <div
//             className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
//             style={{ borderColor: `${FAO_BLUE}30`, borderTopColor: FAO_BLUE }}
//           ></div>
//           <p className={textMuted}>Loading Weather Forecast...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 min-h-screen">
//       {/* Animated Background */}
//       {isDarkMode && (
//         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//           {[...Array(5)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute opacity-10"
//               style={{
//                 left: `${-20 + i * 25}%`,
//                 top: `${10 + (i % 3) * 20}%`,
//                 animation: `drift ${20 + i * 5}s linear infinite`,
//               }}
//             >
//               <Cloud className="w-32 h-32 text-blue-300" />
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="relative z-10 max-w-[1600px] mx-auto">
//         {/* Compact Header Banner */}
//         <div
//           className="relative overflow-hidden rounded-lg md:rounded-xl p-3 md:p-4 mb-3 animate-fade-in-up"
//           style={{
//             background: `linear-gradient(135deg, ${FAO_BLUE}e6 0%, ${FAO_BLUE}99 100%)`,
//           }}
//         >
//           <div className="relative z-10">
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
//               <div>
//                 <h1 className="text-lg md:text-xl font-bold text-white">
//                   Weather Forecast
//                 </h1>
//                 <p className="text-slate-200 text-xs md:text-sm">
//                   24-hour nowcasting & 7-day forecasts
//                 </p>
//                 <div className="flex flex-wrap items-center gap-1.5 mt-2">
//                   <span
//                     className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
//                     style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
//                   >
//                     <Clock className="w-3 h-3" />
//                     {weatherData
//                       ? `Updated ${new Date(weatherData.fetched_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
//                       : "Updated 5 min ago"}
//                   </span>
//                   <span
//                     className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
//                     style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
//                   >
//                     <Navigation className="w-3 h-3" />
//                     87% Accuracy
//                   </span>
//                   {weatherData && (
//                     <span
//                       className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md text-white"
//                       style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
//                     >
//                       {weatherData.weather_description}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <button className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors">
//                   <Download className="w-3 h-3" />
//                   <span className="hidden sm:inline">Export</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error banner */}
//         {weatherError && (
//           <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
//             <X className="w-3.5 h-3.5 flex-shrink-0" />
//             {weatherError} Stat cards will populate once the API is reachable.
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3">
//           {weatherData === null && !weatherError
//             ? Array(4)
//                 .fill(0)
//                 .map((_, i) => (
//                   <StatCardSkeleton
//                     key={i}
//                     isDarkMode={isDarkMode}
//                     borderColor={borderColor}
//                   />
//                 ))
//             : statCards.map((card, index) => {
//                 const Icon = card.icon;
//                 const numericValue = parseFloat(
//                   card.value.replace(/[^0-9.]/g, ""),
//                 );
//                 return (
//                   <div
//                     key={index}
//                     className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-sm animate-fade-in-up transition-all hover:shadow-md`}
//                     style={{ animationDelay: `${index * 0.1}s` }}
//                   >
//                     <div className="flex items-start justify-between mb-1.5">
//                       <div>
//                         <p
//                           className={`text-[10px] md:text-xs ${textMuted} mb-0.5`}
//                         >
//                           {card.label}
//                         </p>
//                         <p
//                           className={`text-base md:text-lg font-bold ${headerText}`}
//                         >
//                           {card.value}
//                         </p>
//                       </div>
//                       <div
//                         className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
//                         style={{ backgroundColor: `${FAO_BLUE}20` }}
//                       >
//                         <Icon
//                           className="w-3.5 h-3.5 md:w-4 md:h-4"
//                           style={{ color: FAO_BLUE }}
//                         />
//                       </div>
//                     </div>
//                     <div
//                       className={`flex items-center gap-1 text-[10px] ${getTrendColor(card.trend, isDarkMode)}`}
//                     >
//                       {getTrendIcon(card.trend)}
//                       <span>{card.change}</span>
//                     </div>
//                     <ThresholdScale
//                       value={numericValue}
//                       min={card.min}
//                       max={card.max}
//                       thresholds={card.thresholds}
//                       isDarkMode={isDarkMode}
//                     />
//                   </div>
//                 );
//               })}
//         </div>

//         {/* Desktop Layout with Sidebar */}
//         <div className="hidden lg:grid lg:grid-cols-12 gap-4">
//           {/* Left Sidebar */}
//           <div className="lg:col-span-3 flex flex-col">
//             <div
//               className="flex-1 rounded-xl p-3 shadow-sm flex flex-col"
//               style={{
//                 background: isDarkMode
//                   ? `linear-gradient(180deg, ${FAO_BLUE}30 0%, ${FAO_BLUE}15 100%)`
//                   : `linear-gradient(180deg, ${FAO_BLUE}15 0%, ${FAO_BLUE}05 100%)`,
//                 border: `1px solid ${isDarkMode ? `${FAO_BLUE}30` : `${FAO_BLUE}15`}`,
//               }}
//             >
//               <div
//                 className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-800/80" : "bg-white/90"} border ${isDarkMode ? "border-slate-700/30" : "border-slate-200"}`}
//               >
//                 <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>
//                   Filters
//                 </h3>
//                 <FilterContent
//                   selectedRegion={selectedRegion}
//                   setSelectedRegion={setSelectedRegion}
//                   selectedParameter={selectedParameter}
//                   setSelectedParameter={setSelectedParameter}
//                   isDarkMode={isDarkMode}
//                   textMuted={textMuted}
//                   textSecondary={textSecondary}
//                   borderColor={borderColor}
//                   weatherData={weatherData}
//                 />
//               </div>

//               {/* Illustration at bottom */}
//               <div className="mt-auto pt-3">
//                 <div
//                   className="rounded-xl overflow-hidden"
//                   style={{
//                     backgroundImage: "url(/weather-illustration.png)",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     height: "140px",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-9 space-y-3">
//             {/* Map and Charts Row */}
//             <div
//               className="grid grid-cols-12 gap-3"
//               style={{ minHeight: "520px" }}
//             >
//               {/* Map - 7 columns */}
//               <div className="col-span-7 flex">
//                 <div
//                   className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col`}
//                 >
//                   <div
//                     className={`flex items-center justify-between p-2 border-b ${borderColor}`}
//                   >
//                     <div className="flex items-center gap-1.5">
//                       <MapIcon
//                         className="w-4 h-4"
//                         style={{ color: FAO_BLUE }}
//                       />
//                       <h3 className={`text-sm font-semibold ${headerText}`}>
//                         Weather Map
//                       </h3>
//                     </div>
//                     <span
//                       className="px-1.5 py-0.5 rounded text-[10px] font-medium"
//                       style={{
//                         backgroundColor: isDarkMode
//                           ? `${FAO_BLUE}30`
//                           : `${FAO_BLUE}20`,
//                         color: FAO_BLUE,
//                       }}
//                     >
//                       Live
//                     </span>
//                   </div>
//                   <div
//                     className="relative flex-1 flex flex-col"
//                     style={{ minHeight: "350px" }}
//                   >
//                     <div className="flex-1 relative">
//                       <UgandaMap
//                         isDarkMode={isDarkMode}
//                         className="absolute inset-0 w-full h-full rounded-none"
//                       />
//                     </div>
//                     {/* Time Slider */}
//                     <div
//                       className={`px-4 py-3 border-t ${borderColor} flex items-center gap-4 ${isDarkMode ? "bg-slate-800/80" : "bg-slate-50"}`}
//                     >
//                       <span className={`text-xs font-medium ${textMuted}`}>
//                         2001
//                       </span>
//                       <input
//                         type="range"
//                         min="0"
//                         max={(2026 - 2001 + 1) * 12 - 1}
//                         value={sliderValue}
//                         onChange={(e) =>
//                           setSliderValue(parseInt(e.target.value))
//                         }
//                         className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer"
//                         style={{
//                           backgroundColor: isDarkMode ? "#334155" : "#cbd5e1",
//                           accentColor: FAO_BLUE,
//                         }}
//                       />
//                       <span
//                         className="text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
//                         style={{
//                           backgroundColor: `${FAO_BLUE}20`,
//                           color: FAO_BLUE,
//                         }}
//                       >
//                         {getMonthYear(sliderValue)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Nowcast/Forecast Tabs and Temperature Trend - 5 columns */}
//               <div className="col-span-5 flex flex-col gap-3">
//                 {/* Tabbed Forecast Container */}
//                 <div
//                   className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg shadow-sm overflow-hidden`}
//                 >
//                   {/* Tabs */}
//                   <div className={`flex border-b ${borderColor}`}>
//                     <button
//                       onClick={() => setActiveTab("nowcast")}
//                       className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
//                         activeTab === "nowcast"
//                           ? "text-white"
//                           : `${isDarkMode ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600"}`
//                       }`}
//                       style={{
//                         backgroundColor:
//                           activeTab === "nowcast" ? FAO_BLUE : undefined,
//                       }}
//                     >
//                       <span
//                         className={`w-2 h-2 rounded-full ${activeTab === "nowcast" ? "bg-white" : "bg-slate-400"}`}
//                       />
//                       <Clock className="w-3.5 h-3.5" />
//                       24-Hour Nowcast
//                     </button>
//                     <button
//                       onClick={() => setActiveTab("forecast")}
//                       className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
//                         activeTab === "forecast"
//                           ? "text-white"
//                           : `${isDarkMode ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600"}`
//                       }`}
//                       style={{
//                         backgroundColor:
//                           activeTab === "forecast" ? FAO_BLUE : undefined,
//                       }}
//                     >
//                       <span
//                         className={`w-2 h-2 rounded-full ${activeTab === "forecast" ? "bg-white" : "bg-slate-400"}`}
//                       />
//                       <Calendar className="w-3.5 h-3.5" />
//                       7-Day Forecast
//                     </button>
//                   </div>

//                   {/* Tab Content */}
//                   <div className="p-3">
//                     {activeTab === "nowcast" ? (
//                       <div>
//                         <h4
//                           className={`text-xs font-semibold mb-2 ${headerText}`}
//                         >
//                           Hourly Forecast
//                         </h4>
//                         <div className="flex gap-2 overflow-x-auto pb-1">
//                           {hourlyForecast.slice(0, 8).map((hour, idx) => (
//                             <div
//                               key={idx}
//                               className={`flex-shrink-0 w-14 p-2 rounded-lg text-center transition-all hover:scale-105 ${idx === 0 ? "border" : isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
//                               style={{
//                                 borderColor: idx === 0 ? FAO_BLUE : undefined,
//                                 backgroundColor:
//                                   idx === 0 ? `${FAO_BLUE}20` : undefined,
//                               }}
//                             >
//                               <p className={`text-[10px] ${textMuted} mb-1`}>
//                                 {hour.time}
//                               </p>
//                               {getWeatherIcon(hour.icon, "w-5 h-5 mx-auto")}
//                               <p
//                                 className={`text-sm font-bold mt-1 ${headerText}`}
//                               >
//                                 {hour.temp}°
//                               </p>
//                               <p
//                                 className="text-[10px]"
//                                 style={{ color: FAO_BLUE }}
//                               >
//                                 {hour.rain}mm
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <h4
//                           className={`text-xs font-semibold mb-2 ${headerText}`}
//                         >
//                           7-Day Forecast
//                         </h4>
//                         <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
//                           {dailyForecast.map((day, idx) => (
//                             <div
//                               key={idx}
//                               className={`flex-shrink-0 w-20 p-2 rounded-lg text-center transition-all hover:scale-105 ${isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
//                             >
//                               <p className={`text-[10px] ${textMuted}`}>
//                                 {day.day}
//                               </p>
//                               {getWeatherIcon(day.icon, "w-5 h-5 mx-auto my-1")}
//                               <p className={`text-xs font-bold ${headerText}`}>
//                                 {day.high}°
//                               </p>
//                               <p className={`text-[9px] ${textMuted}`}>
//                                 {day.low}°
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Temperature Trend */}
//                 <div
//                   className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm flex-1 flex flex-col`}
//                 >
//                   <h3
//                     className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
//                   >
//                     <TrendingUp
//                       className="w-4 h-4"
//                       style={{ color: FAO_BLUE }}
//                     />
//                     Temperature Trend
//                   </h3>
//                   <div
//                     className="flex-1 relative"
//                     style={{ minHeight: "200px" }}
//                   >
//                     <div
//                       className={`absolute left-0 top-0 bottom-5 w-5 flex flex-col justify-between text-[10px] ${textMuted}`}
//                     >
//                       <span>35°</span>
//                       <span>30°</span>
//                       <span>25°</span>
//                       <span>20°</span>
//                       <span>15°</span>
//                     </div>
//                     <div className="ml-5 h-full relative">
//                       {[0, 1, 2, 3, 4].map((i) => (
//                         <div
//                           key={i}
//                           className={`absolute left-0 right-0 h-px ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200"}`}
//                           style={{ top: `${i * 25}%` }}
//                         />
//                       ))}
//                       <svg
//                         ref={svgRef}
//                         key={activeTab}
//                         className="w-full h-[85%]"
//                         viewBox="0 0 500 150"
//                         preserveAspectRatio="none"
//                       >
//                         <defs>
//                           <linearGradient
//                             id="tempGradient"
//                             x1="0%"
//                             y1="0%"
//                             x2="0%"
//                             y2="100%"
//                           >
//                             <stop
//                               offset="0%"
//                               stopColor={FAO_BLUE}
//                               stopOpacity="0.3"
//                             />
//                             <stop
//                               offset="100%"
//                               stopColor={FAO_BLUE}
//                               stopOpacity="0"
//                             />
//                           </linearGradient>
//                         </defs>
//                         <path
//                           d={`M0,${150 - ((hourlyForecast[0].temp - 15) / 20) * 150} ${hourlyForecast.map((h, i) => `L${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(" ")} L500,150 L0,150 Z`}
//                           fill="url(#tempGradient)"
//                         />
//                         <polyline
//                           fill="none"
//                           stroke={FAO_BLUE}
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           points={hourlyForecast
//                             .map(
//                               (h, i) =>
//                                 `${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`,
//                             )
//                             .join(" ")}
//                         />
//                         {hourlyForecast.map((h, i) => (
//                           <circle
//                             key={i}
//                             cx={(i / (hourlyForecast.length - 1)) * 500}
//                             cy={150 - ((h.temp - 15) / 20) * 150}
//                             r="3"
//                             fill={FAO_BLUE}
//                           />
//                         ))}
//                       </svg>
//                       <div
//                         className={`flex justify-between text-[10px] ${textMuted} mt-1`}
//                       >
//                         <span>00:00</span>
//                         <span>04:00</span>
//                         <span>08:00</span>
//                         <span>12:00</span>
//                         <span>16:00</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="block lg:hidden space-y-3">
//           {/* Tabbed Container - Mobile */}
//           <div
//             className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg shadow-sm overflow-hidden`}
//           >
//             <div className={`flex border-b ${borderColor}`}>
//               <button
//                 onClick={() => setActiveTab("nowcast")}
//                 className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
//                   activeTab === "nowcast"
//                     ? "text-white"
//                     : `${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-100 text-slate-600"}`
//                 }`}
//                 style={{
//                   backgroundColor:
//                     activeTab === "nowcast" ? FAO_BLUE : undefined,
//                 }}
//               >
//                 <span
//                   className={`w-2 h-2 rounded-full ${activeTab === "nowcast" ? "bg-white" : "bg-slate-400"}`}
//                 />
//                 <Clock className="w-3.5 h-3.5" />
//                 Nowcast
//               </button>
//               <button
//                 onClick={() => setActiveTab("forecast")}
//                 className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
//                   activeTab === "forecast"
//                     ? "text-white"
//                     : `${isDarkMode ? "bg-slate-800/50 text-slate-400" : "bg-slate-100 text-slate-600"}`
//                 }`}
//                 style={{
//                   backgroundColor:
//                     activeTab === "forecast" ? FAO_BLUE : undefined,
//                 }}
//               >
//                 <span
//                   className={`w-2 h-2 rounded-full ${activeTab === "forecast" ? "bg-white" : "bg-slate-400"}`}
//                 />
//                 <Calendar className="w-3.5 h-3.5" />
//                 Forecast
//               </button>
//             </div>

//             <div className="p-3">
//               {activeTab === "nowcast" ? (
//                 <div>
//                   <h3
//                     className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
//                   >
//                     <Clock className="w-4 h-4" style={{ color: FAO_BLUE }} />
//                     Hourly Forecast
//                   </h3>
//                   <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
//                     {hourlyForecast.map((hour, idx) => (
//                       <div
//                         key={idx}
//                         className={`flex-shrink-0 w-14 p-2 rounded-lg text-center transition-all hover:scale-105 ${idx === 0 ? "border" : isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
//                         style={{
//                           borderColor: idx === 0 ? FAO_BLUE : undefined,
//                           backgroundColor:
//                             idx === 0 ? `${FAO_BLUE}20` : undefined,
//                         }}
//                       >
//                         <p className={`text-[10px] ${textMuted} mb-1`}>
//                           {hour.time}
//                         </p>
//                         {getWeatherIcon(hour.icon, "w-5 h-5 mx-auto")}
//                         <p className={`text-sm font-bold mt-1 ${headerText}`}>
//                           {hour.temp}°
//                         </p>
//                         <p className="text-[10px]" style={{ color: FAO_BLUE }}>
//                           {hour.rain}mm
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <h3
//                     className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
//                   >
//                     <Calendar className="w-4 h-4" style={{ color: FAO_BLUE }} />
//                     7-Day Forecast
//                   </h3>
//                   <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
//                     {dailyForecast.map((day, idx) => (
//                       <div
//                         key={idx}
//                         className={`flex-shrink-0 w-24 rounded-lg p-2 text-center transition-all hover:scale-105 ${isDarkMode ? "bg-slate-700/30" : "bg-slate-100"}`}
//                       >
//                         <p className={`text-xs ${textMuted}`}>{day.day}</p>
//                         <p className="text-[10px] text-slate-500 mb-1">
//                           {day.date}
//                         </p>
//                         {getWeatherIcon(day.icon, "w-5 h-5 mx-auto")}
//                         <div className="flex items-center justify-center gap-1 mt-1">
//                           <span className={`text-sm font-bold ${headerText}`}>
//                             {day.high}°
//                           </span>
//                           <span className={`text-xs ${textMuted}`}>
//                             {day.low}°
//                           </span>
//                         </div>
//                         <div
//                           className="flex items-center justify-center gap-1 mt-0.5 text-[10px]"
//                           style={{ color: FAO_BLUE }}
//                         >
//                           <CloudRain className="w-2.5 h-2.5" />
//                           {day.rain}mm
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Map Section with Filter Popup */}
//           <div className="relative">
//             <div
//               className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl overflow-hidden shadow-sm`}
//             >
//               <div
//                 className={`flex items-center justify-between p-2 border-b ${borderColor}`}
//               >
//                 <div className="flex items-center gap-1.5">
//                   <MapIcon className="w-4 h-4" style={{ color: FAO_BLUE }} />
//                   <h3 className={`text-sm font-semibold ${headerText}`}>
//                     Weather Map
//                   </h3>
//                 </div>
//                 <span
//                   className="px-1.5 py-0.5 rounded text-[10px] font-medium"
//                   style={{
//                     backgroundColor: isDarkMode
//                       ? `${FAO_BLUE}30`
//                       : `${FAO_BLUE}20`,
//                     color: FAO_BLUE,
//                   }}
//                 >
//                   Live
//                 </span>
//               </div>
//               <div className="relative aspect-[16/10] flex flex-col">
//                 <div className="flex-1 relative">
//                   <UgandaMap
//                     isDarkMode={isDarkMode}
//                     className="absolute inset-0 w-full h-full"
//                   />
//                 </div>
//                 {/* Filter button on map */}
//                 <button
//                   onClick={() => setShowMobileFilters(!showMobileFilters)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center shadow-md z-[1001] text-white"
//                   style={{ backgroundColor: FAO_BLUE }}
//                 >
//                   <Filter className="w-4 h-4" />
//                 </button>

//                 {/* Time Slider */}
//                 <div
//                   className={`px-2 py-2 border-t ${borderColor} flex items-center gap-2 ${isDarkMode ? "bg-slate-800/80" : "bg-slate-50"} z-[1001]`}
//                 >
//                   <span className={`text-[10px] font-medium ${textMuted}`}>
//                     2001
//                   </span>
//                   <input
//                     type="range"
//                     min="0"
//                     max={(2026 - 2001 + 1) * 12 - 1}
//                     value={sliderValue}
//                     onChange={(e) => setSliderValue(parseInt(e.target.value))}
//                     className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
//                     style={{
//                       backgroundColor: isDarkMode ? "#334155" : "#cbd5e1",
//                       accentColor: FAO_BLUE,
//                     }}
//                   />
//                   <span
//                     className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
//                     style={{
//                       backgroundColor: `${FAO_BLUE}20`,
//                       color: FAO_BLUE,
//                     }}
//                   >
//                     {getMonthYear(sliderValue)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Filter Popup */}
//             {showMobileFilters && (
//               <>
//                 <div
//                   className="fixed inset-0 z-[1002]"
//                   onClick={() => setShowMobileFilters(false)}
//                 />
//                 <div
//                   className={`absolute right-2 top-1/2 -translate-y-1/2 z-[1003] w-64 rounded-xl shadow-lg border p-3 max-h-[70vh] overflow-y-auto ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className={`text-xs font-semibold ${headerText}`}>
//                       Filters
//                     </h4>
//                     <button
//                       onClick={() => setShowMobileFilters(false)}
//                       className={`p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
//                     >
//                       <X className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                   <FilterContent
//                     selectedRegion={selectedRegion}
//                     setSelectedRegion={setSelectedRegion}
//                     selectedParameter={selectedParameter}
//                     setSelectedParameter={setSelectedParameter}
//                     isDarkMode={isDarkMode}
//                     textMuted={textMuted}
//                     textSecondary={textSecondary}
//                     borderColor={borderColor}
//                     weatherData={weatherData}
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Temperature Trend */}
//           <div
//             className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-lg p-3 shadow-sm`}
//           >
//             <h3
//               className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${headerText}`}
//             >
//               <TrendingUp className="w-4 h-4" style={{ color: FAO_BLUE }} />
//               Temperature Trend
//             </h3>
//             <div className="h-36 relative">
//               <div
//                 className={`absolute left-0 top-0 bottom-5 w-5 flex flex-col justify-between text-[10px] ${textMuted}`}
//               >
//                 <span>35°</span>
//                 <span>30°</span>
//                 <span>25°</span>
//                 <span>20°</span>
//                 <span>15°</span>
//               </div>
//               <div className="ml-5 h-full relative">
//                 {[0, 1, 2, 3, 4].map((i) => (
//                   <div
//                     key={i}
//                     className={`absolute left-0 right-0 h-px ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200"}`}
//                     style={{ top: `${i * 25}%` }}
//                   />
//                 ))}
//                 <svg
//                   ref={svgRef}
//                   key={activeTab}
//                   className="w-full h-[85%]"
//                   viewBox="0 0 500 150"
//                   preserveAspectRatio="none"
//                 >
//                   <defs>
//                     <linearGradient
//                       id="tempGradientMobile"
//                       x1="0%"
//                       y1="0%"
//                       x2="0%"
//                       y2="100%"
//                     >
//                       <stop
//                         offset="0%"
//                         stopColor={FAO_BLUE}
//                         stopOpacity="0.3"
//                       />
//                       <stop
//                         offset="100%"
//                         stopColor={FAO_BLUE}
//                         stopOpacity="0"
//                       />
//                     </linearGradient>
//                   </defs>
//                   <path
//                     d={`M0,${150 - ((hourlyForecast[0].temp - 15) / 20) * 150} ${hourlyForecast.map((h, i) => `L${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`).join(" ")} L500,150 L0,150 Z`}
//                     fill="url(#tempGradientMobile)"
//                   />
//                   <polyline
//                     fill="none"
//                     stroke={FAO_BLUE}
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     points={hourlyForecast
//                       .map(
//                         (h, i) =>
//                           `${(i / (hourlyForecast.length - 1)) * 500},${150 - ((h.temp - 15) / 20) * 150}`,
//                       )
//                       .join(" ")}
//                   />
//                   {hourlyForecast.map((h, i) => (
//                     <circle
//                       key={i}
//                       cx={(i / (hourlyForecast.length - 1)) * 500}
//                       cy={150 - ((h.temp - 15) / 20) * 150}
//                       r="3"
//                       fill={FAO_BLUE}
//                     />
//                   ))}
//                 </svg>
//                 <div
//                   className={`flex justify-between text-[10px] ${textMuted} mt-1`}
//                 >
//                   <span>00:00</span>
//                   <span>04:00</span>
//                   <span>08:00</span>
//                   <span>12:00</span>
//                   <span>16:00</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className={`mt-6 pt-4 border-t ${borderColor}`}>
//           <div
//             className={`flex flex-col md:flex-row items-center justify-between text-xs ${textMuted} gap-1`}
//           >
//             <p>© 2025 FAO Uganda. All Rights Reserved.</p>
//             <span className="flex items-center gap-1.5">
//               <div
//                 className="w-1.5 h-1.5 rounded-full animate-pulse"
//                 style={{ backgroundColor: FAO_BLUE }}
//               ></div>
//               System Operational
//             </span>
//           </div>
//         </footer>
//       </div>

//       <style>{`
//         @keyframes drift { from { transform: translateX(-100%); } to { transform: translateX(100vw); } }
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
//       `}</style>
//     </div>
//   );
// }
