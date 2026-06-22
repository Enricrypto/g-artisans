import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'G·Artisans',
  description: 'Sustainable Artisan Marketplace Made in Europe',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return <main>{children}</main>;
}
