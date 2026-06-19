import { useEffect, useState } from "react";
// import { API_BASE } from "@/config";

// ── Types matching the API response shape ─────────────────────────────────────

export interface RainfallDistrict {
  district_id: number;
  district: string;
  forecast_rainfall_mm: number;
  source: string;
}

export interface TemperatureDistrict {
  district_id: number;
  district: string;
  forecast_mean_temperature_c: number;
  source: string;
}

export interface FloodBasinSummary {
  river_basin_id: number;
  river_basin: string;
  expected_discharge_m3s: number;
  avg_discharge_m3s: number;
  max_discharge_m3s: number;
  flood_risk_level: string;
  affected_population: number;
  flood_extent_km2: number;
  affected_roads_km: number;
  affected_buildings: number;
  affected_pois: number;
}

export interface WeatherForecastData {
  title: string;
  valid_from: string;
  valid_to: string;
  generated_at: string;

  review_summary: {
    rainfall_range: { minimum_mm: number; maximum_mm: number };
    rainfall_range_source: string;
    highest_rainfall_districts: RainfallDistrict[];
    rainfall_distribution_summary: string;
    river_monitoring: {
      river_name_with_the_most_discharge: string;
      river_trend: string;
      discharge_m3s: number;
      source: string;
    };
    openmeteo_dashboard_summary: {
      temperature_c: number;
      feels_like_c: number;
      humidity_pct: number;
      avg_temp_c: number;
      max_temp_c: number;
      min_temp_c: number;
      total_rain_mm: number;
      weather_description: string;
    };
  };

  forecast_highlights: {
    rainfall_forecasts: RainfallDistrict[];
    higher_rainfall_areas: string[];
    rainfall_forecast_range: { minimum_mm: number; maximum_mm: number };
  };

  temperature_forecast: {
    temperature_forecasts: TemperatureDistrict[];
    temperature_range: { minimum_c: number; maximum_c: number };
    min_temperature_range: number;
    district_to_experience_minimum_range: string;
    max_temperature_range: number;
    district_to_experience_maximum_range: string;
  };

  flood_forecast: {
    river_name: string;
    river_condition: string;
    discharge_summary: FloodBasinSummary[];
    forecast_date: string;
    valid_date: string;
    leadtime_hours: number;
    data_available: boolean;
  };

  impact_assessment: {
    flood_risk_level: string;
    flood_risk_locations: string[];
    potentially_affected_population: number;
    basin_level_flood_impact: FloodBasinSummary[];
  };

  source_dates: {
    weather_issue_date: string;
    flood_forecast_date: string;
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useWeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}weather/weekly-report/`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WeatherForecastData = await res.json();
        console.log("weekly-forecast", data);
        setForecast(data);
      } catch (err) {
        console.error("useWeatherForecast error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch forecast",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return { forecast, loading, error };
};
