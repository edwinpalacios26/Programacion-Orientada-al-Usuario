export function LoadingSpinner({ message = 'Cargando información...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--brand-primary)',
          borderRadius: '50%',
          margin: '0 auto 0.85rem',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <p style={{ fontWeight: 600 }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorBanner({ title = 'Ocurrió un problema', message, onRetry }) {
  return (
    <div
      role="alert"
      className="card"
      style={{
        padding: '1.5rem',
        borderColor: 'var(--danger)',
        background: 'var(--danger-bg)',
        textAlign: 'center',
        margin: '1.5rem 0'
      }}
    >
      <h3 style={{ color: 'var(--danger)', marginBottom: '0.35rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Reintentar operación
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = '🎟️', title, description, actionLabel, onAction }) {
  return (
    <div
      className="card"
      style={{ textAlign: 'center', padding: '3rem 1.25rem', margin: '1rem 0' }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.35rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.1rem' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
