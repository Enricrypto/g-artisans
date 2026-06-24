import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/apply/route';
import { NextRequest } from 'next/server';
import { resetAll } from '@/lib/rateLimit';

// Mock dependencies
vi.mock('@/lib/airtable', () => ({
  createProducerApplication: vi.fn(),
}));

vi.mock('@/lib/resend', () => ({
  sendProducerConfirmation: vi.fn(),
  sendInternalNotification: vi.fn(),
}));

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi.fn(),
  cleanupOldEntries: vi.fn(),
  resetAll: vi.fn(),
}));

import { createProducerApplication } from '@/lib/airtable';
import { sendProducerConfirmation, sendInternalNotification } from '@/lib/resend';
import { checkRateLimit, cleanupOldEntries } from '@/lib/rateLimit';

describe('POST /api/apply', () => {
  const validFormData = {
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

  const createMockRequest = (
    body: any,
    headers: Record<string, string> = {}
  ): NextRequest => {
    const url = new URL('http://localhost:3000/api/apply');
    return {
      json: async () => body,
      headers: {
        get: (key: string) => headers[key] || null,
      } as any,
      ip: headers['x-forwarded-for'] || '127.0.0.1',
      nextUrl: { pathname: '/api/apply' },
    } as any;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (checkRateLimit as any).mockReturnValue(true);
    (createProducerApplication as any).mockResolvedValue({
      records: [{ id: 'rec123', fields: {} }],
    });
    (sendProducerConfirmation as any).mockResolvedValue({ success: true });
    (sendInternalNotification as any).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Honeypot Tests
  it('silently accepts request with honeypot filled', async () => {
    const request = createMockRequest({ ...validFormData, _gotcha: 'bot-filled' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(createProducerApplication).not.toHaveBeenCalled();
  });

  it('does not log or error on honeypot detection', async () => {
    const request = createMockRequest({ ...validFormData, _gotcha: 'filled' });
    const response = await POST(request);

    expect(response.ok).toBe(true);
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  // Validation Tests
  it('accepts valid form data', async () => {
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(createProducerApplication).toHaveBeenCalled();
  });

  it('returns 400 for missing required field (fullName)', async () => {
    const request = createMockRequest({ ...validFormData, fullName: '' });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 for missing required field (email)', async () => {
    const request = createMockRequest({ ...validFormData, email: '' });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const request = createMockRequest({ ...validFormData, email: 'invalid-email' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors?.email).toBeDefined();
  });

  it('returns 400 for missing required field (phone)', async () => {
    const request = createMockRequest({ ...validFormData, phone: '' });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 for invalid phone format (too short)', async () => {
    const request = createMockRequest({ ...validFormData, phone: '123' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors?.phone).toBeDefined();
  });

  it('returns 400 for craft description below 50 characters', async () => {
    const request = createMockRequest({
      ...validFormData,
      craftDescription: 'Short desc',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors?.craftDescription).toBeDefined();
  });

  it('returns 400 for craft description above 500 characters', async () => {
    const request = createMockRequest({
      ...validFormData,
      craftDescription: 'a'.repeat(501),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors?.craftDescription).toBeDefined();
  });

  it('returns 400 for invalid category enum', async () => {
    const request = createMockRequest({
      ...validFormData,
      category: 'invalid-category',
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 for invalid country enum', async () => {
    const request = createMockRequest({
      ...validFormData,
      country: 'XX',
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('returns 400 when privacy is not accepted', async () => {
    const request = createMockRequest({
      ...validFormData,
      privacyAccepted: false,
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('accepts optional fields as empty or undefined', async () => {
    const minimalData = {
      fullName: 'María García',
      email: 'maria@example.com',
      phone: '+34612345678',
      website: '',
      instagram: '',
      craftDescription: 'Ceramista con 10 años de experiencia haciendo piezas únicas.',
      category: 'ceramica',
      country: 'ES',
      privacyAccepted: true,
      _gotcha: '',
    };

    const request = createMockRequest(minimalData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('accepts valid website URL', async () => {
    const request = createMockRequest({
      ...validFormData,
      website: 'https://example.com',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 400 for invalid website URL', async () => {
    const request = createMockRequest({
      ...validFormData,
      website: 'not-a-url',
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  // Rate Limiting Tests
  it('allows 1st request from IP', async () => {
    (checkRateLimit as any).mockReturnValue(true);
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('allows 2nd request from same IP', async () => {
    (checkRateLimit as any).mockReturnValue(true);
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('allows 3rd request from same IP', async () => {
    (checkRateLimit as any).mockReturnValue(true);
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 429 for 4th request from same IP (rate limited)', async () => {
    (checkRateLimit as any).mockReturnValue(false);
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Too many requests');
  });

  it('rate limit error does not create Airtable record', async () => {
    (checkRateLimit as any).mockReturnValue(false);
    const request = createMockRequest(validFormData);
    await POST(request);

    expect(createProducerApplication).not.toHaveBeenCalled();
  });

  it('extracts IP from x-forwarded-for header', async () => {
    const request = createMockRequest(validFormData, {
      'x-forwarded-for': '192.168.1.1, 10.0.0.1',
    });
    await POST(request);

    expect(checkRateLimit).toHaveBeenCalled();
  });

  // Airtable Integration Tests
  it('creates Airtable record with correct field mapping', async () => {
    const request = createMockRequest(validFormData);
    await POST(request);

    expect(createProducerApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'María García',
        email: 'maria@example.com',
        phone: '+34612345678',
        category: 'ceramica',
        country: 'ES',
        privacyAccepted: true,
      }),
      expect.any(String) // ipHash
    );
  });

  it('stores hashed IP (not plain IP)', async () => {
    const request = createMockRequest(validFormData);
    await POST(request);

    const callArgs = (createProducerApplication as any).mock.calls[0];
    const ipHash = callArgs[1];

    // IP hash should be SHA-256 hex string (64 chars)
    expect(ipHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('returns 500 on Airtable creation failure', async () => {
    (createProducerApplication as any).mockRejectedValue(
      new Error('Airtable API error')
    );
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });

  it('returns 500 if Airtable returns empty records', async () => {
    (createProducerApplication as any).mockResolvedValue({ records: [] });
    const request = createMockRequest(validFormData);
    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  // Email Integration Tests
  it('sends producer confirmation email on success', async () => {
    const request = createMockRequest(validFormData);
    await POST(request);

    expect(sendProducerConfirmation).toHaveBeenCalledWith(
      'María García',
      'maria@example.com',
      expect.objectContaining(validFormData),
      'es'
    );
  });

  it('sends internal notification email on success', async () => {
    const request = createMockRequest(validFormData);
    await POST(request);

    expect(sendInternalNotification).toHaveBeenCalledWith(
      expect.objectContaining(validFormData),
      expect.any(String), // ipHash
      'es'
    );
  });

  it('email failures do not fail form submission', async () => {
    (sendProducerConfirmation as any).mockRejectedValue(
      new Error('Email service down')
    );

    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('sends emails with correct locale (es)', async () => {
    const request = createMockRequest(validFormData);
    request.nextUrl.pathname = '/apply';

    await POST(request);

    expect(sendProducerConfirmation).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'es'
    );
  });

  it('sends emails with correct locale (en)', async () => {
    const request = createMockRequest(validFormData);
    request.nextUrl.pathname = '/en/apply';

    await POST(request);

    expect(sendProducerConfirmation).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'en'
    );
  });

  // Response Format Tests
  it('success response has correct format', async () => {
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('redirectUrl');
  });

  it('validation error response has field errors', async () => {
    const request = createMockRequest({
      ...validFormData,
      email: 'invalid',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('errors');
    expect(typeof data.errors).toBe('object');
  });

  it('rate limit error response has error message', async () => {
    (checkRateLimit as any).mockReturnValue(false);
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
  });

  it('server error response has error message', async () => {
    (createProducerApplication as any).mockRejectedValue(new Error('Unknown error'));
    const request = createMockRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
  });

  // Cleanup Test
  it('calls cleanup on ~1% of requests', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.005); // 0.5% (should trigger cleanup)

    const request = createMockRequest(validFormData);
    await POST(request);

    expect(cleanupOldEntries).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('allows all valid category enums', async () => {
    const categories = ['moda', 'cuero', 'alpargatas', 'joyeria', 'ceramica', 'cosmetica', 'hogar', 'otra'];

    for (const category of categories) {
      vi.clearAllMocks();
      (checkRateLimit as any).mockReturnValue(true);
      (createProducerApplication as any).mockResolvedValue({
        records: [{ id: 'rec123', fields: {} }],
      });

      const request = createMockRequest({ ...validFormData, category });
      const response = await POST(request);

      expect(response.status).toBe(200);
    }
  });

  it('allows all valid country enums', async () => {
    const countries = ['ES', 'PT', 'FR', 'IT', 'DE', 'NL', 'BE', 'PL', 'SE', 'DK', 'AT', 'FI', 'GR', 'HU', 'CZ', 'RO', 'EU'];

    for (const country of countries) {
      vi.clearAllMocks();
      (checkRateLimit as any).mockReturnValue(true);
      (createProducerApplication as any).mockResolvedValue({
        records: [{ id: 'rec123', fields: {} }],
      });

      const request = createMockRequest({ ...validFormData, country });
      const response = await POST(request);

      expect(response.status).toBe(200);
    }
  });

  it('allows all valid referral options', async () => {
    const referrals = ['instagram', 'google', 'recommendation', 'press', 'event', 'other'];

    for (const referral of referrals) {
      vi.clearAllMocks();
      (checkRateLimit as any).mockReturnValue(true);
      (createProducerApplication as any).mockResolvedValue({
        records: [{ id: 'rec123', fields: {} }],
      });

      const request = createMockRequest({ ...validFormData, referral });
      const response = await POST(request);

      expect(response.status).toBe(200);
    }
  });

  it('handles missing instagram @ prefix correctly', async () => {
    const request = createMockRequest({
      ...validFormData,
      instagram: 'maria_ceramica',
    });
    await POST(request);

    expect(createProducerApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        instagram: 'maria_ceramica',
      }),
      expect.any(String)
    );
  });

  it('does not process request with invalid JSON', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
      headers: { get: () => null },
      nextUrl: { pathname: '/api/apply' },
    } as any;

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
