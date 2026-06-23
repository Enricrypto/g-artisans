'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { AccentShape } from '@/components/ui/AccentShape';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import type { Producer } from '@/lib/producer';
import { getCategoryLabel } from '@/lib/producer';
import { cn } from '@/lib/utils';

interface ProducerCardProps {
  /** Producer data to display */
  producer: Producer;
  /** Optional accent color override (Tailwind color token) */
  accentColor?: string;
  /** Optional additional className */
  className?: string;
}

/**
 * ProducerCard Component
 *
 * Displays a single producer in a card format with:
 * - Rotated card with elevation
 * - Square image with Selva border
 * - Naranja accent shape in corner
 * - Producer name, category, and bio
 * - Full accessibility support
 *
 * @example
 * <ProducerCard
 *   producer={producer}
 *   accentColor="naranja"
 * />
 */
export const ProducerCard = React.forwardRef<HTMLDivElement, ProducerCardProps>(
  ({ producer, className }, ref) => {
    const t = useTranslations('sections.producerShowcase.categories');

    // Get translated category label
    const categoryLabel = getCategoryLabel(producer.discipline, {
      moda: t('moda'),
      cuero: t('cuero'),
      alpargatas: t('alpargatas'),
      joyeria: t('joyeria'),
      ceramica: t('ceramica'),
      cosmetica: t('cosmetica'),
      hogar: t('hogar'),
      otra: t('otra'),
    });

    return (
      <article
        ref={ref}
        className={cn('relative', className)}
      >
        <Card
          rotation={-2.5}
          elevation={true}
          padded={true}
          className="h-full flex flex-col"
        >
          {/* Image Container with Accent Shape */}
          <div className="relative mb-4">
            {/* Accent Shape - positioned absolutely in corner */}
            <AccentShape
              size="md"
              color="naranja"
              className="absolute -top-3 -right-3 z-10 opacity-80"
              aria-hidden="true"
            />

            {/* Image with Selva border */}
            <div className="relative w-full aspect-square rounded-card overflow-hidden border-4 border-selva bg-linho">
              {producer.imageUrl ? (
                <Image
                  src={producer.imageUrl}
                  alt={`${producer.name}, ${categoryLabel}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Icon
                    name="Image"
                    size={32}
                    color="muted"
                    decorative={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Producer Info */}
          <div className="flex flex-col flex-grow">
            {/* Name */}
            <Typography
              variant="h3"
              className="text-noche font-display font-semibold mb-2 line-clamp-2"
            >
              {producer.name}
            </Typography>

            {/* Category Badge */}
            <div className="mb-3">
              <span
                className={cn(
                  'inline-block text-xs font-medium uppercase tracking-badge',
                  'px-3 py-1 rounded-badge',
                  'bg-muted text-noche'
                )}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Bio */}
            <Typography
              variant="body-small"
              className="text-muted line-clamp-1 mb-1"
            >
              {producer.bio || '—'}
            </Typography>

            {/* Location (optional) */}
            {producer.location && (
              <Typography
                variant="body-small"
                className="text-muted text-xs opacity-75 mt-auto"
              >
                {producer.location}
              </Typography>
            )}
          </div>
        </Card>
      </article>
    );
  }
);

ProducerCard.displayName = 'ProducerCard';
