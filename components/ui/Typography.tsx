'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Typography variant determines styling
   * @default 'body'
   */
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-small' | 'label';
  /**
   * Apply italic + naranja color
   * @default false
   */
  accent?: boolean;
  /**
   * Render as different HTML element than the variant
   * @example variant="h1" as="h2" renders <h2> styled as h1
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

// Mapping of variants to their default HTML elements
const variantToElement: Record<string, keyof React.JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-small': 'p',
  label: 'span',
};

// Tailwind class mapping for each variant
const variantClasses: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'body',
  'body-small': 'body-small',
  label: 'label',
};

/**
 * Typography Component
 *
 * Renders semantic HTML elements with consistent typography styling.
 * Supports accent prop for italicized colored text.
 *
 * @example
 * <Typography variant="h1">
 *   Main Title
 * </Typography>
 *
 * @example
 * <Typography variant="body" accent>
 *   This text is italicized and orange.
 * </Typography>
 *
 * @example
 * <Typography variant="h1" as="h2">
 *   Render as h2 but styled as h1
 * </Typography>
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      accent = false,
      as,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || variantToElement[variant];
    const baseClass = variantClasses[variant];
    const accentClass = accent ? 'italic text-naranja' : '';

    return React.createElement(
      Component,
      {
        ref,
        className: cn(baseClass, accentClass, className),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';
