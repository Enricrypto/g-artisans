'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AccentShapeProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Shape size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Shape color
   * @default 'naranja'
   */
  color?: 'naranja' | 'selva' | 'linho' | 'noche';
}

/**
 * AccentShape Component
 *
 * Renders a decorative geometric shape as an SVG.
 * Marked as aria-hidden for decorative purposes.
 *
 * @example
 * <AccentShape size="lg" color="naranja" />
 *
 * @example
 * <AccentShape size="md" color="selva" className="absolute -top-4 -right-4" />
 */
export const AccentShape = React.forwardRef<SVGSVGElement, AccentShapeProps>(
  (
    {
      size = 'md',
      color = 'naranja',
      className,
      ...props
    },
    ref
  ) => {
    // Size dimensions (width and height)
    const sizeDimensions = {
      sm: 'w-12 h-12',
      md: 'w-20 h-20',
      lg: 'w-32 h-32',
    };

    // Color mapping to hex values
    const colorMap = {
      naranja: '#C4532A',
      selva: '#2A5240',
      linho: '#F5F0E8',
      noche: '#1A2E20',
    };

    return (
      <svg
        ref={ref}
        viewBox="0 0 120 120"
        className={cn(sizeDimensions[size], className)}
        aria-hidden="true"
        {...props}
      >
        {/* Decorative geometric shape - a rotated square with rounded corners */}
        <g>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="3"
            opacity="0.3"
          />
          <circle
            cx="60"
            cy="60"
            r="35"
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="2"
            opacity="0.5"
          />
          <circle
            cx="60"
            cy="60"
            r="20"
            fill={colorMap[color]}
            opacity="0.8"
          />
        </g>
      </svg>
    );
  }
);

AccentShape.displayName = 'AccentShape';
