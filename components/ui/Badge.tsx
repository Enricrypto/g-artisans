'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge color variant
   * @default 'naranja'
   */
  variant?: 'naranja' | 'selva' | 'linho' | 'noche' | 'muted' | 'rule';
  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Badge Component
 *
 * Renders a pill-shaped badge with 6 color variants and 3 sizes.
 *
 * @example
 * <Badge variant="naranja" size="md">
 *   Badge Text
 * </Badge>
 *
 * @example
 * <Badge variant="selva" size="lg">
 *   Premium
 * </Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'naranja',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'text-xs px-3 py-1',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    // Variant color mapping
    const variantClasses = {
      naranja: 'bg-naranja text-white',
      selva: 'bg-selva text-white',
      linho: 'bg-linho text-noche',
      noche: 'bg-noche text-white',
      muted: 'bg-muted text-white',
      rule: 'bg-rule text-noche',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'rounded-badge font-sans font-medium uppercase tracking-badge inline-block',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
