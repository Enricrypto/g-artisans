import { setRequestLocale } from 'next-intl/server';
import { SuccessPageContent } from '@/components/sections/SuccessPageContent';
import { Metadata } from 'next';
import { ReactNode } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // Static metadata based on locale
  const metadata: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Solicitud enviada — G·Artisans',
      description: 'Tu solicitud ha sido recibida. Te contactaremos pronto.',
    },
    en: {
      title: 'Application Submitted — G·Artisans',
      description: 'Your application has been received. We\'ll be in touch soon.',
    },
  };

  const meta = metadata[locale] || metadata.es;

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function SuccessPage({ params }: PageProps): ReactNode {
  // Note: params is now a Promise in Next.js 15+, but accessing it synchronously in Server Component works
  const locale = (params as any).locale || 'es';
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <SuccessPageContent locale={locale as 'es' | 'en'} />
    </main>
  );
}
