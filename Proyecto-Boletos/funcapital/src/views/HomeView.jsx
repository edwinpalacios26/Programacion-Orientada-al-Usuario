import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { LoadingSpinner, ErrorBanner, EmptyState } from '../components/StatusFeedback';

export default function HomeView({ isLanding = false }) {
  const { state, reloadData } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  const categories = useMemo(() => {
    const unique = new Set(state.events.map((ev) => ev.category));
    return ['Todas', ...Array.from(unique)];
  }, [state.events]);

  const filteredEvents = useMemo(() => {
    return state.events.filter((ev) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesText =
        !term ||
        ev.title.toLowerCase().includes(term) ||
        ev.venue.toLowerCase().includes(term) ||
        ev.city.toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'Todas' || ev.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Todos' || ev.status === selectedStatus;
      return matchesText && matchesCategory && matchesStatus;
    });
  }, [state.events, searchTerm, selectedCategory, selectedStatus]);

  const handleSelectEvent = (event) => {
    navigate(`/eventos/${event.id}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSelectedStatus('Todos');
  };

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <section style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            {isLanding ? 'Eventos destacados en El Salvador' : 'Cartelera completa de eventos'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Explora conciertos, festivales y experiencias en vivo y asegura tus localidades.
          </p>
        </div>
        {isLanding && (
          <Link to="/eventos" className="btn btn-outline">
            Ver todos los eventos →
          </Link>
        )}
      </section>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
      />

      {state.loading ? (
        <LoadingSpinner text="Cargando eventos desde la API..." />
      ) : state.error ? (
        <ErrorBanner title="Error al cargar eventos" message={state.error} onRetry={() => reloadData()} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon="🎟️"
          title="No encontramos eventos con esos filtros"
          description="Prueba buscando con otra palabra clave o restablece los filtros activos."
          actionLabel="Limpiar filtros"
          onAction={resetFilters}
        />
      ) : (
        <section
          aria-label="Listado de eventos"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} onSelectEvent={handleSelectEvent} />
          ))}
        </section>
      )}
    </main>
  );
}
