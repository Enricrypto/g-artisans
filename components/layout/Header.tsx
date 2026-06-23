'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/sections/Navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showScrollShadow?: boolean;
}

/**
 * Header Component
 *
 * Sticky header with scroll-triggered shadow effect.
 *
 * Features:
 * - Sticky positioning (z-50, top-0)
 * - White background
 * - Adds shadow-md when scrolling down (scrollY > 0)
 * - Smooth shadow transition (duration-200)
 * - Debounced scroll listener (50ms)
 * - Integrates Navigation component
 *
 * @example
 * <Header />
 *
 * @example
 * <Header showScrollShadow={true} />
 */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ showScrollShadow: initialShowShadow }, ref) => {
    const [showShadow, setShowShadow] = useState(false);
    const [scrollDebounceTimeout, setScrollDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    // Debounced scroll listener (50ms debounce)
    const handleScroll = useCallback(() => {
      // Clear existing timeout
      if (scrollDebounceTimeout) {
        clearTimeout(scrollDebounceTimeout);
      }

      // Set new debounced timeout
      const timeout = setTimeout(() => {
        const isScrolling = window.scrollY > 0;
        setShowShadow(isScrolling);
      }, 50);

      setScrollDebounceTimeout(timeout);
    }, [scrollDebounceTimeout]);

    // Set up scroll listener
    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollDebounceTimeout) {
          clearTimeout(scrollDebounceTimeout);
        }
      };
    }, [handleScroll, scrollDebounceTimeout]);

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-shadow duration-200',
          (showShadow || initialShowShadow) && 'shadow-md'
        )}
      >
        <div className="mx-auto max-w-content px-4 md:px-8">
          <Navigation showScrollShadow={showShadow} />
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';
