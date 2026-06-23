import type { Producer } from './producer';

/**
 * Mock producers data for development and testing
 * These 6 producers represent diverse disciplines and regions
 */
export const mockProducers: Producer[] = [
  {
    id: 'prod-001',
    name: 'Carmen Solares',
    discipline: 'ceramica',
    bio: 'Cerámica artesanal inspirada en tradiciones españolas e influencias nórdicas.',
    imageUrl:
      'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop',
    location: 'Seville, Spain',
  },
  {
    id: 'prod-002',
    name: 'Miguel Fernández',
    discipline: 'cuero',
    bio: 'Maestro del cuero con 25 años de experiencia en marroquinería sostenible.',
    imageUrl:
      'https://images.unsplash.com/photo-1591047990966-98b41b4754e3?w=300&h=300&fit=crop',
    location: 'Barcelona, Spain',
  },
  {
    id: 'prod-003',
    name: 'Elena Rossi',
    discipline: 'joyeria',
    bio: 'Joyería minimalista en plata y oro reciclado con diseño contemporáneo.',
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
    location: 'Valencia, Spain',
  },
  {
    id: 'prod-004',
    name: 'Sophie Laurent',
    discipline: 'cosmetica',
    bio: 'Cosmética natural con ingredientes botánicos orgánicos de los Pirineos.',
    imageUrl:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    location: 'Toulouse, France',
  },
  {
    id: 'prod-005',
    name: 'António Pereira',
    discipline: 'moda',
    bio: 'Moda sostenible con tejidos naturales y producción ética local.',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    location: 'Lisbon, Portugal',
  },
  {
    id: 'prod-006',
    name: 'Eva Hoffmann',
    discipline: 'hogar',
    bio: 'Textiles para el hogar tejidos a mano con lanas y algodones sostenibles.',
    imageUrl:
      'https://images.unsplash.com/photo-1595521624651-f8e8d0f1d6c5?w=300&h=300&fit=crop',
    location: 'Berlin, Germany',
  },
];
