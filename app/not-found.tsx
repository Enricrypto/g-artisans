import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default function NotFound(): ReactNode {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-noche mb-4">404</h1>
        <p className="text-lg text-muted mb-6">Page not found</p>
        <a href="/" className="text-naranja hover:text-naranja-papaya underline">
          Return to home
        </a>
      </div>
    </div>
  );
}
