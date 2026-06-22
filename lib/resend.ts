// Resend email integration
// See Section 6 of docs/TRD.md for email specifications

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hola@g-artisans.com';
const INTERNAL_EMAIL = process.env.RESEND_INTERNAL_EMAIL || 'equipo@g-artisans.com';

export async function sendProducerConfirmation(
  producerName: string,
  producerEmail: string,
  locale: string,
) {
  const subject =
    locale === 'es'
      ? 'Tu solicitud en G·Artisans ha sido recibida ✓'
      : 'Your G·Artisans application has been received ✓';

  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to: producerEmail,
      subject,
      html: `<p>Hola ${producerName},</p><p>Tu solicitud ha sido recibida.</p>`,
    });
  } catch (error) {
    console.error('Failed to send producer confirmation email:', error);
    throw error;
  }
}

export async function sendInternalNotification(
  producerData: Record<string, any>,
  locale: string,
) {
  const subject = `Nueva solicitud de productor: ${producerData.fullName}`;

  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to: INTERNAL_EMAIL,
      subject,
      html: `<h2>${subject}</h2><pre>${JSON.stringify(producerData, null, 2)}</pre>`,
    });
  } catch (error) {
    console.error('Failed to send internal notification:', error);
    throw error;
  }
}

export async function sendBuyerNotification(buyerEmail: string, locale: string) {
  const subject =
    locale === 'es'
      ? 'Te avisaremos cuando G·Artisans abra sus puertas'
      : "We'll let you know when G·Artisans opens";

  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to: buyerEmail,
      subject,
      html: '<p>Gracias por tu interés.</p>',
    });
  } catch (error) {
    console.error('Failed to send buyer notification:', error);
    throw error;
  }
}
