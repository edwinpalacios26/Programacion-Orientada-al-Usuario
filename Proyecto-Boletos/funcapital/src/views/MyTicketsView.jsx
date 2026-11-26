import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import TicketQRPass from '../components/TicketQRPass';
import { EmptyState } from '../components/StatusFeedback';

export default function MyTicketsView() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailToast, setEmailToast] = useState('');

  const handleSimulateEmail = (order) => {
    setEmailToast(`Pase digital #${order.id} reenviado a ${state.currentUser?.email || 'tu correo registrado'}.`);
    setTimeout(() => setEmailToast(''), 4000);
  };

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mis Tickets</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Consulta tus pases electrónicos activos y presenta tu código QR en el acceso al evento.
        </p>
      </div>

      {emailToast && (
        <div
          role="status"
          style={{
            background: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontWeight: 600
          }}
        >
          ✓ {emailToast}
        </div>
      )}

      {state.orders.length === 0 ? (
        <EmptyState
          icon=""
          title="Aún no tienes boletos adquiridos"
          description="Explora la cartelera de eventos y adquiere tus entradas en segundos."
          actionLabel="Explorar eventos"
          onAction={() => navigate('/eventos')}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {state.orders.map((order) => (
            <article key={order.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img
                src={order.image}
                alt={`Portada de ${order.eventTitle}`}
                style={{ width: '100%', height: '165px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-success">{order.status}</span>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>#{order.id}</small>
                </div>

                <h2 style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{order.eventTitle}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.venue}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.displayDate}</p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                  <p><strong>Localidad:</strong> {order.zoneName}</p>
                  <p><strong>Cantidad:</strong> {order.quantity} {order.quantity === 1 ? 'Ticket' : 'Tickets'} • <strong>Asiento:</strong> {order.seat}</p>
                </div>

                <div style={{ display: 'grid', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Ver boleto (QR)
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleSimulateEmail(order)}
                  >
                    Reenviar al correo
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.eventTitle || 'Pase Digital'}
      >
        {selectedOrder && <TicketQRPass order={selectedOrder} />}
      </Modal>
    </main>
  );
}
