import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ProducerShowcase } from '@/components/sections/ProducerShowcase';
import { mockProducers } from '@/lib/mockProducers';

export const metadata: Metadata = {
  title: 'G·Artisans — Marketplace de productores sostenibles Made in Europe',
  description: 'Únete a G·Artisans, la plataforma de referencia para productores sostenibles y artesanos europeos.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProducerShowcase producers={mockProducers} backgroundColor="linho" />
    </>
  );
}
