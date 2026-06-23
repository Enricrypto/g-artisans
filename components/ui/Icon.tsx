'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import * as HeroiconsOutline from '@heroicons/react/24/outline';
import * as HeroiconsSolid from '@heroicons/react/24/solid';

interface IconProps {
  /**
   * Icon name (Lucide or Heroicons style)
   * @example 'ChevronDown', 'Bars3Icon', 'XMarkIcon'
   */
  name: string;
  /**
   * Icon source library
   * @default 'lucide'
   */
  source?: 'lucide' | 'heroicons';
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
 * Wrapper around Lucide React and Heroicons with color and size props.
 * Supports both icon libraries with configurable source prop.
 *
 * @example
 * <Icon name="ChevronDown" size={24} color="naranja" />
 *
 * @example
 * <Icon
 *   name="Bars3Icon"
 *   source="heroicons"
 *   size={24}
 *   color="noche"
 *   aria-label="Open menu"
 *   decorative={false}
 * />
 */
export const Icon = ({
  name,
  source = 'lucide',
  size = 24,
  color = 'currentColor',
  decorative = true,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  className,
}: IconProps) => {
  let IconComponent: React.ComponentType<any> | undefined;

  if (source === 'heroicons') {
    // Try solid first, then outline
    IconComponent = (HeroiconsSolid as Record<string, any>)[name] ||
                    (HeroiconsOutline as Record<string, any>)[name];
  } else {
    // Lucide (default)
    IconComponent = (Icons as Record<string, any>)[name];
  }

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ${source}`);
    return null;
  }

  const iconColor = color === 'currentColor' ? color : colorMap[color];

  return React.createElement(IconComponent, {
    width: size,
    height: size,
    color: iconColor,
    className,
    'aria-hidden': decorative || ariaHidden,
    'aria-label': !decorative ? ariaLabel : undefined,
  });
};

Icon.displayName = 'Icon';
