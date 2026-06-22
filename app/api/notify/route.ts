import { NextRequest, NextResponse } from 'next/server';
import { buyerNotifySchema } from '@/lib/validations';

// POST /api/notify
// Marketplace waitlist subscription
// See Section 4.4 of docs/TRD.md

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    buyerNotifySchema.parse(body);

    // TODO: Rate limit check
    // TODO: Check if email already exists
    // TODO: Create Airtable record in Compradores_Interesados
    // TODO: Send confirmation email

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Notify error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
