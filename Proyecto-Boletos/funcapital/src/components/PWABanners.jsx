import { useState, useEffect } from 'react';

export function PWABanners() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <>
      {isOffline && (
        <div
          style={{
            background: '#fef3c7',
            color: '#92400e',
            padding: '0.6rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 600,
            borderBottom: '1px solid #fcd34d'
          }}
        >
          Estás navegando sin conexión. Los cambios locales se guardan en tu dispositivo.
        </div>
      )}

      {installPrompt && (
        <div
          style={{
            background: 'var(--brand-primary, #2563eb)',
            color: '#ffffff',
            padding: '0.65rem 1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}
        >
          <span>Instala la app para acceder más rápido a tus entradas.</span>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: '#ffffff',
              color: 'var(--brand-primary, #2563eb)',
              border: 'none',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Instalar App
          </button>
        </div>
      )}
    </>
  );
}

export default PWABanners;
