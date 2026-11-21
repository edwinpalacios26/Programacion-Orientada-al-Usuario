import { formatCurrency } from '../utils/helpers';
import './EventCard.css';

export default function EventCard({ event, onSelectEvent }) {
  const minPrice = Math.min(...event.zones.map((z) => z.price));
  const isSoldOut = event.status === 'Agotado';

  const badgeClass =
    event.status === 'Disponible'
      ? 'badge-success'
      : event.status === 'Últimos boletos'
      ? 'badge-warning'
      : 'badge-danger';

  return (
    <article className="card event-card">
      <div className="event-card-media">
        <img src={event.image} alt={`Imagen promocional de ${event.title}`} loading="lazy" />
        <span className={`badge event-card-badge ${badgeClass}`}>{event.status}</span>
        <span className="event-card-category">{event.category}</span>
      </div>

      <div className="event-card-body">
        <span className="event-card-org">FunCapital El Salvador</span>
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-meta">
          <span> {event.venue}</span>
          <span> {event.displayDate}</span>
        </div>

        <div className="event-card-footer">
          <div className="event-card-price">
            Desde <strong>{formatCurrency(minPrice)}</strong>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSelectEvent(event)}
          >
            {isSoldOut ? 'Ver detalles' : 'Comprar'}
          </button>
        </div>
      </div>
    </article>
  );
}
