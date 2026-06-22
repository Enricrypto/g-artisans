export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function hashIP(ip: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(ip).digest('hex');
}
