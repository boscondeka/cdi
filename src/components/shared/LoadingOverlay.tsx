import { useTheme } from '../../hooks/useTheme';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  accentColor?: string;
}

/**
 * Reusable loading overlay component
 * Displays a centered loading spinner with optional message
 */
export function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  accentColor = '#318DDE',
}: LoadingOverlayProps) {
  const { isDarkMode } = useTheme();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${isDarkMode ? 'bg-slate-900/90' : 'bg-white/90'} backdrop-blur-sm`}
    >
      <div className="text-center">
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{
            borderColor: `${accentColor}30`,
            borderTopColor: accentColor,
          }}
        />
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
          {message}
        </p>
      </div>
    </div>
  );
}
