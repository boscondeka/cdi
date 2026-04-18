/**
 * Shared helpers for chart and data visualization components
 * Extracted from page-specific implementations
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Get the trend icon based on trend direction
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3" />;
    case 'down':
      return <TrendingDown className="w-3 h-3" />;
    default:
      return <Minus className="w-3 h-3" />;
  }
};

/**
 * Get the trend color based on trend direction and theme
 */
export const getTrendColor = (trend: 'up' | 'down' | 'stable', isDarkMode: boolean): string => {
  if (trend === 'up') return 'text-green-500';
  if (trend === 'down') return 'text-red-500';
  return isDarkMode ? 'text-slate-400' : 'text-slate-500';
};

/**
 * Get color for a metric severity level
 */
export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (severity) {
    case 'low':
      return '#22c55e'; // green
    case 'medium':
      return '#f59e0b'; // amber
    case 'high':
      return '#f97316'; // orange
    case 'critical':
      return '#ef4444'; // red
  }
};

/**
 * Format large numbers with abbreviations (k, M, B)
 */
export const formatNumber = (num: number, decimals = 1): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}k`;
  return num.toString();
};

/**
 * Get status color and label
 */
export const getStatusInfo = (
  status: 'online' | 'offline' | 'warning' | 'error'
): { color: string; label: string } => {
  switch (status) {
    case 'online':
      return { color: '#22c55e', label: 'Online' };
    case 'offline':
      return { color: '#ef4444', label: 'Offline' };
    case 'warning':
      return { color: '#f59e0b', label: 'Warning' };
    case 'error':
      return { color: '#ef4444', label: 'Error' };
  }
};

/**
 * Calculate percentage position for a value in a range
 */
export const getPercentagePosition = (value: number, min: number, max: number): number => {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/**
 * Get weather icon name based on condition
 */
export const getWeatherIcon = (
  condition: 'sun' | 'rain' | 'cloud' | 'wind' | 'storm' | 'snow'
): string => {
  const iconMap = {
    sun: '☀️',
    rain: '🌧️',
    cloud: '☁️',
    wind: '💨',
    storm: '⛈️',
    snow: '❄️',
  };
  return iconMap[condition];
};