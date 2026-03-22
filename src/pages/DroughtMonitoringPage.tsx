import { useState } from 'react';

interface DroughtMonitoringPageProps {
  isDarkMode?: boolean;
}

export default function DroughtMonitoringPage({ isDarkMode = true }: DroughtMonitoringPageProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="fixed inset-0 pt-16 z-10">
      {/* Loading spinner */}
      {!iframeLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading CDI Map...</p>
          </div>
        </div>
      )}
      
      {/* Embedded CDI iframe - takes full page */}
      <iframe
        src="https://cdi.rosewillbome.space"
        className="w-full h-full border-0"
        title="CDI Drought Monitoring System"
        onLoad={() => setIframeLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
