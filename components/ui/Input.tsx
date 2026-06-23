'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text displayed above input
   */
  label?: string;
  /**
   * Error message displayed below input
   */
  error?: string;
  /**
   * Helper text displayed below input (when no error)
   */
  helperText?: string;
  /**
   * Show character count (for inputs with maxLength)
   * @default false
   */
  showCharCount?: boolean;
}

/**
 * Input Component
 *
 * Renders a styled form input with optional label, error, and helper text.
 * Supports character counting when showCharCount is true.
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error="Invalid email"
 * />
 *
 * @example
 * <Input
 *   label="Name"
 *   maxLength={50}
 *   showCharCount
 *   helperText="Full name required"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      maxLength,
      required,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const hasError = Boolean(error);
    const showHelper = helperText && !error;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'label',
              required && "after:content-['*'] after:ml-0.5 after:text-naranja"
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3 rounded-card border font-sans text-base',
            'placeholder-muted transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-0',
            hasError
              ? 'border-naranja bg-naranja-soft text-naranja placeholder-naranja focus-visible:outline-naranja'
              : 'border-rule bg-white text-noche focus-visible:outline-noche hover:border-muted',
            'disabled:bg-linho disabled:text-muted disabled:border-rule disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError || showHelper ? `${props.id}-description` : undefined
          }
          {...props}
          onChange={handleChange}
        />

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className="text-xs text-muted font-sans">
            {charCount} / {maxLength}
          </div>
        )}

        {/* Error or Helper Text */}
        {(hasError || showHelper) && (
          <span
            id={`${props.id}-description`}
            className={cn(
              'text-sm font-sans',
              hasError ? 'text-naranja' : 'text-muted'
            )}
            role={hasError ? 'alert' : undefined}
          >
            {hasError ? error : helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
