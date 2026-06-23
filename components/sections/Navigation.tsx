'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';

interface NavigationProps {
  showScrollShadow?: boolean;
}

/**
 * Navigation Component
 *
 * Responsive navigation with desktop horizontal menu and mobile hamburger.
 * Includes language toggle and call-to-action button.
 *
 * Features:
 * - Desktop (≥ lg): Horizontal menu, language toggle, CTA button visible
 * - Mobile (< lg): Hamburger menu, mobile overlay on click
 * - Keyboard support: Escape to close menu
 * - WCAG 2.1 AA: ARIA labels, semantic HTML, keyboard navigation
 *
 * @example
 * <Navigation showScrollShadow={true} />
 */
export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({}, ref) => {
    const t = useTranslations('nav');
    const locale = useLocale();
    const router = useRouter();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation links
    const navLinks = [
      { label: t('home'), href: '/' },
      { label: t('artisans'), href: '/artisans' },
      { label: t('marketplace'), href: '/marketplace' },
      { label: t('about'), href: '/about' },
      { label: t('contact'), href: '/contact' },
    ];

    // Handle navigation link click to close menu
    const handleNavLinkClick = useCallback(() => {
      setMobileMenuOpen(false);
    }, []);

    // Handle language toggle
    const handleLanguageToggle = useCallback(() => {
      const newLocale = locale === 'es' ? 'en' : 'es';
      const currentPathname = window.location.pathname;

      // Remove current locale prefix if it exists
      let pathWithoutLocale = currentPathname;
      if (currentPathname.startsWith(`/${locale}`)) {
        pathWithoutLocale = currentPathname.slice(locale.length + 1) || '/';
      }

      // Build new path with new locale
      const newPath = newLocale === 'es' ? pathWithoutLocale : `/en${pathWithoutLocale}`;

      router.push(newPath);
      setMobileMenuOpen(false);
    }, [locale, router]);

    // Handle CTA button click
    const handleCTAClick = useCallback(() => {
      router.push('/apply');
      setMobileMenuOpen(false);
    }, [router]);

    // Handle Escape key to close mobile menu
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }, [mobileMenuOpen]);

    return (
      <nav
        ref={ref}
        className="relative w-full bg-white"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 md:px-8 md:py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="compact" size="sm" className="w-24 md:w-32" />
          </div>

          {/* Desktop Navigation (≥ lg) */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-normal text-noche transition-colors hover:text-naranja focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {link.label}
              </a>
            ))}

            {/* Language Toggle (Desktop) */}
            <button
              onClick={handleLanguageToggle}
              className="text-sm font-normal text-noche transition-colors hover:text-naranja focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </button>

            {/* CTA Button (Desktop) */}
            <Button
              variant="primary-orange"
              size="md"
              onClick={handleCTAClick}
            >
              {t('apply')}
            </Button>
          </div>

          {/* Mobile Menu Button (< lg) */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Language Toggle (Mobile) */}
            <button
              onClick={handleLanguageToggle}
              className="text-sm font-normal text-noche transition-colors hover:text-naranja focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-noche transition-colors hover:text-naranja focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay (< lg) */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="animate-slide-in-from-top border-t border-rule bg-white px-4 py-6 md:px-8 md:py-8 lg:hidden"
            role="region"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col gap-6">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-normal text-noche transition-colors hover:text-naranja focus-visible:outline-noche focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={handleNavLinkClick}
                >
                  {link.label}
                </a>
              ))}

              {/* Divider */}
              <div className="border-t border-rule" />

              {/* Mobile CTA Button */}
              <Button
                variant="primary-orange"
                size="md"
                onClick={handleCTAClick}
                className="w-full"
              >
                {t('apply')}
              </Button>
            </div>
          </div>
        )}
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';
