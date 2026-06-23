'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card rotation angle in degrees
   * @default -2.5
   */
  rotation?: number;
  /**
   * Add box shadow elevation
   * @default false
   */
  elevation?: boolean;
  /**
   * Card visual variant
   * @default 'default'
   */
  variant?: 'default' | 'flat';
  /**
   * Add padding to card
   * @default true
   */
  padded?: boolean;
}

/**
 * Card Component
 *
 * Renders a styled card container with optional rotation, elevation, and variants.
 *
 * @example
 * <Card rotation={-2.5} elevation={true}>
 *   Card content here
 * </Card>
 *
 * @example
 * <Card variant="flat">
 *   Flat card without border or shadow
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      rotation = -2.5,
      elevation = false,
      variant = 'default',
      padded = true,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default:
        'border border-rule bg-white',
      flat:
        'bg-white',
    };

    const elevationClass = elevation ? 'shadow-sm' : '';
    const paddingClass = padded ? 'p-4 md:p-6' : '';

    // Combine style with rotation transform
    const combinedStyle = {
      ...style,
      transform: variant === 'default' ? `rotate(${rotation}deg)` : undefined,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card',
          variantClasses[variant],
          elevationClass,
          paddingClass,
          className
        )}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
