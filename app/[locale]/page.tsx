import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'G·Artisans — Marketplace de productores sostenibles Made in Europe',
  description: 'Únete a G·Artisans, la plataforma de referencia para productores sostenibles y artesanos europeos.',
};

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="mx-auto max-w-content px-4">
          <h1 className="font-display text-5xl font-light text-noche">
            {t('hero.headline')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            {t('hero.subheadline')}
          </p>
          <div className="mt-8 flex gap-4">
            <button className="rounded-pill bg-naranja px-7 py-3 font-sans text-sm font-semibold uppercase tracking-btn text-white transition-opacity hover:opacity-88">
              {t('hero.cta_primary')}
            </button>
            <button className="rounded-pill border-2 border-noche px-7 py-3 font-sans text-sm font-semibold uppercase tracking-btn text-noche transition-opacity hover:opacity-88">
              {t('hero.cta_secondary')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
