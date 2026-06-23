import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';

export const metadata: Metadata = {
  title: 'G·Artisans — Marketplace de productores sostenibles Made in Europe',
  description: 'Únete a G·Artisans, la plataforma de referencia para productores sostenibles y artesanos europeos.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Additional sections will be added here */}
    </>
  );
}
