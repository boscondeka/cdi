import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  mobileColumns?: number; // 1 column on mobile
  tabletColumns?: number; // 2 columns on tablet
  desktopColumns?: number; // 3-4 columns on desktop
  gap?: 'sm' | 'md' | 'lg'; // gap size
  className?: string;
}

/**
 * Responsive grid component that automatically adjusts columns by breakpoint
 * Replaces the need for separate mobile/desktop layout blocks
 */
export function ResponsiveGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  // Build responsive grid classes
  const gridClasses = cn(
    'grid',
    gapClasses[gap],
    {
      // Mobile: always 1 column (or custom)
      'grid-cols-1': mobileColumns === 1,
      'grid-cols-2': mobileColumns === 2,
    },
    {
      // Tablet (sm breakpoint and up)
      'sm:grid-cols-1': tabletColumns === 1,
      'sm:grid-cols-2': tabletColumns === 2,
      'sm:grid-cols-3': tabletColumns === 3,
    },
    {
      // Desktop (lg breakpoint and up)
      'lg:grid-cols-1': desktopColumns === 1,
      'lg:grid-cols-2': desktopColumns === 2,
      'lg:grid-cols-3': desktopColumns === 3,
      'lg:grid-cols-4': desktopColumns === 4,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
}
