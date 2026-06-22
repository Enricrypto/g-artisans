import { NextRequest, NextResponse } from 'next/server';
import { applySchema } from '@/lib/validations';

// POST /api/apply
// Producer application submission
// See Section 4.1 of docs/TRD.md

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check honeypot
    if (body._gotcha) {
      return NextResponse.json({ success: true });
    }

    // Validate with Zod
    applySchema.parse(body);

    // TODO: Rate limit check (3 req/hour per IP)
    // TODO: Check available spots
    // TODO: Create Airtable record
    // TODO: Send confirmation email
    // TODO: Send internal notification

    return NextResponse.json(
      { success: true, id: 'rec_placeholder' },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Apply error:', error);

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

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
