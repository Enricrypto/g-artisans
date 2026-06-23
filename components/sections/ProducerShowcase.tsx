'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ProducerCard } from '@/components/ProducerCard';
import { Typography } from '@/components/ui/Typography';
import type { Producer } from '@/lib/producer';
import { cn } from '@/lib/utils';

interface ProducerShowcaseProps {
  /** Array of producers to display */
  producers: Producer[];
  /** Optional section title override */
  title?: string;
  /** Optional section description override */
  description?: string;
  /** Optional background color for section */
  backgroundColor?: 'naranja' | 'linho' | 'selva';
  /** Optional CTA button text override */
  ctaText?: string;
  /** Optional CTA button href override */
  ctaHref?: string;
  /** Optional additional className */
  className?: string;
}

/**
 * ProducerShowcase Section Component
 *
 * Displays a grid of producer cards with:
 * - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
 * - Section heading and description
 * - Producer cards in semantic list
 * - Call-to-action button
 * - Full i18n support
 * - WCAG 2.1 AA accessibility
 *
 * @example
 * <ProducerShowcase
 *   producers={mockProducers}
 *   backgroundColor="linho"
 * />
 */
export const ProducerShowcase = React.forwardRef<HTMLElement, ProducerShowcaseProps>(
  (
    {
      producers,
      title,
      description,
      backgroundColor = 'linho',
      ctaText,
      ctaHref = '/artisans',
      className,
    },
    ref
  ) => {
    const t = useTranslations('sections.producerShowcase');

    // Use i18n defaults if props not provided
    const sectionTitle = title || t('title');
    const sectionDescription = description || t('description');
    const buttonText = ctaText || t('ctaText');
    const emptyMessage = t('noProducers');

    // Background color mapping
    const bgColorClasses = {
      naranja: 'bg-naranja-papaya',
      linho: 'bg-linho',
      selva: 'bg-selva',
    };

    return (
      <section
        ref={ref}
        className={cn(
          bgColorClasses[backgroundColor],
          'px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-16 w-full',
          className
        )}
        aria-labelledby="producer-showcase-heading"
      >
        {/* Content Container */}
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 md:mb-16">
            {/* Title */}
            <h2
              id="producer-showcase-heading"
              className="h2 text-noche mb-4"
            >
              {sectionTitle}
            </h2>

            {/* Description */}
            <Typography
              variant="body"
              className="text-noche opacity-85 max-w-2xl"
            >
              {sectionDescription}
            </Typography>
          </div>

          {/* Producers Grid */}
          {producers && producers.length > 0 ? (
            <>
              <ul
                role="list"
                className={cn(
                  'grid gap-6 md:gap-8 lg:gap-10',
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                )}
              >
                {producers.map((producer) => (
                  <li
                    key={producer.id}
                    role="listitem"
                  >
                    <ProducerCard
                      producer={producer}
                      accentColor="naranja"
                    />
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-12 md:mt-16 flex justify-center">
                <Link
                  href={ctaHref}
                  className={cn(
                    'rounded-pill font-sans font-normal uppercase tracking-btn transition-all duration-200 ease-in-out',
                    'px-7 py-3',
                    'bg-naranja text-white hover:bg-naranja-papaya focus-visible:outline-naranja focus-visible:outline-2 focus-visible:outline-offset-2',
                    'inline-block font-semibold'
                  )}
                >
                  {buttonText}
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 md:py-16">
              <Typography
                variant="body"
                className="text-noche opacity-70"
              >
                {emptyMessage}
              </Typography>
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProducerShowcase.displayName = 'ProducerShowcase';
