import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fakeApi } from '../api/fakeApi';
import { formatCurrency } from '../utils/formatters';
import { ErrorBanner } from '../components/StatusFeedback';

const EMPTY_EVENT_FORM = {
  title: '',
  subtitle: '',
  category: 'Concierto',
  status: 'Disponible',
  venue: 'Complejo Cuscatlán, San Salvador',
  displayDate: 'Próximamente • 8:00 PM',
  generalPrice: 35,
  generalAvailable: 100
};

export default function AdminDashboardView() {
  const { state, dispatch } = useApp();
  const { events, orders, currentUser } = state;

  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');


  const [reportEventId, setReportEventId] = useState('ALL');
  const [reportDateFrom, setReportDateFrom] = useState('');

  const isAdmin = currentUser?.role === 'administrador';



  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalTicketsSold = orders.reduce(
      (acc, o) =>
        acc + (Array.isArray(o.items) ? o.items.reduce((sum, i) => sum + i.quantity, 0) : Number(o.quantity) || 1),
      0
    );
    const totalAvailableSeats = events.reduce(
      (acc, ev) => acc + (ev.zones || []).reduce((sum, z) => sum + (Number(z.available) || 0), 0),
      0
    );
    return { totalRevenue, totalTicketsSold, totalAvailableSeats };
  }, [orders, events]);


  const reportSummaryByEvent = useMemo(() => {
    const filteredOrders = orders.filter((order) => {
      if (reportEventId !== 'ALL' && order.eventId !== reportEventId) return false;
      if (reportDateFrom && order.createdAt && order.createdAt.slice(0, 10) < reportDateFrom) return false;
      return true;
    });

    const grouped = {};
    filteredOrders.forEach((order) => {
      if (!grouped[order.eventTitle]) {
        grouped[order.eventTitle] = { title: order.eventTitle, tickets: 0, revenue: 0 };
      }
      const qty = Array.isArray(order.items)
        ? order.items.reduce((s, i) => s + i.quantity, 0)
        : Number(order.quantity) || 1;
      grouped[order.eventTitle].tickets += qty;
      grouped[order.eventTitle].revenue += Number(order.total) || 0;
    });
    return Object.values(grouped);
  }, [orders, reportEventId, reportDateFrom]);


  const maxRevenue = Math.max(...reportSummaryByEvent.map((r) => r.revenue), 1);

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');
    try {
      if (editingId) {
        const target = events.find((ev) => ev.id === editingId);
        const updated = await fakeApi.saveEvent({ ...target, ...eventForm });
        dispatch({ type: 'UPDATE_EVENT', payload: updated });
        setFeedback('Evento actualizado correctamente.');
        setEditingId(null);
      } else {
        const created = await fakeApi.saveEvent({
          ...eventForm,
          zones: [
            {
              id: `z-${Date.now()}`,
              name: 'General',
              price: Number(eventForm.generalPrice) || 25,
              capacity: Number(eventForm.generalAvailable) || 100,
              available: Number(eventForm.generalAvailable) || 100
            }
          ]
        });
        dispatch({ type: 'ADD_EVENT', payload: created });
        setFeedback('Nuevo evento creado y publicado.');
      }
      setEventForm(EMPTY_EVENT_FORM);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEdit = (ev) => {
    setEditingId(ev.id);
    setEventForm({
      title: ev.title,
      subtitle: ev.subtitle || '',
      category: ev.category,
      status: ev.status,
      venue: ev.venue,
      displayDate: ev.displayDate,
      generalPrice: ev.zones[0]?.price || 35,
      generalAvailable: ev.zones[0]?.available || 100
    });
  };

  const handleDeleteEvent = async (id) => {
    setError('');
    setFeedback('');
    try {
      await fakeApi.deleteEvent(id);
      dispatch({ type: 'DELETE_EVENT', payload: id });
      setFeedback('Evento eliminado del catálogo.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleZoneUpdate = async (ev, zoneId, field, rawValue) => {
    const val = Math.max(0, Number(rawValue) || 0);
    const updatedZones = ev.zones.map((z) =>
      z.id === zoneId ? { ...z, [field]: val } : z
    );
    const updatedEvent = await fakeApi.saveEvent({ ...ev, zones: updatedZones });
    dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    setFeedback(`Inventario actualizado para "${ev.title}".`);
  };


  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Panel de Gestión ({currentUser?.role})
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Administración de eventos, localidades, precios y métricas de venta.
        </p>
      </header>

      {error && <ErrorBanner title="Error en operación" message={error} />}
      {feedback && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontWeight: 600
          }}
        >
          ✓ {feedback}
        </div>
      )}

     
      <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn ${activeSection === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSection('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`btn ${activeSection === 'eventos' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSection('eventos')}
        >
          CRUD Eventos
        </button>
        <button
          type="button"
          className={`btn ${activeSection === 'inventario' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSection('inventario')}
        >
          Inventario y Precios
        </button>
        {isAdmin && (
          <button
            type="button"
            className={`btn ${activeSection === 'reportes' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection('reportes')}
          >
            Reportes Dinámicos
          </button>
        )}
      </nav>

      
      {activeSection === 'dashboard' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <article className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>INGRESOS TOTALES</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {formatCurrency(metrics.totalRevenue)}
            </p>
          </article>
          <article className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>TICKETS VENDIDOS</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{metrics.totalTicketsSold}</p>
          </article>
          <article className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>CUPOS DISPONIBLES</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{metrics.totalAvailableSeats}</p>
          </article>
          <article className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>EVENTOS ACTIVOS</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{events.length}</p>
          </article>
        </section>
      )}


      {activeSection === 'eventos' && (
        <div style={{ display: 'grid', gap: '1.75rem' }}>
          <form onSubmit={handleSaveEvent} className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              {editingId ? 'Editar Evento Existente' : 'Crear Nuevo Evento'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Título *</label>
                <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Subtítulo</label>
                <input type="text" value={eventForm.subtitle} onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Categoría</label>
                <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <option value="Concierto">Concierto</option>
                  <option value="Festival">Festival</option>
                  <option value="Experiencia">Experiencia</option>
                  <option value="Gala">Gala</option>
                  <option value="Fiesta">Fiesta</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Estado</label>
                <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <option value="Disponible">Disponible</option>
                  <option value="Últimos boletos">Últimos boletos</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Recinto</label>
                <input type="text" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Fecha visible</label>
                <input type="text" value={eventForm.displayDate} onChange={(e) => setEventForm({ ...eventForm, displayDate: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
              {!editingId && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Precio General ($)</label>
                    <input type="number" min="1" value={eventForm.generalPrice} onChange={(e) => setEventForm({ ...eventForm, generalPrice: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Cupos General</label>
                    <input type="number" min="1" value={eventForm.generalAvailable} onChange={(e) => setEventForm({ ...eventForm, generalAvailable: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary">{editingId ? 'Guardar cambios' : 'Crear evento'}</button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setEventForm(EMPTY_EVENT_FORM); }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Catálogo ({events.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.6rem' }}>Evento</th>
                  <th style={{ padding: '0.6rem' }}>Categoría</th>
                  <th style={{ padding: '0.6rem' }}>Estado</th>
                  <th style={{ padding: '0.6rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{ev.title}</td>
                    <td style={{ padding: '0.6rem' }}>{ev.category}</td>
                    <td style={{ padding: '0.6rem' }}>{ev.status}</td>
                    <td style={{ padding: '0.6rem', display: 'flex', gap: '0.4rem' }}>
                      <button type="button" className="btn btn-outline" onClick={() => handleStartEdit(ev)}>Editar</button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleDeleteEvent(ev.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}


      {activeSection === 'inventario' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {events.map((ev) => (
            <section key={ev.id} className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem' }}>{ev.title}</h2>
                <span className="badge badge-success">{ev.status}</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.5rem' }}>Localidad</th>
                    <th style={{ padding: '0.5rem' }}>Precio ($)</th>
                    <th style={{ padding: '0.5rem' }}>Cupos</th>
                  </tr>
                </thead>
                <tbody>
                  {ev.zones.map((z) => (
                    <tr key={z.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>{z.name}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="number" min="0" step="0.5" value={z.price} onChange={(e) => handleZoneUpdate(ev, z.id, 'price', e.target.value)} style={{ width: '90px', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input type="number" min="0" value={z.available} onChange={(e) => handleZoneUpdate(ev, z.id, 'available', e.target.value)} style={{ width: '90px', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}

     
      {activeSection === 'reportes' && isAdmin && (
        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Reportes Dinámicos de Ventas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="rep-event" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Filtrar por evento</label>
              <select id="rep-event" value={reportEventId} onChange={(e) => setReportEventId(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <option value="ALL">Todos los eventos</option>
                {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.title}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="rep-date" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Desde fecha</label>
              <input id="rep-date" type="date" value={reportDateFrom} onChange={(e) => setReportDateFrom(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {reportSummaryByEvent.map((item) => (
              <div key={item.title}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  <strong>{item.title}</strong>
                  <span>{item.tickets} tickets • <strong>{formatCurrency(item.revenue)}</strong></span>
                </div>
                <div style={{ background: 'var(--bg-subtle)', height: '14px', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((item.revenue / maxRevenue) * 100)}%`, height: '100%', background: 'var(--brand-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}