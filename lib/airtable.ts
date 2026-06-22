// Airtable integration
// See Section 5 of docs/TRD.md for schema details

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

// Placeholder methods for Airtable operations
export async function createProducerApplication(data: any) {
  // TODO: Implement after form schema is finalized
  return airtableRequest('Productores_Solicitudes', {
    method: 'POST',
    body: JSON.stringify({ fields: data }),
  });
}

export async function getAvailableSpots(): Promise<{ available: number; total: number }> {
  // TODO: Implement spot counting logic
  return { available: 50, total: 50 };
}

export async function createBuyerInterest(email: string, locale: string) {
  // TODO: Implement buyer waitlist registration
  return airtableRequest('Compradores_Interesados', {
    method: 'POST',
    body: JSON.stringify({ fields: { Email: email, Idioma: locale } }),
  });
}
