'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SuccessPageContentProps {
  locale: 'es' | 'en';
}

/**
 * SuccessPageContent Component
 *
 * Client-side content for the apply success page.
 * Shows success message, next steps, and CTA to return home.
 *
 * @example
 * <SuccessPageContent locale="es" />
 */
export function SuccessPageContent({ locale }: SuccessPageContentProps): ReactNode {
  const t = useTranslations('apply.success');
  const isEnglish = locale === 'en';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-content w-full">
        <div className="text-center max-w-2xl mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />

          <h1 className="font-display text-4xl md:text-5xl font-bold text-noche mb-4">
            {t('title')}
          </h1>

          <p className="font-sans text-lg text-muted mb-8">
            {t('description')}
          </p>

          <div className="bg-linho p-6 rounded-card mb-8 text-left">
            <h2 className="font-display font-bold text-noche mb-4">{t('nextSteps.title')}</h2>
            <ol className="space-y-3 text-noche font-sans">
              <li className="flex items-start gap-4">
                <span className="text-naranja font-bold text-lg min-w-8">1.</span>
                <span>{t('nextSteps.step1')}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-naranja font-bold text-lg min-w-8">2.</span>
                <span>{t('nextSteps.step2')}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-naranja font-bold text-lg min-w-8">3.</span>
                <span>{t('nextSteps.step3')}</span>
              </li>
            </ol>
          </div>

          <p className="text-sm text-muted mb-8 font-sans">
            {t('contact.intro')}{' '}
            <a
              href="mailto:support@g-artisans.com"
              className="text-naranja underline hover:text-naranja-papaya font-semibold"
            >
              support@g-artisans.com
            </a>
          </p>

          <Link href={isEnglish ? '/en' : '/'} className="inline-block">
            <Button variant="primary-orange" size="md">
              {t('cta.backHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
