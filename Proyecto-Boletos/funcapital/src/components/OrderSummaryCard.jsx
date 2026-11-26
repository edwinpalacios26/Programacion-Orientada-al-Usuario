import { formatCurrency } from '../utils/helpers';

export default function OrderSummaryCard({ item, orderCode }) {
  if (!item) return null; 

  const subtotal = item.unitPrice * item.quantity;
  const serviceFee = Number((subtotal * item.serviceFeeRate).toFixed(2)); 
  const total = subtotal + serviceFee;

  return (
    <aside className="card" style={{ padding: '1.25rem' }} aria-label="Detalles de la transacción">
      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Detalles de la transacción</h3>
      <p style={{ fontWeight: 700 }}>{item.eventTitle}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.venue}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {item.displayDate}
      </p>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'grid', gap: '0.45rem', fontSize: '0.9rem' }}>
        {orderCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Código de orden:</span>
            <strong>#{orderCode}</strong>  
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Localidad:</span>
          <strong>{item.zoneName}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Cantidad:</span>
          <strong>{item.quantity} {item.quantity === 1 ? 'Ticket' : 'Tickets'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Precio unitario:</span>
          <span>{formatCurrency(item.unitPrice)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Cargo por servicio:</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.65rem',
            marginTop: '0.25rem',
            fontSize: '1.05rem'
          }}
        >
          <strong>Total:</strong>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </aside>
  );
}
