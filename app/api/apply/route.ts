import { NextRequest, NextResponse } from 'next/server';
import { applySchema } from '@/lib/validations';
import { hashIP } from '@/lib/utils';
import { checkRateLimit, cleanupOldEntries } from '@/lib/rateLimit';
import { createProducerApplication } from '@/lib/airtable';
import { sendProducerConfirmation, sendInternalNotification } from '@/lib/resend';

// POST /api/apply
// Producer application submission
// See Section 4.1 of docs/TRD.md

export async function POST(request: NextRequest) {
  try {
    // Extract IP address from request (Vercel x-forwarded-for header)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      '0.0.0.0';

    // Hash IP for storage (never store plain IP)
    const ipHash = hashIP(ip);

    // Parse request body
    const body = await request.json();

    // Check honeypot (silently pass, no logging, no error)
    if (body._gotcha) {
      return NextResponse.json({ success: true });
    }

    // Validate with Zod
    const validatedData = applySchema.parse(body);

    // Check rate limit (3 requests per hour per IP hash)
    const isAllowed = checkRateLimit(ipHash, 3, 3600000);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Extract locale from request URL (es by default, en if /en prefix)
    const locale = request.nextUrl.pathname.startsWith('/en') ? 'en' : 'es';

    // Create Airtable record
    try {
      const result = await createProducerApplication(validatedData, ipHash);
      // Result contains { records: [{ id: 'recXXX', fields: {...} }] }
      if (!result || !Array.isArray(result.records) || result.records.length === 0) {
        throw new Error('Airtable record creation returned empty response');
      }
    } catch (error: any) {
      console.error('Airtable creation failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit application. Please try again.' },
        { status: 500 },
      );
    }

    // Send producer confirmation email (non-blocking — log error but continue)
    try {
      await sendProducerConfirmation(
        validatedData.fullName,
        validatedData.email,
        validatedData,
        locale,
      );
    } catch (error: any) {
      console.error('Failed to send producer confirmation email:', error);
      // Do not fail the request — data is already saved to Airtable
      // Email retry can be handled manually or via future queue system
    }

    // Send internal notification email (non-blocking — log error but continue)
    try {
      await sendInternalNotification(validatedData, ipHash, locale);
    } catch (error: any) {
      console.error('Failed to send internal notification email:', error);
      // Do not fail the request — data is already saved to Airtable
    }

    // Cleanup old rate limit entries (1% sampling to prevent unbounded memory growth)
    if (Math.random() < 0.01) {
      cleanupOldEntries();
    }

    // Success response
    return NextResponse.json(
      { success: true, redirectUrl: '/apply/success' },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Apply API error:', error);

    // Zod validation errors — return field-level errors
    if (error.name === 'ZodError') {
      const errors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      return NextResponse.json(
        { success: false, errors },
        { status: 400 },
      );
    }

    // Generic server error
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
