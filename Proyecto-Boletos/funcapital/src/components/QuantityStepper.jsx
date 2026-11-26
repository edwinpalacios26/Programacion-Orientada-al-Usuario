export default function QuantityStepper({ quantity, max = 10, onChange }) { // cambia la cantidad de boletos a comprar, con un maximo de 10
  return (
    <div
      role="group"
      aria-label="Selector de cantidad de boletos"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Disminuir cantidad"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          background: '#fee2e2',
          color: '#dc2626',
          fontWeight: 700,
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        -
      </button>

      <span aria-live="polite" style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Aumentar cantidad"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          background: '#e2e8f0',
          color: '#0f172a',
          fontWeight: 700,
          cursor: quantity >= max ? 'not-allowed' : 'pointer'
        }}
      >
        +
      </button>
    </div>
  );
}
