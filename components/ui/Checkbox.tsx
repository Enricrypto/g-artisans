'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text or React node displayed next to checkbox
   */
  label?: React.ReactNode;
  /**
   * Error message displayed below checkbox
   */
  error?: string;
}

/**
 * Checkbox Component
 *
 * Renders a styled checkbox with optional label and error message.
 * Uses native checkbox for full accessibility.
 *
 * @example
 * <Checkbox
 *   id="privacy"
 *   label="I accept the privacy policy"
 *   required
 * />
 *
 * @example
 * <Checkbox
 *   id="terms"
 *   label={
 *     <span>
 *       I agree to the <a href="/terms">Terms of Service</a>
 *     </span>
 *   }
 *   error="You must accept the terms"
 * />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, required, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            required={required}
            className={cn(
              'h-5 w-5 mt-1 rounded border font-sans text-base',
              'cursor-pointer transition-colors duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-0',
              hasError
                ? 'border-naranja bg-naranja-soft accent-naranja focus-visible:outline-naranja'
                : 'border-rule bg-white accent-naranja focus-visible:outline-noche hover:border-muted',
              'disabled:bg-linho disabled:text-muted disabled:border-rule disabled:cursor-not-allowed disabled:opacity-50',
              'checked:bg-naranja checked:border-naranja',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-description` : undefined}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'font-sans text-base cursor-pointer transition-colors',
                hasError ? 'text-naranja' : 'text-noche',
                required && "after:content-['*'] after:ml-0.5 after:text-naranja"
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <span
            id={`${id}-description`}
            className="text-sm font-sans text-naranja"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
