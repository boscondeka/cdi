import React from "react";

interface BulletinReportProps {
  date?: Date;
  bulletinNumber?: string;
  isDarkMode?: boolean;
}

export const BulletinReport: React.FC<BulletinReportProps> = ({
  date = new Date(),
  bulletinNumber,
}) => {
  const bulletinId =
    bulletinNumber ||
    `UGA-MH-${date.getFullYear()}-${String(Math.floor(date.getTime() / 86400000)).slice(-3)}`;

  // Yellow-highlighted placeholder span
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

  const mapPlaceholder = (label: string) => (
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

  const tableWithPlaceholders = (
    col1Header: string,
    col2Header: string,
    rows: number = 4,
  ) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "9pt",
        margin: "8px 0",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th
            style={{
              padding: "5px 8px",
              textAlign: "left",
              border: "1px solid #555",
              width: "50%",
            }}
          >
            {col1Header}
          </th>
          <th
            style={{
              padding: "5px 8px",
              textAlign: "left",
              border: "1px solid #555",
              width: "50%",
            }}
          >
            {col2Header}
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr
            key={i}
            style={{ backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#fff" }}
          >
            <td
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                color: "#aaa",
              }}
            >
              &nbsp;
            </td>
            <td
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                color: "#aaa",
              }}
            >
              &nbsp;
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const droughtTable = () => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "9pt",
        margin: "8px 0",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <th
            style={{
              padding: "5px 8px",
              textAlign: "left",
              border: "1px solid #555",
              width: "34%",
            }}
          >
            Drought Condition
          </th>
          <th
            style={{
              padding: "5px 8px",
              textAlign: "left",
              border: "1px solid #555",
              width: "22%",
            }}
          >
            {ph("{Number of Districts}")}
          </th>
          <th
            style={{
              padding: "5px 8px",
              textAlign: "left",
              border: "1px solid #555",
            }}
          >
            {ph("{District List}")}
          </th>
        </tr>
      </thead>
      <tbody>
        {["Extreme", "Severe", "Moderate", "Mild", "Normal"].map((level, i) => (
          <tr
            key={level}
            style={{ backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#fff" }}
          >
            <td
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                fontWeight: "500",
              }}
            >
              {level}
            </td>
            <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>
              &nbsp;
            </td>
            <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>
              &nbsp;
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
        {/* Left: logos */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/fao-white.png"
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

        {/* Right: bulletin title */}
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
            Valid From {ph("{Start Date}")} to {ph("{End Date}")}
          </p>
          <p style={{ margin: "2px 0 0 0", fontSize: "8pt", color: "#666" }}>
            Bulletin #{bulletinId}
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ padding: "16px 20px 24px 20px" }}>
        {sectionHeading("Monthly and Weekly Weather Forecast")}

        {/* ── Review Summary ── */}
        {sectionHeading("Review Summary")}

        {bullet(
          <>
            During the review period, rainfall conditions ranged from{" "}
            {ph("{maximum rainfall to minimum rainfall}")} across Uganda, with
            notable observations in{" "}
            {ph("{districts that received highest rainfall}")}.
          </>,
        )}
        {bullet(
          <>
            Rainfall distribution varied across locations, with differences
            observed in intensity, duration, and spatial coverage.
          </>,
        )}
        {bullet(
          <>
            River monitoring indicated that{" "}
            {ph("{river_name_with_the_most_discharge}")} experienced{" "}
            {ph("{river_trend_}")}.
          </>,
        )}
        {bullet(
          <>
            Across the districts as at {ph("{month of drought assessment}")},
            the drought conditions were:
          </>,
        )}

        {droughtTable()}
        {mapPlaceholder("{add main CDI map}")}

        {/* ── Forecast Highlights ── */}
        {sectionHeading("Forecast Highlights")}

        {/* Rainfall Forecasts */}
        {subHeading("Rainfall Forecasts")}

        {bullet(
          <>
            According to NOAA-NCEP GFS and Icosahedral Nonhydrostatic (ICON),
            pockets of light rainfall are expected over. Rainfall is forecasted
            in the following areas:
          </>,
        )}

        {tableWithPlaceholders(
          "{District}",
          "{Forecast Rainfall in mm (7 day cumulative)}",
          4,
        )}

        {mapPlaceholder("{add_rainfall_forecast_map}")}

        <p style={{ margin: "4px 0 2px 0", fontSize: "8.5pt", color: "#444" }}>
          Add chart on
        </p>
        {figureCaption(
          <>
            <strong>Figure 1:</strong> Spatial distribution of observed rainfall
            across Uganda during the period {ph("{start_date}")} to{" "}
            {ph("{end_date}")}.
          </>,
        )}

        {bullet(
          <>
            Higher rainfall accumulations are forecast in{" "}
            {ph("{higher_rainfall_areas}")}.
          </>,
        )}

        {/* Temperature Forecasts */}
        {subHeading("Temperature Forecasts")}

        {bullet(
          <>
            Temperature conditions are expected to range from{" "}
            {ph("{min_temperature_range}")} recorded at{" "}
            {ph("{district_to_experience_minimum_range}")} and{" "}
            {ph("{max_temperature_range}")} recorded at{" "}
            {ph("{district_to_experience_maximum_range}")}.
          </>,
        )}

        {tableWithPlaceholders(
          "{District}",
          "{Forecast Mean Temperature in degrees}",
          4,
        )}

        {mapPlaceholder("{add_temperature_distribution_mean_forecast_map}")}

        <p style={{ margin: "4px 0 2px 0", fontSize: "8.5pt", color: "#444" }}>
          {ph("{Add chart on}")}
        </p>
        {figureCaption(
          <>
            <strong>Figure 2:</strong> Spatial distribution of observed
            Temperature across Uganda during the period {ph("{start_date}")} to{" "}
            {ph("{end_date}")}.
          </>,
        )}

        {/* Floods Forecast */}
        {subHeading("Floods Forecast")}

        {bullet(
          <>
            River conditions in {ph("{river_name}")} are expected to remain{" "}
            {ph("{river_condition}")}. The discharge levels are summarized
            below:
          </>,
        )}

        {tableWithPlaceholders("{River Basin}", "{Expected Discharge}", 4)}

        {/* Impact Assessment */}
        {subHeading("Impact Assessment")}

        <p style={{ margin: "6px 0", fontSize: "10pt", lineHeight: "1.6" }}>
          <strong>Flood Risk:</strong> Flood risk conditions are assessed as{" "}
          {ph("{flood_risk_level}")} in areas associated with{" "}
          {ph("{flood_risk_locations}")}. Estimated exposure includes{" "}
          {ph("{potentially_affected_population}")}. The following is the basin
          level impact on potential floods.
        </p>

        {mapPlaceholder(
          "{add the basin level aggregation of the flood impact}",
        )}
      </div>

      {/* ── Footer / Partner Logos ── */}
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

      {/* Print styles */}
      <style>{`
        @media print {
          .bulletin-report {
            width: 210mm;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};
