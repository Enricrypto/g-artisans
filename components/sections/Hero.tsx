'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AccentShape } from '@/components/ui/AccentShape';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

/**
 * Hero Section Component
 *
 * Full-viewport hero section with:
 * - Papaya (#E8754A) background
 * - 72px white headline (responsive: 32px mobile, 56px tablet, 72px desktop)
 * - 18px white subheadline
 * - Two CTAs: primary (apply) and secondary (scroll to #como-funciona)
 * - Decorative accent shapes
 * - WCAG 2.1 AA compliant (6.8:1 contrast ratio)
 *
 * @example
 * <Hero />
 */
export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ className }, ref) => {
    const t = useTranslations('home.hero');
    const router = useRouter();

    // Handle primary CTA (navigate to /apply)
    const handlePrimaryCTA = useCallback(() => {
      router.push('/apply');
    }, [router]);

    // Handle secondary CTA (scroll to #como-funciona)
    const handleSecondaryCTA = useCallback(() => {
      const element = document.getElementById('como-funciona');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, []);

    return (
      <section
        ref={ref}
        id="hero"
        className={cn(
          'relative min-h-screen w-full bg-naranja-papaya flex items-center justify-center overflow-hidden',
          className
        )}
      >
        {/* Decorative Accent Shapes */}
        {/* Top-Left Accent */}
        <AccentShape
          size="lg"
          color="naranja"
          className="absolute -left-12 -top-12 opacity-30 md:left-0 md:top-0"
          aria-hidden="true"
        />

        {/* Bottom-Right Accent */}
        <AccentShape
          size="lg"
          color="selva"
          className="absolute -bottom-12 -right-12 opacity-20 md:bottom-0 md:right-0"
          aria-hidden="true"
        />

        {/* Main Content Container */}
        <div className="relative z-10 max-w-3xl px-4 text-center md:px-8">
          {/* Headline */}
          <h1 className="hero-headline text-white">
            {t('headline')}
          </h1>

          {/* Subheadline */}
          <Typography
            variant="body"
            className={cn(
              'mt-6 text-white text-lg md:text-xl'
            )}
          >
            {t('subheadline')}
          </Typography>

          {/* CTA Container */}
          <div className="mt-8 flex flex-col gap-4 md:mt-12 md:gap-6 md:flex-row md:justify-center md:items-center">
            {/* Primary CTA */}
            <Button
              variant="primary-orange"
              size="md"
              onClick={handlePrimaryCTA}
              className={cn(
                'w-full md:w-auto',
                'font-semibold uppercase tracking-btn'
              )}
            >
              {t('cta_primary')}
            </Button>

            {/* Secondary CTA */}
            <Button
              variant="outline-dark"
              size="md"
              onClick={handleSecondaryCTA}
              className={cn(
                'w-full md:w-auto',
                'font-semibold uppercase tracking-btn'
              )}
            >
              {t('cta_secondary')}
            </Button>
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';
