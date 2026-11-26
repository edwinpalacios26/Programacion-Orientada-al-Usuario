import { Link } from 'react-router';

export default function NotFoundView() {
  return (
    <main className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>404</p>
      <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Página no encontrada</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        La ruta que intentas visitar no existe o fue movida en FunCapital.
      </p>
      <Link to="/eventos" className="btn btn-primary">
        Explorar eventos disponibles
      </Link>
    </main>
  );
}
