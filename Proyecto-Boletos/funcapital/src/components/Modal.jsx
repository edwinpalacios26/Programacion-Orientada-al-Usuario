import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {  // ventana emergente 
  useEffect(() => {  // tecla escape para cerrar la ventana emergente
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 17, 32, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 100
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 id="modal-title" style={{ fontSize: '1.15rem' }}>{title}</h2>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            aria-label="Cerrar ventana"
            style={{ padding: '0.35rem 0.7rem' }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
