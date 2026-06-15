import React, { useRef, useState } from "react";
import { X, Download } from "lucide-react";
import { BulletinReport } from "./BulletinReport";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BulletinDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const BulletinDownloadModal: React.FC<BulletinDownloadModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!hiddenRef.current) return;

    setIsDownloading(true);
    try {
      const element = hiddenRef.current;

      // Capture the full off-screen element (opacity:0 is fine — html2canvas still paints it)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // Tell html2canvas where the element actually is in the document,
        // so absolutely-positioned children render correctly even off-screen
        x: element.getBoundingClientRect().left + window.scrollX,
        y: element.getBoundingClientRect().top + window.scrollY,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidthMm = 210;
      const pageHeightMm = 297;

      // Browser canvas max is ~16384px on most engines. If we hit it, the canvas
      // will be blank. Guard against it — in practice scale:2 on a long report
      // can exceed this, so we warn and suggest a retry at lower scale.
      const MAX_CANVAS_PX = 16000;
      if (canvas.height > MAX_CANVAS_PX || canvas.width > MAX_CANVAS_PX) {
        console.warn(
          `Canvas size ${canvas.width}×${canvas.height}px exceeds safe limits. ` +
            "PDF may be incomplete. Consider reducing scale.",
        );
      }

      // How many canvas pixels correspond to one A4 page height
      const pageHeightPx = Math.floor(
        canvas.width * (pageHeightMm / pageWidthMm),
      );
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = page * pageHeightPx;
        const srcHeight = Math.min(pageHeightPx, canvas.height - srcY);

        // Slice just this page out of the full canvas
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcHeight;
        const ctx = sliceCanvas.getContext("2d");
        if (!ctx) continue;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          srcHeight,
          0,
          0,
          canvas.width,
          srcHeight,
        );

        const imgData = sliceCanvas.toDataURL("image/png");
        const sliceHeightMm = (srcHeight * pageWidthMm) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, sliceHeightMm);
      }

      const date = new Date();
      const filename = `Uganda_Multi-Hazard_Bulletin_${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // const handlePrint = () => {
  //   window.print();
  // };

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
              {/* <button
                onClick={handlePrint}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                }}
              >
                <Printer className="w-4 h-4" />
                Print
              </button> */}

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

          {/* Report Preview */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "calc(90vh - 80px)",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div className="p-6">
              <div ref={reportRef}>
                <BulletinReport isDarkMode={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen full-height clone used exclusively for PDF capture.
          Must NOT use visibility:hidden or display:none — html2canvas skips those.
          Pushed far off-screen with opacity:0 so it is painted but invisible. */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "210mm",
          pointerEvents: "none",
          opacity: 0,
          zIndex: -1,
        }}
      >
        <div ref={hiddenRef}>
          <BulletinReport isDarkMode={false} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          
          .bulletin-report,
          .bulletin-report * {
            visibility: visible;
          }
          
          .bulletin-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
          }
        }
      `}</style>
    </>
  );
};
