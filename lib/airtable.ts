// Airtable integration
// See Section 5 of docs/TRD.md for schema details

import { ApplyFormData } from './validations';

// Airtable API response types
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

export async function airtableRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3,
): Promise<T> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          ...options,
        },
      );

      if (!response.ok) {
        if (response.status === 429 && i < retries - 1) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }

  throw new Error('Airtable request failed after retries');
}

// Create a new producer application record
// Maps ApplyFormData to Airtable Productores_Solicitudes table
export async function createProducerApplication(
  data: ApplyFormData,
  ipHash: string,
): Promise<AirtableResponse> {
  const fields = {
    'Full Name': data.fullName,
    'Email': data.email,
    'Phone': data.phone,
    'Website': data.website || null,
    'Instagram': data.instagram ? data.instagram.replace(/^@/, '') : null,
    'Craft Description': data.craftDescription,
    'Category': data.category,
    'Country': data.country,
    'Referral': data.referral || null,
    'Privacy Accepted': data.privacyAccepted,
    'IP Hash': ipHash,
    'Submitted At': new Date().toISOString(),
    'Status': 'Pending',
  };

  return airtableRequest<AirtableResponse>('Productores_Solicitudes', {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
  });
}

// Get available spots (approved producers vs. max capacity)
export async function getAvailableSpots(): Promise<{ available: number; total: number }> {
  const total = parseInt(process.env.NEXT_PUBLIC_MAX_SPOTS || '50');

  try {
    // Query approved producers from Airtable using filterByFormula
    const result = await airtableRequest<any>(
      `Productores_Solicitudes?filterByFormula=%7BStatus%7D%3D%27Aprobado%27`,
    );

    const approved = result.records?.length || 0;
    const available = Math.max(0, total - approved);

    return { available, total };
  } catch (error) {
    console.error('Failed to fetch available spots:', error);
    // Fallback: assume no approvals yet (conservative approach)
    return { available: total, total };
  }
}

// Create a buyer/waitlist interest record
export async function createBuyerInterest(
  email: string,
  locale: string,
): Promise<AirtableResponse> {
  const fields = {
    'Email': email,
    'Idioma': locale,
    'Registered At': new Date().toISOString(),
  };

  return airtableRequest<AirtableResponse>('Compradores_Interesados', {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
  });
}
