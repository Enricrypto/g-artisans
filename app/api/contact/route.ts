import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

// POST /api/contact
// Contact form submission
// See Section 4.3 of docs/TRD.md

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    contactSchema.parse(body);

    // TODO: Rate limit check (5 req/hour per IP)
    // TODO: Send internal notification email

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Contact error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
