export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-noche mb-4">404</h1>
        <p className="text-xl text-muted mb-8">Página no encontrada / Page not found</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-naranja text-white rounded-pill hover:bg-naranja-papaya transition-colors"
        >
          Volver al inicio / Return to home
        </a>
      </div>
    </div>
  );
}
