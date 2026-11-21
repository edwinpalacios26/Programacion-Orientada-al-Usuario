import { useState } from 'react';
import Modal from '../components/Modal';
import TicketQRPass from '../components/TicketQRPass';
import { EmptyState } from '../components/StatusFeedback';

export default function MyTicketsView({ orders, onNavigate }) {
  const [tab, setTab] = useState('upcoming');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const displayedOrders = tab === 'upcoming' ? orders : [];

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mis Eventos</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Consulta, administra y descarga tus boletos digitales para los próximos eventos.
        </p>
      </header>

      <div role="tablist" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'upcoming'}
          className={`btn ${tab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('upcoming')}
        >
          Próximos eventos ({orders.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'past'}
          className={`btn ${tab === 'past' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('past')}
        >
          Eventos pasados (0)
        </button>
      </div>

      {displayedOrders.length === 0 ? (
        <EmptyState
          icon=""
          title="No tienes eventos en esta sección"
          description="Explora nuestra cartelera en El Salvador y adquiere tus entradas digitales."
          actionLabel="Ver cartelera de eventos"
          onAction={() => onNavigate('home')}
        />
      ) : (
        <div style={{ display: 'grid', gap: '1.1rem' }}>
          {displayedOrders.map((ord) => (
            <article
              key={ord.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                alignItems: 'center'
              }}
            >
              <img
                src={ord.image}
                alt={ord.eventTitle}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />

              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
                  {ord.status}
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{ord.eventTitle}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{ord.venue}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ord.displayDate}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem' }}>
                  Localidad: <strong>{ord.zoneName}</strong>
                </span>
                <span style={{ fontSize: '0.85rem' }}>
                  {ord.quantity} {ord.quantity === 1 ? 'Ticket' : 'Tickets'} • Orden <strong>#{ord.id}</strong>
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedOrder(ord)}
                  style={{ marginTop: '0.35rem' }}
                >
                  Ver boleto (QR)
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? selectedOrder.eventTitle : 'Boleto Digital'}
      >
        {selectedOrder && <TicketQRPass order={selectedOrder} />}
      </Modal>
    </main>
  );
}
