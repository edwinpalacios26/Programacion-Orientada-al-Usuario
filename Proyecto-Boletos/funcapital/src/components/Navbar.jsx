import './Navbar.css';

const ROLE_LABELS = {
  cliente: 'Cliente',
  administrador: 'Administrador',
  organizador: 'Organizador'
};

export default function Navbar({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  cartCount
}) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-left">
          <button
            type="button"
            className="brand-logo"
            onClick={() => onNavigate('home')}
            aria-label="Ir al inicio de FunCapital"
          >
            FUN <span className="brand-tag">CAPITAL</span>
          </button>

          <nav aria-label="Navegación principal" className="navbar-left">
            <button
              type="button"
              className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Eventos
            </button>

            <button
              type="button"
              className={`nav-link ${currentView === 'tickets' ? 'active' : ''}`}
              onClick={() => onNavigate('tickets')}
            >
              Mis tickets
            </button>

            {(currentUser?.role === 'administrador' || currentUser?.role === 'organizador') && (
              <button
                type="button"
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => onNavigate('admin')}
              >
                Panel Admin
              </button>
            )}
          </nav>

          <span className="country-pill" aria-label="País seleccionado: El Salvador">
            🇸🇻 El Salvador
          </span>
        </div>

        <div className="navbar-right">
          {cartCount > 0 && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate('checkout')}
              aria-label={`Ver carrito con ${cartCount} boletos`}
            >
              Carrito <span className="cart-badge">{cartCount}</span>
            </button>
          )}

          {currentUser ? (
            <>
              <button
                type="button"
                className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
                onClick={() => onNavigate('profile')}
              >
                👤 {ROLE_LABELS[currentUser.role]}
              </button>
              <button type="button" className="btn btn-outline" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('login')}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
