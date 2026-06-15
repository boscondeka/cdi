import React from "react";

interface BulletinReportProps {
  date?: Date;
  bulletinNumber?: string;
  isDarkMode?: boolean;
}

export const BulletinReport: React.FC<BulletinReportProps> = ({
  date = new Date(),
  bulletinNumber,
  // isDarkMode = false,
}) => {
  const bulletinId =
    bulletinNumber ||
    `UGA-MH-${date.getFullYear()}-${String(Math.floor(date.getTime() / 86400000)).slice(-3)}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="bulletin-report"
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.4",
        padding: 0,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#318DDE",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src="/fao-white.png"
            alt="FAO"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </div>
        <div style={{ textAlign: "right", color: "#ffffff" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "16pt",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            UGANDA MULTI-HAZARD
          </h1>
          <h2
            style={{
              margin: "2px 0 0 0",
              fontSize: "14pt",
              fontWeight: "bold",
            }}
          >
            EARLY WARNING BULLETIN
          </h2>
          <p style={{ margin: "8px 0 0 0", fontSize: "9pt" }}>
            {formattedDate} | Bulletin #{bulletinId}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px" }}>
        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          {/* Weather Situation and Forecast */}
          <div
            style={{
              backgroundColor: "#E8F4FD",
              padding: "12px",
              borderLeft: "4px solid #318DDE",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#318DDE",
                textTransform: "uppercase",
              }}
            >
              Review Summary:
            </h3>
            <div style={{ fontSize: "9pt", lineHeight: "1.5" }}>
              <ul style={{ margin: "0", paddingLeft: "18px" }}>
                <li>
                  The past week recorded "heavy" to "moderate" rainfall across
                  "northern, southern, central, eastern" regions, particularly
                  "districts".
                </li>
                <li>
                  but intense and short-lived in others, reflecting high
                  temporal variability
                </li>
                <li>
                  The "River" showed a sustained rise with downstream
                  propagation, while the "River" remained generally stable to
                  slightly decline
                </li>
                <li>
                  As at the last assessment in "month/year", drought conditions
                  improved across "number of districts", but moderate to severe
                  drought persists in "number of districts", especially
                  "district where drought is severe"
                </li>
                <li>
                  Field reports indicate partial recovery in some areas, but
                  continued water, pasture, and livelihood stress in "district
                  with sustained severe over 3 months"
                </li>
              </ul>
            </div>
          </div>

          {/* Agrometeorological / Drought Situation */}
          <div
            style={{
              backgroundColor: "#FFF3E0",
              padding: "12px",
              borderLeft: "4px solid #FF9800",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#FF9800",
                textTransform: "uppercase",
              }}
            >
              Forecast Highlight:
            </h3>
            <div style={{ fontSize: "9pt", lineHeight: "1.5" }}>
              <ul style={{ margin: "0", paddingLeft: "18px" }}>
                <li>
                  "Light" to "moderate" rain is expected over parts of "list
                  first 5 districts in the north" in Uganda and localized areas
                  in the "list first 5 districts in central Uganda", while dry
                  conditions dominate "5 districts that will receive minimum
                  rainfall".
                </li>
                <li>
                  "High/Moderate/Low" temperatures "Minimum–Maximum °C" will
                  persist across much of "northern, central and southern"
                  Uganda, increasing evapotranspiration and moisture stress
                </li>
                <li>
                  "River name check on the discharge levels in floods" River
                  levels remain elevated and propagating downstream, posing a
                  risk of localized flooding if additional upstream and local
                  rainfall occurs
                </li>
                <li>
                  • Rainfall is expected to result in localized improvements,
                  but recovery will remain uneven, particularly in "list 5
                  districts with worse droughts" drought-affected areas
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#E1F5FE",
            padding: "12px",
            marginBottom: "15px",
            borderLeft: "4px solid #06B6D4",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#06B6D4",
              textTransform: "uppercase",
            }}
          >
            Review of Observed Seasonal and Weekly Weather Conditions and
            Experienced Impacts
          </h3>
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
            Districts on Flood Watch:
          </p>
          <div style={{ fontSize: "9pt", lineHeight: "1.5" }}>
            <p style={{ margin: "0 0 10px 0" }}>
              During the week between "start Date" and "End Date" (Figure 1),
              "heavy rainfall" above 100 mm was observed at "list station names
              (mm recorded)/no rainfall above 100 mm was recorded at any
              station". Moderate rains of above 50 mm were recorded at "list
              station names (mm recorded)". Light rains above 30 mm were
              received at "list station names (mm recorded)".
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              Over the week, of the "total number of districts in Uganda",
              "number of districts that received rainfall". The "rainfall was
              well distributed = if districts in the north, central and southern
              region received rainfall"
            </p>
          </div>
        </div>

        {/* Rainfall Chart Placeholder */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "4px",
            border: "1px solid #E0E0E0",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#424242",
            }}
          >
            Cumulative Rainfall by District (Last 30 Days)
          </h3>
          <div
            style={{
              height: "180px",
              backgroundColor: "#ffffff",
              border: "1px solid #E0E0E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9E9E9E",
              fontSize: "9pt",
            }}
          >
            [Bar Chart: Rainfall data visualization]
          </div>
          <p style={{ fontSize: "8pt", color: "#757575", margin: "8px 0 0 0" }}>
            Source: UNMA Weather Stations Network | Data as of {formattedDate}
          </p>
        </div>

        {/* ── Weekly Weather Forecast Section ── */}
        <div style={{ marginBottom: "15px" }}>
          {/* Section title */}
          <div
            style={{
              backgroundColor: "#318DDE",
              padding: "8px 12px",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Monthly and Weekly Weather Forecast
            </h2>
          </div>

          {/* ── Rainfall Forecast ── */}
          <div style={{ marginBottom: "14px" }}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#1565C0",
                borderBottom: "2px solid #1565C0",
                paddingBottom: "4px",
              }}
            >
              Rainfall Forecast for Period 14 to 20 April 2026
            </h3>

            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "9pt",
                lineHeight: "1.6",
              }}
            >
              According to NOAA-NCEP GFS and Icosahedral Nonhydrostatic (ICON),
              pockets of light rainfall are expected over{" "}
              <span
                style={{
                  backgroundColor: "#BBDEFB",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [# districts – Northern]
              </span>{" "}
              districts in the Northern region,{" "}
              <span
                style={{
                  backgroundColor: "#BBDEFB",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [# districts – Central]
              </span>{" "}
              in Central, and{" "}
              <span
                style={{
                  backgroundColor: "#BBDEFB",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [# districts – Southern]
              </span>{" "}
              in Southern Uganda (Figure 6). These light rains are also possible
              over very scattered areas in the districts listed below.
            </p>

            {/* Scattered-rain districts table */}
            <div style={{ marginBottom: "10px" }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "9pt",
                  fontWeight: "bold",
                }}
              >
                Districts with Scattered Light Rains Expected:
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "8.5pt",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1565C0", color: "#ffffff" }}>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #90CAF9",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #90CAF9",
                      }}
                    >
                      District
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #90CAF9",
                      }}
                    >
                      Region
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #90CAF9",
                      }}
                    >
                      Expected Rainfall (mm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#E3F2FD" : "#ffffff",
                      }}
                    >
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #BBDEFB",
                        }}
                      >
                        {i}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #BBDEFB",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [District name]
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #BBDEFB",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [Region]
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #BBDEFB",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [Range]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "9pt",
                lineHeight: "1.6",
              }}
            >
              Dry conditions are likely over most other areas. Districts
              expected to remain dry are listed below, along with cumulative
              total estimates.
            </p>

            {/* Dry districts table */}
            <div style={{ marginBottom: "10px" }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "9pt",
                  fontWeight: "bold",
                }}
              >
                Districts with Dry Conditions Expected:
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "8.5pt",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#E65100", color: "#ffffff" }}>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #FFCCBC",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #FFCCBC",
                      }}
                    >
                      District
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #FFCCBC",
                      }}
                    >
                      Region
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        textAlign: "left",
                        border: "1px solid #FFCCBC",
                      }}
                    >
                      Cumulative Total Estimate (mm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#FBE9E7" : "#ffffff",
                      }}
                    >
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #FFCCBC",
                        }}
                      >
                        {i}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #FFCCBC",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [District name]
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #FFCCBC",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [Region]
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #FFCCBC",
                          color: "#9E9E9E",
                          fontStyle: "italic",
                        }}
                      >
                        [Estimate]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "9pt",
                lineHeight: "1.6",
              }}
            >
              The rains over{" "}
              <span
                style={{
                  backgroundColor: "#BBDEFB",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [districts with rainfall above 50 mm]
              </span>{" "}
              may cumulate to over 50 mm by the end of the forecast week.
            </p>

            {/* Rainfall map placeholder */}
            <div
              style={{
                backgroundColor: "#F5F5F5",
                border: "1px dashed #90CAF9",
                borderRadius: "4px",
                padding: "12px",
                textAlign: "center",
                marginBottom: "4px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "9pt",
                  color: "#757575",
                  fontStyle: "italic",
                }}
              >
                📍 Figure 6: Map – Cumulative Rainfall Total Forecast
              </p>
              <div
                style={{
                  height: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#BDBDBD",
                  fontSize: "8pt",
                }}
              >
                [Insert rainfall cumulative total forecast map here]
              </div>
            </div>
          </div>

          {/* ── Temperature Forecast ── */}
          <div style={{ marginBottom: "14px" }}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#B71C1C",
                borderBottom: "2px solid #B71C1C",
                paddingBottom: "4px",
              }}
            >
              Temperature Forecast
            </h3>

            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "9pt",
                lineHeight: "1.6",
              }}
            >
              According to NOAA-NCEP GFS, hot conditions (35–40°C) dominate in{" "}
              <span
                style={{
                  backgroundColor: "#FFCDD2",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [districts with temperature above 35°C]
              </span>
              , while{" "}
              <span
                style={{
                  backgroundColor: "#FFCDD2",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [districts with 30–35°C]
              </span>{" "}
              remain slightly cooler (30–35°C). The spatial variation of maximum
              temperatures is as follows (Figure 7):
            </p>

            {/* Max temperature breakdown */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "8.5pt",
                marginBottom: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#B71C1C", color: "#ffffff" }}>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                      width: "25%",
                    }}
                  >
                    Max Temp Range
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                      width: "25%",
                    }}
                  >
                    Classification
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                    }}
                  >
                    Districts / Areas
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "35–40 °C", label: "Moderately High" },
                  { range: "30–35 °C", label: "High" },
                  { range: "25–30 °C", label: "Moderate" },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFEBEE" : "#ffffff",
                    }}
                  >
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                        fontWeight: "bold",
                      }}
                    >
                      {row.range}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                        color: "#9E9E9E",
                        fontStyle: "italic",
                      }}
                    >
                      [Insert districts / areas]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Rainfall map placeholder – Figure 7 */}
            <div
              style={{
                backgroundColor: "#F5F5F5",
                border: "1px dashed #FFCDD2",
                borderRadius: "4px",
                padding: "12px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "9pt",
                  color: "#757575",
                  fontStyle: "italic",
                }}
              >
                🌡️ Figure 7: Map – Maximum Temperature Distribution
              </p>
              <div
                style={{
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#BDBDBD",
                  fontSize: "8pt",
                }}
              >
                [Insert maximum temperature distribution map here]
              </div>
            </div>

            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "9pt",
                lineHeight: "1.6",
              }}
            >
              Night-time temperatures are expected to remain warm (25–30°C)
              across{" "}
              <span
                style={{
                  backgroundColor: "#FFCDD2",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [districts]
              </span>
              , with moderate conditions (20–25°C) prevailing elsewhere and only
              localized cooler conditions over{" "}
              <span
                style={{
                  backgroundColor: "#FFCDD2",
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontStyle: "italic",
                }}
              >
                [districts]
              </span>
              . The spatial variation of minimum temperatures is as follows
              (Figure 8):
            </p>

            {/* Min temperature breakdown */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "8.5pt",
                marginBottom: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#E53935", color: "#ffffff" }}>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                      width: "25%",
                    }}
                  >
                    Min Temp Range
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                      width: "25%",
                    }}
                  >
                    Classification
                  </th>
                  <th
                    style={{
                      padding: "5px 8px",
                      textAlign: "left",
                      border: "1px solid #FFCDD2",
                    }}
                  >
                    Districts / Areas
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "25–30 °C", label: "High (Warm nights)" },
                  { range: "20–25 °C", label: "Moderately High" },
                  { range: "15–20 °C", label: "Moderate" },
                  { range: "< 15 °C", label: "Cool (Highlands)" },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFEBEE" : "#ffffff",
                    }}
                  >
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                        fontWeight: "bold",
                      }}
                    >
                      {row.range}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #FFCDD2",
                        color: "#9E9E9E",
                        fontStyle: "italic",
                      }}
                    >
                      [Insert districts / areas]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Temperature map placeholder – Figure 8 */}
            <div
              style={{
                backgroundColor: "#F5F5F5",
                border: "1px dashed #FFCDD2",
                borderRadius: "4px",
                padding: "12px",
                textAlign: "center",
                marginBottom: "4px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "9pt",
                  color: "#757575",
                  fontStyle: "italic",
                }}
              >
                🌡️ Figure 8: Map – Minimum Temperature Distribution
              </p>
              <div
                style={{
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#BDBDBD",
                  fontSize: "8pt",
                }}
              >
                [Insert minimum temperature distribution map here]
              </div>
            </div>
          </div>

          {/* ── Impacts Section ── */}
          <div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#1B5E20",
                borderBottom: "2px solid #1B5E20",
                paddingBottom: "4px",
              }}
            >
              Impacts Associated with the Weekly Weather Forecast
            </h3>

            {/* Impact items */}
            {[
              {
                icon: "🌵",
                title: "Drought",
                color: "#E65100",
                bg: "#FFF3E0",
                border: "#FF9800",
                body: (
                  <>
                    Drought conditions are expected to continue easing in{" "}
                    <span
                      style={{
                        backgroundColor: "#FFE0B2",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      [districts]
                    </span>{" "}
                    due to recent and forecast rains. However, moderate to
                    severe drought will likely persist across{" "}
                    <span
                      style={{
                        backgroundColor: "#FFE0B2",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      [districts]
                    </span>
                    , where rainfall remains limited, uneven, or delayed.
                  </>
                ),
              },
              {
                icon: "💧",
                title: "Water and Pasture",
                color: "#0277BD",
                bg: "#E1F5FE",
                border: "#03A9F4",
                body: (
                  <>
                    Forecast rains are likely to support localized regeneration
                    of pasture, browse, and surface water, especially in{" "}
                    <span
                      style={{
                        backgroundColor: "#B3E5FC",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      [districts]
                    </span>
                    .
                  </>
                ),
              },
              {
                icon: "🌊",
                title: "Flood Risk",
                color: "#1565C0",
                bg: "#E3F2FD",
                border: "#1976D2",
                body: (
                  <>
                    Although river levels remain at{" "}
                    <span
                      style={{
                        backgroundColor: "#BBDEFB",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      [moderate]
                    </span>{" "}
                    flood thresholds, the sustained rise and downstream
                    propagation requires continued monitoring. Potential
                    affected persons are summarised in the table below.
                    {/* Flood affected persons table */}
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "8.5pt",
                        marginTop: "8px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#1565C0",
                            color: "#ffffff",
                          }}
                        >
                          <th
                            style={{
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "1px solid #BBDEFB",
                            }}
                          >
                            River / Area
                          </th>
                          <th
                            style={{
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "1px solid #BBDEFB",
                            }}
                          >
                            District
                          </th>
                          <th
                            style={{
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "1px solid #BBDEFB",
                            }}
                          >
                            Risk Level
                          </th>
                          <th
                            style={{
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "1px solid #BBDEFB",
                            }}
                          >
                            Est. Persons at Risk
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((i) => (
                          <tr
                            key={i}
                            style={{
                              backgroundColor:
                                i % 2 === 0 ? "#E3F2FD" : "#ffffff",
                            }}
                          >
                            {[
                              "[River/Area]",
                              "[District]",
                              "[Low/Med/High]",
                              "[Number]",
                            ].map((cell, j) => (
                              <td
                                key={j}
                                style={{
                                  padding: "4px 8px",
                                  border: "1px solid #BBDEFB",
                                  color: "#9E9E9E",
                                  fontStyle: "italic",
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ),
              },
              {
                icon: "🌡️",
                title: "Heat Stress",
                color: "#B71C1C",
                bg: "#FFEBEE",
                border: "#EF5350",
                body: (
                  <>
                    Persistently high daytime (35–40°C) and warm nighttime
                    temperatures (25–30°C) across{" "}
                    <span
                      style={{
                        backgroundColor: "#FFCDD2",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        fontStyle: "italic",
                      }}
                    >
                      [districts]
                    </span>{" "}
                    are expected to increase heat stress on humans and
                    livestock, accelerate evapotranspiration, and limit soil
                    moisture recovery, especially in drought-affected areas.
                  </>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: item.bg,
                  borderLeft: `4px solid ${item.border}`,
                  padding: "10px 12px",
                  marginBottom: "8px",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "9.5pt",
                    fontWeight: "bold",
                    color: item.color,
                  }}
                >
                  {item.icon} {item.title}
                </p>
                <p style={{ margin: 0, fontSize: "9pt", lineHeight: "1.6" }}>
                  {item.body}
                </p>
              </div>
            ))}

            {/* Agriculture – only shown during MAM / OND seasons */}
            {(() => {
              const month = date.getMonth() + 1; // 1-indexed
              const isMAM = month >= 3 && month <= 5;
              const isOND = month >= 10 && month <= 12;
              if (!isMAM && !isOND) return null;
              return (
                <div
                  style={{
                    backgroundColor: "#F1F8E9",
                    borderLeft: "4px solid #7CB342",
                    padding: "10px 12px",
                    marginBottom: "8px",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "9.5pt",
                      fontWeight: "bold",
                      color: "#33691E",
                    }}
                  >
                    🌾 Agriculture and Livelihoods{" "}
                    <span
                      style={{
                        fontSize: "8pt",
                        fontWeight: "normal",
                        color: "#558B2F",
                      }}
                    >
                      ({isMAM ? "MAM" : "OND"} Season)
                    </span>
                  </p>
                  <p style={{ margin: 0, fontSize: "9pt", lineHeight: "1.6" }}>
                    Light to moderate rains will support ongoing agricultural
                    activities, including weeding and staggered planting in some
                    areas. However, the season remains shortened and highly
                    uncertain, with uneven rainfall distribution, crop pests,
                    livestock disease, and weakened household resilience likely
                    to constrain recovery. Livelihood recovery therefore remains
                    slow, cautious, and spatially uneven.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#F5F5F5",
          padding: "12px 20px",
          borderTop: "3px solid #318DDE",
          fontSize: "8pt",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
            Contact Information:
          </p>
          <p style={{ margin: 0 }}>
            Food and Agriculture Organization of the United Nations (FAO) Uganda
            | Uganda National Meteorological Authority (UNMA) | Office of the
            Prime Minister - Department of Disaster Preparedness
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <img
              src="/fao_logo_3lines_en1.png"
              alt="FAO"
              style={{ height: "30px" }}
            />
            <div style={{ fontSize: "7pt", color: "#757575" }}>
              <p style={{ margin: 0 }}>Supported by:</p>
              <p style={{ margin: 0 }}>EU, UK Aid, Canada, Sweden</p>
            </div>
          </div>
          <div
            style={{ textAlign: "right", fontSize: "7pt", color: "#757575" }}
          >
            <p style={{ margin: 0 }}>
              <strong>Validity:</strong> 24 hours from issue time
            </p>
            <p style={{ margin: 0 }}>
              <strong>Next Update:</strong>{" "}
              {new Date(date.getTime() + 86400000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .bulletin-report {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            page-break-after: always;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};
