import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWABanners() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW();

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div
          role="status"
          style={{
            background: '#92400e',
            color: '#fff',
            textAlign: 'center',
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          Sin conexión a internet — Navegando en modo offline con datos guardados en caché.
        </div>
      )}

      {needRefresh && (
        <div
          role="alert"
          style={{
            background: '#1e3a8a',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            fontSize: '0.82rem',
            flexWrap: 'wrap'
          }}
        >
          <span>Hay una nueva versión disponible de FunCapital.</span>
          <button
            type="button"
            className="btn"
            style={{ background: '#fff', color: '#1e3a8a', padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}
            onClick={() => updateServiceWorker(true)}
          >
            Actualizar ahora
          </button>
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            onClick={() => setNeedRefresh(false)}
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
