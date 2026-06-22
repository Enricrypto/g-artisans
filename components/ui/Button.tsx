'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * @default 'primary-orange'
   */
  variant?: 'primary-orange' | 'secondary-green' | 'outline-orange' | 'outline-dark';
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Show loading spinner and disable interaction
   * @default false
   */
  isLoading?: boolean;
}

/**
 * Button Component
 *
 * Renders a styled button with 4 variants and 3 sizes.
 * Supports loading state with spinner icon.
 *
 * @example
 * <Button variant="primary-orange" size="md">
 *   Click Me
 * </Button>
 *
 * @example
 * <Button variant="secondary-green" isLoading={true}>
 *   Submitting...
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary-orange',
      size = 'md',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Font size based on variant size (TRD spec exact pixels)
    const sizeClasses = {
      sm: 'px-4 py-1.5',
      md: 'px-7 py-3',
      lg: 'px-8 py-4',
    };

    // Color variants
    const variantClasses = {
      'primary-orange':
        'bg-naranja text-white hover:bg-naranja-papaya focus-visible:outline-naranja focus-visible:outline-2 focus-visible:outline-offset-2',
      'secondary-green':
        'bg-selva text-white hover:bg-selva focus-visible:outline-selva focus-visible:outline-2 focus-visible:outline-offset-2',
      'outline-orange':
        'border border-naranja text-naranja hover:bg-naranja hover:text-white focus-visible:outline-naranja focus-visible:outline-2 focus-visible:outline-offset-2',
      'outline-dark':
        'border border-noche text-noche hover:bg-noche hover:text-white focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2',
    };

    // Font size styling per TRD spec
    const fontSizeStyle = {
      sm: { fontSize: '9px' },
      md: { fontSize: '11px' },
      lg: { fontSize: '12px' },
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={fontSizeStyle}
        className={cn(
          // Base styles
          'rounded-pill font-sans font-normal uppercase tracking-btn transition-all duration-200 ease-in-out',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          // Size
          sizeClasses[size],
          // Variant
          variantClasses[variant],
          // Custom className
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
