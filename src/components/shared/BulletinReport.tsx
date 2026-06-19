import React from "react";
import type {
  WeatherForecastData,
  RainfallDistrict,
  TemperatureDistrict,
  FloodBasinSummary,
} from "@/hooks/useWeatherForecast";
import { DROUGHT_BASE } from "@/config";

// ── Prop types ────────────────────────────────────────────────────────────────

interface DroughtCounts {
  extremeCount: number;
  severeCount: number;
  moderateCount: number;
  mildCount: number;
  normalCount: number;
  trendingCount: number;
  improvingCount: number;
  month: string;
  year: string;
  extremeDistricts: string[];
  severeDistricts: string[];
  improvingDistricts: string[];
  cdi_image: any;
}

interface BulletinReportProps {
  date?: Date;
  bulletinNumber?: string;
  isDarkMode?: boolean;
  drought: DroughtCounts;
  forecast?: WeatherForecastData | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = {
  date: (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  num: (n: number) => n.toLocaleString(),
  mm: (n: number) => `${n.toFixed(1)} mm`,
  m3s: (n: number) => `${n.toFixed(1)} m³/s`,
  temp: (n: number) => `${n.toFixed(1)}°C`,
  km2: (n: number) => `${n.toFixed(1)} km²`,
  km: (n: number) => `${n.toFixed(1)} km`,
  cap: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
};

// ── Component ─────────────────────────────────────────────────────────────────

export const BulletinReport: React.FC<BulletinReportProps> = ({
  date = new Date(),
  bulletinNumber,
  drought,
  forecast,
}) => {
  const bulletinId =
    bulletinNumber ||
    `UGA-MH-${date.getFullYear()}-${String(Math.floor(date.getTime() / 86400000)).slice(-3)}`;

  // Shorthand: yellow placeholder for anything still missing
  const ph = (text: string) => (
    <span
      style={{
        backgroundColor: "#FFF9C4",
        border: "1px solid #F9A825",
        borderRadius: "3px",
        padding: "0 4px",
        fontStyle: "italic",
        color: "#555",
        fontSize: "inherit",
      }}
    >
      {text}
    </span>
  );

  // ── Layout helpers ──────────────────────────────────────────────────────────

  const sectionHeading = (title: string) => (
    <h2
      style={{
        margin: "18px 0 6px 0",
        fontSize: "13pt",
        fontWeight: "bold",
        color: "#1a1a1a",
        borderBottom: "2px solid #1a1a1a",
        paddingBottom: "3px",
        textTransform: "uppercase",
        letterSpacing: "0.3px",
      }}
    >
      {title}
    </h2>
  );

  const subHeading = (title: string) => (
    <h3
      style={{
        margin: "14px 0 5px 0",
        fontSize: "11pt",
        fontWeight: "bold",
        color: "#1a1a1a",
      }}
    >
      {title}
    </h3>
  );

  const bullet = (content: React.ReactNode) => (
    <p
      style={{
        margin: "4px 0 4px 18px",
        fontSize: "10pt",
        lineHeight: "1.6",
        textIndent: "-10px",
      }}
    >
      {"• "}
      {content}
    </p>
  );

  // const mapPlaceholder = (label: string,data:string) => (
  //   <div
  //     style={{
  //       border: "1px dashed #999",
  //       backgroundColor: "#F5F5F5",
  //       borderRadius: "4px",
  //       padding: "12px",
  //       margin: "10px 0",
  //       textAlign: "center",
  //       minHeight: "160px",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       color: "#888",
  //       fontSize: "9pt",
  //       fontStyle: "italic",
  //     }}
  //   >
  //     {label}
  //   </div>
  //    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
  //             <div className="bg-gray-50">
  //               <img
  //                 src={`${process.env.NEXT_PUBLIC_API}uploaded${checkAndAddLeadingSlash(cdi[0]?.[4])}`}
  //                 alt={cdi[0]?.[2]}
  //                 style={{ width: "100%", height: "auto", display: "block" }}
  //               />
  //             </div>
  //           </div>
  // );
  const mapPlaceholder = (label: string, data?: string) => (
    <>
      {!data ? (
        <div
          style={{
            border: "1px dashed #999",
            backgroundColor: "#F5F5F5",
            borderRadius: "4px",
            padding: "12px",
            margin: "10px 0",
            textAlign: "center",
            minHeight: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "9pt",
            fontStyle: "italic",
          }}
        >
          {label}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50">
            <img
              src={`${DROUGHT_BASE}uploaded${data}`}
              alt={label}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      )}
    </>
  );

  const figureCaption = (content: React.ReactNode) => (
    <p
      style={{
        margin: "4px 0 10px 0",
        fontSize: "8.5pt",
        fontStyle: "italic",
        color: "#444",
        lineHeight: "1.5",
      }}
    >
      {content}
    </p>
  );

  const tdStyle: React.CSSProperties = {
    padding: "4px 8px",
    border: "1px solid #ddd",
  };
  const thStyle: React.CSSProperties = {
    padding: "5px 8px",
    textAlign: "left",
    border: "1px solid #555",
  };

  const tableWrap: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "9pt",
    margin: "8px 0",
  };

  const rowBg = (i: number) => ({
    backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#fff",
  });

  // ── Drought table ───────────────────────────────────────────────────────────

  const droughtLevels = [
    {
      label: "Extreme",
      count: drought.extremeCount,
      districts: drought.extremeDistricts,
    },
    {
      label: "Severe",
      count: drought.severeCount,
      districts: drought.severeDistricts,
    },
    { label: "Moderate", count: drought.moderateCount, districts: [] },
    { label: "Mild", count: drought.mildCount, districts: [] },
    { label: "Normal", count: drought.normalCount, districts: [] },
  ];

  const droughtTable = (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "34%" }}>Drought Condition</th>
          <th style={{ ...thStyle, width: "22%" }}>Number of Districts</th>
          <th style={thStyle}>District List</th>
        </tr>
      </thead>
      <tbody>
        {droughtLevels.map(({ label, count, districts }, i) => (
          <tr key={label} style={rowBg(i)}>
            <td style={{ ...tdStyle, fontWeight: "500" }}>{label}</td>
            <td style={tdStyle}>{count > 0 ? count : "0"}</td>
            <td style={{ ...tdStyle, lineHeight: "1.6" }}>
              {districts.length > 0
                ? districts.join(", ")
                : count > 0
                  ? ph("district names not available")
                  : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ── Rainfall table (top 10 districts) ──────────────────────────────────────

  const rainfallRows: RainfallDistrict[] =
    forecast?.forecast_highlights?.rainfall_forecasts?.slice(0, 10) ?? [];

  const rainfallTable = rainfallRows.length ? (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "50%" }}>District</th>
          <th style={thStyle}>Forecast Rainfall (7-day cumulative)</th>
        </tr>
      </thead>
      <tbody>
        {rainfallRows.map((r, i) => (
          <tr key={r.district_id} style={rowBg(i)}>
            <td style={tdStyle}>{r.district}</td>
            <td style={tdStyle}>{fmt.mm(r.forecast_rainfall_mm)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "50%" }}>District</th>
          <th style={thStyle}>Forecast Rainfall (7-day cumulative)</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={i} style={rowBg(i)}>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ── Temperature table (top 10 districts) ───────────────────────────────────

  const tempRows: TemperatureDistrict[] =
    forecast?.temperature_forecast?.temperature_forecasts?.slice(0, 10) ?? [];

  const temperatureTable = tempRows.length ? (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "50%" }}>District</th>
          <th style={thStyle}>Forecast Mean Temperature</th>
        </tr>
      </thead>
      <tbody>
        {tempRows.map((r, i) => (
          <tr key={r.district_id} style={rowBg(i)}>
            <td style={tdStyle}>{r.district}</td>
            <td style={tdStyle}>{fmt.temp(r.forecast_mean_temperature_c)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "50%" }}>District</th>
          <th style={thStyle}>Forecast Mean Temperature</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={i} style={rowBg(i)}>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ── Flood discharge table ───────────────────────────────────────────────────

  const floodRows: FloodBasinSummary[] =
    forecast?.flood_forecast?.discharge_summary ?? [];

  const floodTable = floodRows.length ? (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "30%" }}>River Basin</th>
          <th style={thStyle}>Expected Discharge (m³/s)</th>
          <th style={thStyle}>Flood Risk Level</th>
          <th style={thStyle}>Flood Extent (km²)</th>
          <th style={thStyle}>Affected Buildings</th>
        </tr>
      </thead>
      <tbody>
        {floodRows.map((r, i) => (
          <tr key={r.river_basin_id} style={rowBg(i)}>
            <td style={{ ...tdStyle, fontWeight: "500" }}>{r.river_basin}</td>
            <td style={tdStyle}>{fmt.m3s(r.expected_discharge_m3s)}</td>
            <td style={{ ...tdStyle, textTransform: "capitalize" }}>
              {r.flood_risk_level}
            </td>
            <td style={tdStyle}>{fmt.km2(r.flood_extent_km2)}</td>
            <td style={tdStyle}>{fmt.num(r.affected_buildings)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <table style={tableWrap}>
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th style={{ ...thStyle, width: "50%" }}>River Basin</th>
          <th style={thStyle}>Expected Discharge</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, i) => (
          <tr key={i} style={rowBg(i)}>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
            <td style={{ ...tdStyle, color: "#aaa" }}>&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ── Derived values from forecast ────────────────────────────────────────────

  const rs = forecast?.review_summary;
  const fh = forecast?.forecast_highlights;
  const tf = forecast?.temperature_forecast;
  const ff = forecast?.flood_forecast;
  const ia = forecast?.impact_assessment;
  const dates = forecast?.source_dates;

  const validFrom = forecast?.valid_from ? fmt.date(forecast.valid_from) : null;
  const validTo = forecast?.valid_to ? fmt.date(forecast.valid_to) : null;

  const rainfallMin = rs?.rainfall_range?.minimum_mm;
  const rainfallMax = rs?.rainfall_range?.maximum_mm;
  const topRainfallDistricts = rs?.highest_rainfall_districts
    ?.map((d) => d.district)
    .join(", ");
  const riverName = rs?.river_monitoring?.river_name_with_the_most_discharge;
  const riverTrend = rs?.river_monitoring?.river_trend;

  const higherRainfallAreas = fh?.higher_rainfall_areas?.join(", ");
  const tempMin = tf?.min_temperature_range;
  const tempMax = tf?.max_temperature_range;
  const tempMinDst = tf?.district_to_experience_minimum_range;
  const tempMaxDst = tf?.district_to_experience_maximum_range;

  const floodRiverName = ff?.river_name;
  const floodCondition = ff?.river_condition;
  const floodRiskLevel = ia?.flood_risk_level;
  const floodLocations = ia?.flood_risk_locations?.join(", ");
  const affectedPop = ia?.potentially_affected_population;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="bulletin-report"
      style={{
        width: "210mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        padding: 0,
        margin: "0 auto",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid #1a1a1a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/fao_logo_3lines_en1.png"
            alt="FAO"
            style={{ height: "48px", objectFit: "contain" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            style={{
              border: "1px dashed #999",
              padding: "6px 12px",
              fontSize: "8pt",
              color: "#888",
              fontStyle: "italic",
              borderRadius: "3px",
            }}
          >
            {"{Ministry of Environment Logo}"}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "15pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            UGANDA WEEKLY WEATHER FORECAST
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "9pt", color: "#333" }}>
            Valid From {validFrom} to {validTo}
          </p>
          <p style={{ margin: "2px 0 0 0", fontSize: "8pt", color: "#666" }}>
            Bulletin #{bulletinId}
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}

      {drought?.cdi_image?.length === 0 || !forecast ? (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm`}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"></div>
            <p className={"text-slate-600"}>Loading...</p>
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px 20px 24px 20px" }}>
          {sectionHeading("Monthly and Weekly Weather Forecast")}

          {/* ── Review Summary ── */}
          {sectionHeading("Review Summary")}

          {bullet(
            <>
              During the review period, rainfall conditions ranged from{" "}
              {rainfallMin != null && rainfallMax != null ? (
                <strong>
                  {fmt.mm(rainfallMin)} – {fmt.mm(rainfallMax)}
                </strong>
              ) : (
                ph("{minimum rainfall – maximum rainfall}")
              )}{" "}
              across Uganda, with notable observations in{" "}
              {topRainfallDistricts ? (
                <strong>{topRainfallDistricts}</strong>
              ) : (
                ph("{districts that received highest rainfall}")
              )}
              .
            </>,
          )}

          {bullet(
            rs?.rainfall_distribution_summary ? (
              <>{rs.rainfall_distribution_summary}</>
            ) : (
              <>
                Rainfall distribution varied across locations, with differences
                observed in intensity, duration, and spatial coverage.
              </>
            ),
          )}

          {bullet(
            <>
              River monitoring indicated that{" "}
              {riverName ? (
                <strong>{riverName}</strong>
              ) : (
                ph("{river_name_with_the_most_discharge}")
              )}{" "}
              experienced{" "}
              {riverTrend ? (
                <strong>{fmt.cap(riverTrend)} conditions</strong>
              ) : (
                ph("{river_trend}")
              )}
              .
            </>,
          )}

          {bullet(
            <>
              Across the districts as at{" "}
              <strong>
                {drought.month} {drought.year}
              </strong>
              , the drought conditions were:
            </>,
          )}

          {droughtTable}
          {mapPlaceholder("{add main CDI map}", drought?.cdi_image[4])}

          {/* ── Forecast Highlights ── */}
          {sectionHeading("Forecast Highlights")}

          {/* Rainfall */}
          {subHeading("Rainfall Forecasts")}

          {bullet(
            <>
              According to NOAA-NCEP GFS and Icosahedral Nonhydrostatic (ICON),
              pockets of light rainfall are expected over Uganda. Rainfall is
              forecasted to range from{" "}
              {fh?.rainfall_forecast_range?.minimum_mm != null &&
              fh?.rainfall_forecast_range?.maximum_mm != null ? (
                <strong>
                  {fmt.mm(fh.rainfall_forecast_range.minimum_mm)} –{" "}
                  {fmt.mm(fh.rainfall_forecast_range.maximum_mm)}
                </strong>
              ) : (
                ph("{min – max rainfall range)")
              )}{" "}
              across districts.
            </>,
          )}

          {rainfallTable}

          {mapPlaceholder("{add_rainfall_forecast_map}")}

          {figureCaption(
            <>
              <strong>Figure 1:</strong> Spatial distribution of forecast
              rainfall across Uganda, valid {validFrom ?? ph("{start_date}")} to{" "}
              {validTo ?? ph("{end_date}")}.
            </>,
          )}

          {bullet(
            <>
              Higher rainfall accumulations are forecast in{" "}
              {higherRainfallAreas ? (
                <strong>{higherRainfallAreas}</strong>
              ) : (
                ph("{higher_rainfall_areas}")
              )}
              .
            </>,
          )}

          {/* Temperature */}
          {subHeading("Temperature Forecasts")}

          {bullet(
            <>
              Temperature conditions are expected to range from{" "}
              {tempMin != null ? (
                <strong>{fmt.temp(tempMin)}</strong>
              ) : (
                ph("{min_temperature_range}")
              )}{" "}
              recorded at{" "}
              {tempMinDst ? (
                <strong>{tempMinDst}</strong>
              ) : (
                ph("{district_to_experience_minimum_range}")
              )}{" "}
              to{" "}
              {tempMax != null ? (
                <strong>{fmt.temp(tempMax)}</strong>
              ) : (
                ph("{max_temperature_range}")
              )}{" "}
              recorded at{" "}
              {tempMaxDst ? (
                <strong>{tempMaxDst}</strong>
              ) : (
                ph("{district_to_experience_maximum_range}")
              )}
              .
            </>,
          )}

          {temperatureTable}

          {mapPlaceholder("{add_temperature_distribution_mean_forecast_map}")}

          {figureCaption(
            <>
              <strong>Figure 2:</strong> Spatial distribution of forecast mean
              temperature across Uganda, valid {validFrom ?? ph("{start_date}")}{" "}
              to {validTo ?? ph("{end_date}")}.
            </>,
          )}

          {/* Floods */}
          {subHeading("Floods Forecast")}

          {bullet(
            <>
              River conditions in{" "}
              {floodRiverName ? (
                <strong>{floodRiverName}</strong>
              ) : (
                ph("{river_name}")
              )}{" "}
              are expected to remain{" "}
              {floodCondition ? (
                <strong>{fmt.cap(floodCondition)}</strong>
              ) : (
                ph("{river_condition}")
              )}
              . The discharge levels are summarized below:
            </>,
          )}

          {floodTable}

          {/* Impact Assessment */}
          {subHeading("Impact Assessment")}

          <p style={{ margin: "6px 0", fontSize: "10pt", lineHeight: "1.6" }}>
            <strong>Flood Risk:</strong> Flood risk conditions are assessed as{" "}
            {floodRiskLevel ? (
              <strong style={{ textTransform: "capitalize" }}>
                {floodRiskLevel}
              </strong>
            ) : (
              ph("{flood_risk_level}")
            )}{" "}
            in areas associated with{" "}
            {floodLocations ? (
              <strong>{floodLocations}</strong>
            ) : (
              ph("{flood_risk_locations}")
            )}
            . Estimated exposure includes{" "}
            {affectedPop != null ? (
              <strong>{fmt.num(affectedPop)} people</strong>
            ) : (
              ph("{potentially_affected_population}")
            )}
            . The following is the basin-level impact on potential floods.
          </p>

          {/* Basin-level impact table */}
          {ia?.basin_level_flood_impact?.length ? (
            <table style={tableWrap}>
              <thead>
                <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                  <th style={{ ...thStyle, width: "28%" }}>River Basin</th>
                  <th style={thStyle}>Risk Level</th>
                  <th style={thStyle}>Flood Extent (km²)</th>
                  <th style={thStyle}>Roads (km)</th>
                  <th style={thStyle}>Buildings</th>
                </tr>
              </thead>
              <tbody>
                {ia.basin_level_flood_impact.map((b, i) => (
                  <tr key={b.river_basin_id} style={rowBg(i)}>
                    <td style={{ ...tdStyle, fontWeight: "500" }}>
                      {b.river_basin}
                    </td>
                    <td style={{ ...tdStyle, textTransform: "capitalize" }}>
                      {b.flood_risk_level}
                    </td>
                    <td style={tdStyle}>{fmt.km2(b.flood_extent_km2)}</td>
                    <td style={tdStyle}>{fmt.km(b.affected_roads_km)}</td>
                    <td style={tdStyle}>{fmt.num(b.affected_buildings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            mapPlaceholder(
              "{add the basin level aggregation of the flood impact}",
            )
          )}

          {/* Issue / validity dates */}
          {dates && (
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "8.5pt",
                color: "#555",
                fontStyle: "italic",
              }}
            >
              Weather issue date: {fmt.date(dates.weather_issue_date)}{" "}
              &nbsp;|&nbsp; Flood forecast date:{" "}
              {fmt.date(dates.flood_forecast_date)}
            </p>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "2px solid #1a1a1a",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <img
          src="/fao_logo_3lines_en1.png"
          alt="FAO"
          style={{ height: "32px", objectFit: "contain" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          style={{
            border: "1px dashed #bbb",
            padding: "6px 16px",
            fontSize: "8pt",
            color: "#888",
            fontStyle: "italic",
            borderRadius: "3px",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          {"{add partner logos}"}
        </div>
      </div>

      <style>{`
        @media print {
          .bulletin-report { width: 210mm; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 10mm; }
        }
      `}</style>
    </div>
  );
};
