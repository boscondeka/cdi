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
import { useFilterStore } from "../../store/useFilterStore";

interface WeatherData {
  district_name: string;
  forecast_date: string;
  temperature: number;
  temperature_delta: number;
  feels_like: number;
  humidity: number;
  humidity_delta: number;
  dew_point: number;
  wind_speed: number;
  wind_speed_delta: number;
  wind_direction: number;
  wind_direction_label: string;
  rainfall_24h: number;
  rainfall_24h_delta: number;
  weather_code: number;
  weather_description: string;
  avg_temp: number;
  max_temp: number;
  min_temp: number;
  total_rain: number;
  fetched_at: string;
}

function Stats() {
  let { FAO_BLUE, isDarkMode, borderColor, cardBg, textMuted, headerText } =
    useFilterStore((state: any) => state);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}weather/dashboard`,
        ); // <-- Replace with your actual API URL
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setWeatherError("Failed to load weather data.");
      }
    };

    fetchWeatherData();
  }, []);

  // Derive stat cards from API data
  const statCards = weatherData
    ? [
        {
          label: "Temperature",
          value: `${weatherData.temperature}°C`,
          change: `${weatherData.temperature_delta > 0 ? "+" : ""}${weatherData.temperature_delta}°C`,
          trend:
            weatherData.temperature_delta > 0
              ? "up"
              : weatherData.temperature_delta < 0
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
          value: `${weatherData.humidity}%`,
          change: `${weatherData.humidity_delta > 0 ? "+" : ""}${weatherData.humidity_delta}%`,
          trend:
            weatherData.humidity_delta > 0
              ? "up"
              : weatherData.humidity_delta < 0
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
          value: `${weatherData.wind_speed} km/h`,
          change: `${weatherData.wind_speed_delta > 0 ? "+" : ""}${weatherData.wind_speed_delta} km/h`,
          trend:
            weatherData.wind_speed_delta > 0
              ? "up"
              : weatherData.wind_speed_delta < 0
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
          value: `${weatherData.rainfall_24h} mm`,
          change: `${weatherData.rainfall_24h_delta > 0 ? "+" : ""}${weatherData.rainfall_24h_delta} mm`,
          trend:
            weatherData.rainfall_24h_delta > 0
              ? "up"
              : weatherData.rainfall_24h_delta < 0
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
      ]
    : [];

  // Stat Card Skeleton
  const StatCardSkeleton = ({
    isDarkMode,
    borderColor,
  }: {
    isDarkMode: boolean;
    borderColor: string;
  }) => (
    <div
      className={`${isDarkMode ? "bg-slate-800/85" : "bg-white/95"} backdrop-blur-sm border ${borderColor} rounded-lg md:rounded-xl p-2.5 md:p-3 shadow-sm animate-pulse h-24`}
    />
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
  return (
    <>
      {/* {weatherError && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <X className="w-3.5 h-3.5 flex-shrink-0" />
          {weatherError} Stat cards will populate once the API is reachable.
        </div>
      )} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3">
        {// weatherData === null && !weatherError
        //   ? Array(4)
        //       .fill(0)
        //       .map((_, i) => (
        //         <StatCardSkeleton
        //           key={i}
        //           isDarkMode={isDarkMode}
        //           borderColor={borderColor}
        //         />
        //       ))
        //   :
        statCards?.map((card, index) => {
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
                  <p className={`text-base md:text-lg font-bold ${headerText}`}>
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
    </>
  );
}

export default Stats;
