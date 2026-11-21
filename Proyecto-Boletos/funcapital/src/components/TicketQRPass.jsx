export default function TicketQRPass({ order }) {
  // Genera una matriz determinística 9x9 a partir del ID de la orden
  const seed = order.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cells = Array.from({ length: 81 }, (_, idx) => {
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const isFinder =
      (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
    if (isFinder) {
      return r === 1 && c === 1 || r === 1 && c === 7 || r === 7 && c === 1 ? false : true;
    }
    return ((seed * (idx + 7)) % 5) < 2;
  });

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        textAlign: 'center',
        maxWidth: '380px',
        margin: '0 auto'
      }}
    >
      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Tu pase digital de ingreso</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Presenta este código desde tu celular al llegar al recinto.
      </p>

      <div
        style={{
          display: 'inline-block',
          padding: '1rem',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          background: '#fff'
        }}
      >
        <svg
          width="170"
          height="170"
          viewBox="0 0 9 9"
          role="img"
          aria-label={`Código QR de entrada para orden ${order.id}`}
        >
          {cells.map((filled, i) =>
            filled ? (
              <rect
                key={i}
                x={i % 9}
                y={Math.floor(i / 9)}
                width="0.92"
                height="0.92"
                fill="#0b1120"
              />
            ) : null
          )}
        </svg>
      </div>

      <div
        style={{
          background: 'var(--bg-subtle)',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-sm)',
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>Titular:</span>
        <strong>{order.holderName}</strong>
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>Localidad: <strong>{order.zoneName}</strong></span>
        <span>Orden / Asiento: <strong>#{order.id} / {order.seat}</strong></span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.9rem' }}>
        No compartas capturas de pantalla de este código. El ingreso es válido para un único escaneo.
      </p>
    </div>
  );
}
