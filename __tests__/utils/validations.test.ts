import { describe, it, expect } from 'vitest';
import { applySchema } from '@/lib/validations';

describe('Apply Form Validation Schema', () => {
  const validData = {
    fullName: 'María García',
    email: 'maria@example.com',
    phone: '+34612345678',
    website: 'https://maria.es',
    instagram: 'maria_ceramica',
    craftDescription: 'Ceramista con 10 años de experiencia haciendo piezas únicas.',
    category: 'ceramica',
    country: 'ES',
    referral: 'instagram',
    privacyAccepted: true,
    _gotcha: '',
  };

  it('accepts valid form data', () => {
    const result = applySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates fullName minimum length', () => {
    const result = applySchema.safeParse({
      ...validData,
      fullName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('validates fullName maximum length', () => {
    const result = applySchema.safeParse({
      ...validData,
      fullName: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('requires fullName', () => {
    const { fullName, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('validates email format', () => {
    const result = applySchema.safeParse({
      ...validData,
      email: 'invalid-email',
    });
    expect(result.success).toBe(false);
  });

  it('requires email', () => {
    const { email, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('validates phone minimum length', () => {
    const result = applySchema.safeParse({
      ...validData,
      phone: '123',
    });
    expect(result.success).toBe(false);
  });

  it('validates phone maximum length', () => {
    const result = applySchema.safeParse({
      ...validData,
      phone: 'A'.repeat(21),
    });
    expect(result.success).toBe(false);
  });

  it('requires phone', () => {
    const { phone, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('allows empty website', () => {
    const result = applySchema.safeParse({
      ...validData,
      website: '',
    });
    expect(result.success).toBe(true);
  });

  it('allows no website field', () => {
    const { website, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('validates website URL format', () => {
    const result = applySchema.safeParse({
      ...validData,
      website: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid website URL', () => {
    const result = applySchema.safeParse({
      ...validData,
      website: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('allows empty instagram', () => {
    const result = applySchema.safeParse({
      ...validData,
      instagram: '',
    });
    expect(result.success).toBe(true);
  });

  it('allows no instagram field', () => {
    const { instagram, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('validates craft description minimum length (50 chars)', () => {
    const result = applySchema.safeParse({
      ...validData,
      craftDescription: 'Short description',
    });
    expect(result.success).toBe(false);
  });

  it('validates craft description maximum length (500 chars)', () => {
    const result = applySchema.safeParse({
      ...validData,
      craftDescription: 'A'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('requires craft description', () => {
    const { craftDescription, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('accepts craft description exactly 50 characters', () => {
    const result = applySchema.safeParse({
      ...validData,
      craftDescription: 'A'.repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it('accepts craft description exactly 500 characters', () => {
    const result = applySchema.safeParse({
      ...validData,
      craftDescription: 'A'.repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it('validates category enum', () => {
    const result = applySchema.safeParse({
      ...validData,
      category: 'invalid-category',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid category values', () => {
    const categories = ['moda', 'cuero', 'alpargatas', 'joyeria', 'ceramica', 'cosmetica', 'hogar', 'otra'];

    categories.forEach(category => {
      const result = applySchema.safeParse({
        ...validData,
        category,
      });
      expect(result.success).toBe(true);
    });
  });

  it('requires category', () => {
    const { category, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('validates country enum', () => {
    const result = applySchema.safeParse({
      ...validData,
      country: 'XX',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid country values', () => {
    const countries = ['ES', 'PT', 'FR', 'IT', 'DE', 'NL', 'BE', 'PL', 'SE', 'DK', 'AT', 'FI', 'GR', 'HU', 'CZ', 'RO', 'EU'];

    countries.forEach(country => {
      const result = applySchema.safeParse({
        ...validData,
        country,
      });
      expect(result.success).toBe(true);
    });
  });

  it('requires country', () => {
    const { country, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('allows empty referral', () => {
    const result = applySchema.safeParse({
      ...validData,
      referral: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('allows no referral field', () => {
    const { referral, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('validates referral enum', () => {
    const result = applySchema.safeParse({
      ...validData,
      referral: 'invalid-referral',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid referral values', () => {
    const referrals = ['instagram', 'google', 'recommendation', 'press', 'event', 'other'];

    referrals.forEach(referral => {
      const result = applySchema.safeParse({
        ...validData,
        referral,
      });
      expect(result.success).toBe(true);
    });
  });

  it('requires privacy acceptance', () => {
    const result = applySchema.safeParse({
      ...validData,
      privacyAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it('privacy must be true', () => {
    const { privacyAccepted, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('honeypot must be empty', () => {
    const result = applySchema.safeParse({
      ...validData,
      _gotcha: 'filled',
    });
    expect(result.success).toBe(false);
  });

  it('allows honeypot to be empty string', () => {
    const result = applySchema.safeParse({
      ...validData,
      _gotcha: '',
    });
    expect(result.success).toBe(true);
  });

  it('allows honeypot to be undefined', () => {
    const { _gotcha, ...rest } = validData;
    const result = applySchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('rejects honeypot with any content', () => {
    const result = applySchema.safeParse({
      ...validData,
      _gotcha: 'bot-traffic',
    });
    expect(result.success).toBe(false);
  });

  it('validates entire form with minimum required fields', () => {
    const minimalData = {
      fullName: 'María García',
      email: 'maria@example.com',
      phone: '+34612345678',
      craftDescription: 'Ceramista con 10 años de experiencia haciendo piezas únicas.',
      category: 'ceramica',
      country: 'ES',
      privacyAccepted: true,
    };

    const result = applySchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});
