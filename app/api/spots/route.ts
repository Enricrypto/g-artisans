import { NextRequest, NextResponse } from 'next/server';

// GET /api/spots
// Returns available spots count
// See Section 4.2 of docs/TRD.md

export async function GET(request: NextRequest) {
  try {
    // TODO: Query Airtable for spot count
    const available = 50;
    const total = 50;

    return NextResponse.json(
      {
        available,
        total,
        full: available === 0,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch spots:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
