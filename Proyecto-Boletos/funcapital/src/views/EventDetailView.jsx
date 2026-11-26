import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { fakeApi } from '../api/fakeApi';
import { useApp } from '../context/AppContext';
import QuantityStepper from '../components/QuantityStepper';
import { LoadingSpinner, ErrorBanner } from '../components/StatusFeedback';
import { formatCurrency } from '../utils/helpers';

export default function EventDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [event, setEvent] = useState(() => state.events.find((e) => e.id === id) || null);
  const [loading, setLoading] = useState(!event);
  const [error, setError] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fakeApi
      .getEventById(id, { signal: controller.signal })
      .then((data) => {
        setEvent(data);
        const firstAvailable = data.zones.find((z) => z.available > 0) || data.zones[0];
        setSelectedZoneId(firstAvailable?.id || '');
        setQuantity(1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="container" style={{ paddingTop: '2rem' }}>
        <LoadingSpinner text="Cargando detalle del evento..." />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="container" style={{ paddingTop: '2rem' }}>
        <ErrorBanner
          title="Evento no disponible"
          message={error || 'No se encontró el evento solicitado.'}
          onRetry={() => navigate('/eventos')}
        />
      </main>
    );
  }

  const activeZone = event.zones.find((z) => z.id === selectedZoneId) || event.zones[0];
  const maxAllowed = activeZone ? Math.min(10, activeZone.available) : 0;
  const isSoldOut = event.status === 'Agotado' || !activeZone || activeZone.available === 0;
  const subtotal = activeZone ? activeZone.price * quantity : 0;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    dispatch({
      type: 'SET_CART',
      payload: {
        eventId: event.id,
        eventTitle: event.title,
        venue: event.venue,
        displayDate: event.displayDate,
        image: event.image,
        zoneId: activeZone.id,
        zoneName: activeZone.name,
        unitPrice: activeZone.price,
        quantity,
        serviceFeeRate: event.serviceFeeRate
      }
    });
    navigate('/carrito');
  };

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/eventos" className="btn btn-outline" style={{ marginBottom: '1.25rem' }}>
        ← Volver a eventos
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
        <section className="card" style={{ overflow: 'hidden' }}>
          <img
            src={event.image}
            alt={`Portada de ${event.title}`}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
          <div style={{ padding: '1.5rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
              {event.category} • {event.status}
            </span>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>{event.title}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{event.subtitle}</p>
            <p style={{ fontSize: '0.92rem' }}><strong>Lugar:</strong> {event.venue}</p>
            <p style={{ fontSize: '0.92rem' }}><strong>Fecha:</strong> {event.displayDate}</p>
          </div>
        </section>

        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Selecciona tu localidad</h2>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {event.zones.map((zone) => {
              const selected = zone.id === activeZone?.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  disabled={zone.available === 0}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setQuantity(1);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: selected ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    background: selected ? 'var(--bg-subtle)' : '#fff',
                    cursor: zone.available === 0 ? 'not-allowed' : 'pointer',
                    opacity: zone.available === 0 ? 0.55 : 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700 }}>{zone.name}</p>
                    <small style={{ color: 'var(--text-muted)' }}>
                      {zone.available > 0 ? `${zone.available} disponibles` : 'Agotado'}
                    </small>
                  </div>
                  <strong>{formatCurrency(zone.price)}</strong>
                </button>
              );
            })}
          </div>

          {!isSoldOut && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 600 }}>Cantidad de boletos:</span>
              <QuantityStepper quantity={quantity} max={maxAllowed} onChange={setQuantity} />
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal estimado:</span>
            <strong style={{ fontSize: '1.3rem' }}>{formatCurrency(subtotal)}</strong>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            style={{ width: '100%', padding: '0.9rem' }}
          >
            {isSoldOut ? 'Localidades agotadas' : 'Continuar al carrito'}
          </button>
        </section>
      </div>
    </main>
  );
}
