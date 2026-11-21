import { useState } from 'react';
import QuantityStepper from '../components/QuantityStepper';
import { formatCurrency } from '../utils/helpers';

export default function EventDetailView({ event, onBack, onAddToCart }) {
  const defaultZone = event.zones.find((z) => z.available > 0) || event.zones;
  const [selectedZoneId, setSelectedZoneId] = useState(defaultZone.id);
  const [quantity, setQuantity] = useState(1);

  const activeZone = event.zones.find((z) => z.id === selectedZoneId) || event.zones;
  const maxAllowed = Math.min(10, activeZone.available);
  const isSoldOut = activeZone.available === 0 || event.status === 'Agotado';

  const handleZoneChange = (e) => {
    setSelectedZoneId(e.target.value);
    setQuantity(1);
  };

  const handleContinue = () => {
    if (isSoldOut) return;
    onAddToCart({
      eventId: event.id,
      eventTitle: event.title,
      venue: event.venue,
      displayDate: event.displayDate,
      image: event.image,
      serviceFeeRate: event.serviceFeeRate,
      zoneId: activeZone.id,
      zoneName: activeZone.name,
      unitPrice: activeZone.price,
      quantity
    });
  };

  return (
    <main className="container" style={{ paddingTop: '1.5rem' }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onBack}
        style={{ marginBottom: '1rem' }}
      >
        ← Volver a eventos
      </button>

      {}
      <section
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '220px',
          backgroundColor: '#0b1120',
          color: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1.75rem',
          marginBottom: '1.75rem',
          backgroundImage: `linear-gradient(to top, rgba(11,17,32,0.92), rgba(11,17,32,0.35)), url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            {event.category}
          </span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800 }}>
            {event.title}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{event.venue}</p>
          <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {event.displayDate}
          </p>
        </div>
      </section>

      {}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Selecciona tus boletos</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Recuerda que puedes realizar únicamente una compra por persona y máximo 10 tickets por compra.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="zone-select"
              style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.45rem' }}
            >
              Localidades *
            </label>
            <select
              id="zone-select"
              value={selectedZoneId}
              onChange={handleZoneChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#fff',
                fontSize: '0.95rem'
              }}
            >
              {event.zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} — {formatCurrency(zone.price)} ({zone.available} disp.)
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <p style={{ fontWeight: 700 }}>{activeZone.name}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {formatCurrency(activeZone.price)} c/u • {activeZone.available} disponibles
              </p>
            </div>

            {!isSoldOut && (
              <QuantityStepper
                quantity={quantity}
                max={maxAllowed}
                onChange={setQuantity}
              />
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={isSoldOut}
            onClick={handleContinue}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
          >
            {isSoldOut
              ? 'Localidad Agotada'
              : `Continuar (${formatCurrency(activeZone.price * quantity)})`}
          </button>
        </section>

        <aside className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>{event.venue}</h3>
          <img
            src={event.image}
            alt={`Afiche oficial de ${event.title}`}
            style={{
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxHeight: '360px',
              objectFit: 'cover',
              marginBottom: '0.75rem'
            }}
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Disfruta Responsablemente • FunCapital El Salvador
          </p>
        </aside>
      </div>
    </main>
  );
}
