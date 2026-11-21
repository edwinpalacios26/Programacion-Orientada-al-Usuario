import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

export default function AdminDashboardView({ events, orders, onToggleEventStatus }) {
  const [adminTab, setAdminTab] = useState('reports'); 

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalTicketsSold = orders.reduce((sum, o) => sum + o.quantity, 0);
  const totalAvailable = events.reduce(
    (sum, evt) => sum + evt.zones.reduce((zSum, z) => zSum + z.available, 0),
    0
  );

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Panel de Administración y Analítica</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Gestión de inventario, eventos, usuarios y reportes de ventas de FunCapital.
        </p>
      </header>

      {}
      <section
        aria-label="Indicadores clave"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ingresos Totales</span>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success)' }}>
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Boletos Vendidos</span>
          <p style={{ fontSize: '1.65rem', fontWeight: 800 }}>{totalTicketsSold}</p>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Inventario Disponible</span>
          <p style={{ fontSize: '1.65rem', fontWeight: 800 }}>{totalAvailable} cupos</p>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Eventos Activos</span>
          <p style={{ fontSize: '1.65rem', fontWeight: 800 }}>{events.length}</p>
        </div>
      </section>

      {}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn ${adminTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setAdminTab('reports')}
        >
          Reportes y Analítica
        </button>
        <button
          type="button"
          className={`btn ${adminTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setAdminTab('inventory')}
        >
          Eventos e Inventario
        </button>
        <button
          type="button"
          className={`btn ${adminTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setAdminTab('users')}
        >
          Usuarios y Roles
        </button>
      </div>

      {}
      {adminTab === 'reports' && (
        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Ocupación y Ventas por Evento (Gráfico Comparativo)
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {events.map((evt) => {
              const eventOrders = orders.filter((o) => o.eventId === evt.id);
              const sold = eventOrders.reduce((s, o) => s + o.quantity, 0);
              const revenue = eventOrders.reduce((s, o) => s + o.total, 0);
              const remaining = evt.zones.reduce((s, z) => s + z.available, 0);
              const totalCapacity = sold + remaining || 1;
              const pct = Math.min(100, Math.round(((sold + 25) / (totalCapacity + 25)) * 100));

              return (
                <div key={evt.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                    <strong>{evt.title}</strong>
                    <span>
                      {sold} vendidos ({formatCurrency(revenue)}) • {remaining} disp.
                    </span>
                  </div>
                  <div style={{ height: '12px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${evt.status === 'Agotado' ? 100 : pct}%`,
                        height: '100%',
                        background: evt.status === 'Agotado' ? 'var(--danger)' : 'var(--brand-primary)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {}
      {adminTab === 'inventory' && (
        <section className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Evento</th>
                <th style={{ padding: '0.75rem' }}>Zonas / Precios</th>
                <th style={{ padding: '0.75rem' }}>Cupos</th>
                <th style={{ padding: '0.75rem' }}>Estado</th>
                <th style={{ padding: '0.75rem' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{evt.title}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {evt.zones.map((z) => (
                      <div key={z.id} style={{ fontSize: '0.82rem' }}>
                        {z.name}: <strong>{formatCurrency(z.price)}</strong>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {evt.zones.reduce((sum, z) => sum + z.available, 0)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{evt.status}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.7rem' }}
                      onClick={() => onToggleEventStatus(evt.id)}
                    >
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {}
      {adminTab === 'users' && (
        <section className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>Nombre</th>
                <th style={{ padding: '0.75rem' }}>Teléfono</th>
                <th style={{ padding: '0.75rem' }}>Correo</th>
                <th style={{ padding: '0.75rem' }}>Rol</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '0.75rem' }}>{u.phone}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-success">{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
