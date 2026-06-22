'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  /**
   * Lucide React icon name
   * @example 'ChevronDown', 'Menu', 'X', 'Home'
   */
  name: keyof typeof Icons;
  /**
   * Icon size in pixels
   * @default 24
   */
  size?: 16 | 20 | 24 | 32 | 40;
  /**
   * Icon color (Tailwind color token or currentColor)
   * @default 'currentColor'
   */
  color?: 'currentColor' | 'naranja' | 'selva' | 'noche' | 'muted';
  /**
   * Mark as decorative
   * @default true
   */
  decorative?: boolean;
  /**
   * Additional aria-label for screen readers (if not decorative)
   */
  'aria-label'?: string;
  /**
   * Accessibility identifier
   */
  'aria-hidden'?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
}

// Color mapping to hex values
const colorMap: Record<string, string> = {
  naranja: '#C4532A',
  selva: '#2A5240',
  noche: '#1A2E20',
  muted: '#7A7A6E',
};

/**
 * Icon Component
 *
 * Wrapper around Lucide React icons with color and size props.
 *
 * @example
 * <Icon name="ChevronDown" size={24} color="naranja" />
 *
 * @example
 * <Icon
 *   name="Menu"
 *   size={32}
 *   color="noche"
 *   aria-label="Open menu"
 *   decorative={false}
 * />
 */
export const Icon = ({
  name,
  size = 24,
  color = 'currentColor',
  decorative = true,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  className,
}: IconProps) => {
  const LucideIcon = Icons[name] as React.ComponentType<any> | undefined;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const iconColor = color === 'currentColor' ? color : colorMap[color];

  return (
    <LucideIcon
      size={size}
      color={iconColor}
      className={className}
      aria-hidden={decorative || ariaHidden}
      aria-label={!decorative ? ariaLabel : undefined}
    />
  );
};

Icon.displayName = 'Icon';
