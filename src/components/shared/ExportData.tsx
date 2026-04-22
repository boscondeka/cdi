import { weatherAPI } from "@/services/api";
import { Download } from "lucide-react";
import React, { useState } from "react";

const ExportData = () => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownloadTableData = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setDownloadLoading(true);
    try {
      const filename = "weather forecast.xlsx";

      const response = await weatherAPI.getExportData();

      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setDownloadLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      <button
        className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-white transition-colors"
        onClick={handleDownloadTableData}
      >
        <Download className="w-3 h-3" />
        <span className="hidden sm:inline">
          {downloadLoading ? "Downloading..." : "Export"}
        </span>
      </button>
    </div>
  );
};

export default ExportData;
