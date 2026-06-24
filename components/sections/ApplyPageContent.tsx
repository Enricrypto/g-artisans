'use client';

import { useTranslations } from 'next-intl';
import { ApplyForm } from '@/components/forms/ApplyForm';
import { ReactNode } from 'react';

interface ApplyPageContentProps {
  locale: 'es' | 'en';
}

/**
 * ApplyPageContent Component
 *
 * Client-side content for the apply page including hero section and form.
 * Uses useTranslations hook for i18n support.
 *
 * @example
 * <ApplyPageContent locale="es" />
 */
export function ApplyPageContent({ locale }: ApplyPageContentProps): ReactNode {
  const t = useTranslations('apply');

  return (
    <>
      {/* Hero Section */}
      <section className="bg-naranja-soft py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-content">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-noche mb-4">
            {t('hero.title')}
          </h1>
          <p className="font-sans text-lg text-noche opacity-85 max-w-2xl">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Skip Link */}
      <a href="#apply-form" className="sr-only focus:not-sr-only">
        {t('skipLink')}
      </a>

      {/* Form Section */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-content">
          <div id="apply-form" className="max-w-2xl">
            <h2 className="text-3xl font-display font-bold text-noche mb-2">
              {t('form.title')}
            </h2>
            <p className="text-muted mb-8">{t('form.description')}</p>
            <ApplyForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
