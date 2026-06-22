'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text displayed above textarea
   */
  label?: string;
  /**
   * Error message displayed below textarea
   */
  error?: string;
  /**
   * Helper text displayed below textarea (when no error)
   */
  helperText?: string;
  /**
   * Show character counter
   * @default true
   */
  showCharCount?: boolean;
}

/**
 * TextArea Component
 *
 * Renders a styled form textarea with optional label, error, and character counter.
 * Supports auto-resize up to max-height constraint.
 *
 * @example
 * <TextArea
 *   label="Message"
 *   placeholder="Enter your message"
 *   maxLength={500}
 * />
 *
 * @example
 * <TextArea
 *   label="Bio"
 *   error="Bio is required"
 *   showCharCount
 * />
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = true,
      maxLength,
      required,
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);

      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          320
        )}px`;
      }

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

        <textarea
          ref={textareaRef}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 rounded-card border font-sans text-base',
            'placeholder-muted transition-colors duration-200 resize-none',
            'focus-visible:outline-2 focus-visible:outline-offset-0',
            'max-h-80 overflow-y-auto',
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

TextArea.displayName = 'TextArea';
