// Resend email integration
// See Section 6 of docs/TRD.md for email specifications

import { Resend } from 'resend';
import { ApplyFormData } from './validations';

// Initialize Resend with API key if available (mocks used during development if missing)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hola@g-artisans.com';
const INTERNAL_EMAIL = process.env.RESEND_INTERNAL_EMAIL || 'equipo@g-artisans.com';

// Producer confirmation email with detailed application summary
export async function sendProducerConfirmation(
  producerName: string,
  producerEmail: string,
  data: ApplyFormData,
  locale: string,
) {
  const subject =
    locale === 'es'
      ? 'Tu solicitud en G·Artisans ha sido recibida ✓'
      : 'Your G·Artisans Application Has Been Received ✓';

  const html =
    locale === 'es'
      ? `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; }
      .header { text-align: center; margin-bottom: 32px; }
      .logo { height: 40px; margin-bottom: 16px; }
      h2 { color: #1A2E20; font-size: 24px; margin-bottom: 16px; }
      p { color: #1A2E20; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
      .summary { background: #F5F0E8; border-left: 4px solid #EC8A2D; padding: 16px; margin: 24px 0; }
      .summary-item { color: #1A2E20; margin: 8px 0; }
      .footer { color: #7A7A6E; font-size: 14px; margin-top: 32px; border-top: 1px solid #E4DDD4; padding-top: 16px; }
      .footer-link { color: #EC8A2D; text-decoration: none; }
      .copyright { color: #7A7A6E; font-size: 12px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://g-artisans.com/logo.png" alt="G·Artisans" class="logo">
      </div>

      <h2>Hola ${producerName},</h2>

      <p>Tu solicitud para formar parte de G·Artisans ha sido recibida con éxito.</p>

      <div class="summary">
        <div class="summary-item"><strong>Categoría:</strong> ${data.category}</div>
        <div class="summary-item"><strong>País:</strong> ${data.country}</div>
        <div class="summary-item"><strong>Fecha de envío:</strong> ${new Date().toLocaleDateString('es-ES')}</div>
      </div>

      <p>Revisaremos tu solicitud en los próximos 5-7 días hábiles. Te contactaremos con los próximos pasos.</p>

      <div class="footer">
        Si tienes preguntas, no dudes en contactar a <a href="mailto:support@g-artisans.com" class="footer-link">support@g-artisans.com</a>
      </div>

      <div class="copyright">© 2026 G·Artisans. Todos los derechos reservados.</div>
    </div>
  </body>
</html>
      `
      : `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; }
      .header { text-align: center; margin-bottom: 32px; }
      .logo { height: 40px; margin-bottom: 16px; }
      h2 { color: #1A2E20; font-size: 24px; margin-bottom: 16px; }
      p { color: #1A2E20; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
      .summary { background: #F5F0E8; border-left: 4px solid #EC8A2D; padding: 16px; margin: 24px 0; }
      .summary-item { color: #1A2E20; margin: 8px 0; }
      .footer { color: #7A7A6E; font-size: 14px; margin-top: 32px; border-top: 1px solid #E4DDD4; padding-top: 16px; }
      .footer-link { color: #EC8A2D; text-decoration: none; }
      .copyright { color: #7A7A6E; font-size: 12px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://g-artisans.com/logo.png" alt="G·Artisans" class="logo">
      </div>

      <h2>Hello ${producerName},</h2>

      <p>Your application to join G·Artisans has been received successfully.</p>

      <div class="summary">
        <div class="summary-item"><strong>Category:</strong> ${data.category}</div>
        <div class="summary-item"><strong>Country:</strong> ${data.country}</div>
        <div class="summary-item"><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US')}</div>
      </div>

      <p>We will review your application within 5-7 business days. We'll be in touch with the next steps.</p>

      <div class="footer">
        If you have any questions, feel free to contact <a href="mailto:support@g-artisans.com" class="footer-link">support@g-artisans.com</a>
      </div>

      <div class="copyright">© 2026 G·Artisans. All rights reserved.</div>
    </div>
  </body>
</html>
      `;

  if (!resend) {
    console.log('[MOCK] Producer confirmation email would be sent to:', producerEmail);
    return { id: 'mock_email_id', from: FROM_EMAIL, to: producerEmail, created_at: new Date().toISOString() };
  }

  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to: producerEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send producer confirmation email:', error);
    throw error;
  }
}

// Internal notification email with full application details
export async function sendInternalNotification(
  data: ApplyFormData,
  ipHash: string,
  locale: string,
) {
  const subject = `Nueva solicitud: ${data.fullName} — ${data.category} — ${data.country}`;

  const text = `
Nueva solicitud de productor

Nombre: ${data.fullName}
Email: ${data.email}
Teléfono: ${data.phone}
Categoría: ${data.category}
País: ${data.country}
Descripción del oficio: ${data.craftDescription}
Sitio web: ${data.website || '(no proporcionado)'}
Instagram: ${data.instagram || '(no proporcionado)'}
Cómo nos conoció: ${data.referral || '(no especificado)'}
Idioma del formulario: ${locale === 'es' ? 'Español' : 'English'}
IP Hash: ${ipHash}
Privacidad aceptada: ${data.privacyAccepted ? 'Sí' : 'No'}
Fecha y hora: ${new Date().toISOString()}

Revisar en Airtable: https://airtable.com/appXXXXXX/Productores_Solicitudes
  `;

  if (!resend) {
    console.log('[MOCK] Internal notification email would be sent:', { subject });
    return { id: 'mock_email_id', from: FROM_EMAIL, to: INTERNAL_EMAIL, created_at: new Date().toISOString() };
  }

  try {
    return await resend.emails.send({
      from: FROM_EMAIL,
      to: INTERNAL_EMAIL,
      subject,
      text,
    });
  } catch (error) {
    console.error('Failed to send internal notification email:', error);
    throw error;
  }
}

export async function sendBuyerNotification(buyerEmail: string, locale: string) {
  const subject =
    locale === 'es'
      ? 'Te avisaremos cuando G·Artisans abra sus puertas'
      : "We'll let you know when G·Artisans opens";

  if (!resend) {
    console.log('[MOCK] Buyer notification email would be sent to:', buyerEmail);
    return { id: 'mock_email_id', from: FROM_EMAIL, to: buyerEmail, created_at: new Date().toISOString() };
  }

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
