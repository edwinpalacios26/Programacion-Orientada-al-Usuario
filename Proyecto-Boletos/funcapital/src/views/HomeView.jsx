import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { LoadingSpinner, EmptyState } from '../components/StatusFeedback';

export default function HomeView({ events, onSelectEvent }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['Todas', ...new Set(events.map((e) => e.category))];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || evt.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Todos' || evt.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Eventos en El Salvador
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Descubre conciertos, festivales y experiencias exclusivas con FunCapital.
        </p>
      </header>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
      />

      {isLoading ? (
        <LoadingSpinner message="Cargando cartelera de eventos..." />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No encontramos eventos con esos filtros"
          description="Intenta buscar con otro nombre o restablece los filtros seleccionados."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('Todas');
            setSelectedStatus('Todos');
          }}
        />
      ) : (
        <section
          aria-label="Listado de eventos"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.35rem'
          }}
        >
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelectEvent={onSelectEvent} />
          ))}
        </section>
      )}
    </main>
  );
}
