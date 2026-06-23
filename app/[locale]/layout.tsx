import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'G·Artisans',
  description: 'Sustainable Artisan Marketplace Made in Europe',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
