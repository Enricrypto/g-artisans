import { z } from 'zod';

// Producer application form validation
// See Section 3.2 of docs/TRD.md for specifications
export const applySchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Introduce un email válido'),
  phone: z.string().min(7, 'Introduce un teléfono válido').max(20),
  website: z.string().url('Introduce una URL válida').optional().or(z.literal('')),
  instagram: z.string().max(50).optional(),
  craftDescription: z
    .string()
    .min(50, 'La descripción debe tener al menos 50 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
  category: z.enum(['moda', 'cuero', 'alpargatas', 'joyeria', 'ceramica', 'cosmetica', 'hogar', 'otra']),
  country: z.enum([
    'ES',
    'PT',
    'FR',
    'IT',
    'DE',
    'NL',
    'BE',
    'PL',
    'SE',
    'DK',
    'AT',
    'FI',
    'GR',
    'HU',
    'CZ',
    'RO',
    'EU',
  ]),
  referral: z
    .enum(['instagram', 'google', 'recommendation', 'press', 'event', 'other'])
    .optional(),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }),
  }),
  _gotcha: z.string().max(0).optional(),
});

export type ApplyFormData = z.infer<typeof applySchema>;

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Marketplace waitlist validation
export const buyerNotifySchema = z.object({
  email: z.string().email(),
  locale: z.enum(['es', 'en']),
});

export type BuyerNotifyData = z.infer<typeof buyerNotifySchema>;
