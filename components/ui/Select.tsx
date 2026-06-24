'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Label text displayed above select
   */
  label?: string;
  /**
   * Array of options to display
   */
  options: SelectOption[];
  /**
   * Error message displayed below select
   */
  error?: string;
  /**
   * Helper text displayed below select (when no error)
   */
  helperText?: string;
  /**
   * Placeholder text for empty option
   */
  placeholder?: string;
}

/**
 * Select Component
 *
 * Renders a styled form select with optional label, options, error, and helper text.
 * Fully accessible with native select element.
 *
 * @example
 * <Select
 *   id="category"
 *   label="Category"
 *   options={[
 *     { value: 'moda', label: 'Moda' },
 *     { value: 'cuero', label: 'Cuero' }
 *   ]}
 *   placeholder="Select a category"
 * />
 *
 * @example
 * <Select
 *   id="country"
 *   label="Country"
 *   options={countryOptions}
 *   error="Country is required"
 *   required
 * />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options,
      error,
      helperText,
      placeholder,
      required,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const showHelper = helperText && !error;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'label',
              required && "after:content-['*'] after:ml-0.5 after:text-naranja"
            )}
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          required={required}
          className={cn(
            'w-full px-4 py-3 rounded-card border font-sans text-base',
            'placeholder-muted transition-colors duration-200 appearance-none',
            'focus-visible:outline-2 focus-visible:outline-offset-0',
            hasError
              ? 'border-naranja bg-naranja-soft text-naranja focus-visible:outline-naranja'
              : 'border-rule bg-white text-noche focus-visible:outline-noche hover:border-muted',
            'disabled:bg-linho disabled:text-muted disabled:border-rule disabled:cursor-not-allowed',
            'cursor-pointer',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError || showHelper ? `${id}-description` : undefined
          }
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Error or Helper Text */}
        {(hasError || showHelper) && (
          <span
            id={`${id}-description`}
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

Select.displayName = 'Select';
