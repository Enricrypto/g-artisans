'use client';

/**
 * Producer Category Enum
 * Represents the disciplines/categories of artisan producers
 */
export type ProducerCategory =
  | 'moda'
  | 'cuero'
  | 'alpargatas'
  | 'joyeria'
  | 'ceramica'
  | 'cosmetica'
  | 'hogar'
  | 'otra';

/**
 * Producer Interface
 * Represents a single artisan producer
 */
export interface Producer {
  /** Unique identifier for the producer */
  id: string;
  /** Full name of the producer/artisan */
  name: string;
  /** Discipline/category of the producer */
  discipline: ProducerCategory;
  /** Short biography or description of the producer's work */
  bio: string;
  /** URL to the producer's primary image */
  imageUrl: string;
  /** Optional location/region of the producer */
  location?: string;
  /** Optional accent color override (Tailwind token name) */
  accentColor?: string;
}

/**
 * Helper function to get category labels
 * This is a hook-compatible function that retrieves translated category names
 */
export function getCategoryLabel(
  discipline: ProducerCategory,
  translations: Record<ProducerCategory, string>
): string {
  return translations[discipline] || discipline;
}
