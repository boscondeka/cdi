import { Cloud, Sun, CloudRain, CloudLightning } from "lucide-react";

export const getWeatherIcon = (type?: string, className = "w-8 h-8") => {
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

export const EmptyState = ({
  icon: Icon,
  message,
  isDarkMode,
  className = "",
}: {
  icon: React.ElementType;
  message: string;
  isDarkMode: boolean;
  className?: string;
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-lg py-6 ${isDarkMode ? "bg-slate-700/20" : "bg-slate-100"} ${className}`}
  >
    <Icon
      className={`w-6 h-6 mb-1 ${isDarkMode ? "text-slate-600" : "text-slate-300"}`}
    />
    <p
      className={`text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
    >
      {message}
    </p>
  </div>
);
