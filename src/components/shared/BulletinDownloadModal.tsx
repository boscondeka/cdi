import React, { useRef, useState } from "react";
import { X, Download } from "lucide-react";
import { BulletinReport } from "./BulletinReport";
import ReactDOMServer from "react-dom/server";
import type { WeatherForecastData } from "@/hooks/useWeatherForecast";

interface BulletinDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  drought: any;
  forecast?: WeatherForecastData | null;
}

export const BulletinDownloadModal: React.FC<BulletinDownloadModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
  drought,
  forecast,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  /**
   * Renders the BulletinReport to a static HTML string, opens it in a hidden
   * print window, and triggers the browser's native Save as PDF dialogs.
   *
   * This approach:
   *  - Never produces a blank page (no canvas size limits)
   *  - Handles any report length automatically
   *  - Preserves all text, colours, and layout at full quality
   *  - Works offline (no external dependencies)
   */
  const handleDownloadPDF = () => {
    setIsDownloading(true);

    try {
      // Serialize the report to an HTML string
      const reportHtml = ReactDOMServer.renderToStaticMarkup(
        <BulletinReport drought={drought} forecast={forecast} isDarkMode={false} />,
      );

      // Collect all <style> and <link rel="stylesheet"> from the current page
      // so the print window inherits the same fonts and Tailwind classes.
      const styles = Array.from(
        document.querySelectorAll("style, link[rel='stylesheet']"),
      )
        .map((el) => el.outerHTML)
        .join("\n");

      const date = new Date();
      const filename = `Uganda_Multi-Hazard_Bulletin_${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${filename}</title>
  ${styles}
  <style>
    /* Reset body for clean print */
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Hide everything except the report when printing */
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  ${reportHtml}
  <script>
    // Wait for images/fonts to load then print
    window.onload = function () {
      setTimeout(function () {
        window.print();
        // Close the window after the print dialog is dismissed
        window.onafterprint = function () { window.close(); };
      }, 500);
    };
  </script>
</body>
</html>`;

      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        alert(
          "Pop-up was blocked. Please allow pop-ups for this site and try again.",
        );
        return;
      }

      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div
          className="relative w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            maxHeight: "90vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{
              backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
              borderColor: isDarkMode ? "#334155" : "#e2e8f0",
            }}
          >
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: isDarkMode ? "#f1f5f9" : "#0f172a" }}
              >
                Multi-Hazard Bulletin Report
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}
              >
                Preview and download the bulletin report
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#318DDE",
                  color: "#ffffff",
                }}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Generating..." : "Download PDF"}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Report Preview — scrollable in the modal */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "calc(90vh - 80px)",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div className="p-6">
              <div ref={reportRef}>
                <BulletinReport drought={drought} forecast={forecast} isDarkMode={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
};
