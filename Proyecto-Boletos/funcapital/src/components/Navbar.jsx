import { Link, NavLink, useNavigate } from 'react-router';
import './Navbar.css';

export default function Navbar({ currentUser, onLogout, cartCount }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="brand-logo" aria-label="Ir al inicio de FunCapital">
            FUN <span className="brand-tag">CAPITAL</span>
          </Link>

          <nav aria-label="Navegación principal" className="navbar-left">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Inicio
            </NavLink>

            <NavLink to="/eventos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Eventos
            </NavLink>

            <NavLink to="/boletos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Mis tickets
            </NavLink>

            {(currentUser?.role === 'administrador' || currentUser?.role === 'organizador') && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Panel Admin
              </NavLink>
            )}
          </nav>

          <span className="country-pill" aria-label="País seleccionado: El Salvador">
            🇸🇻 El Salvador
          </span>
        </div>

        <div className="navbar-right">
          {cartCount > 0 && (
            <Link
              to="/carrito"
              className="btn btn-outline"
              aria-label={`Ver carrito con ${cartCount} boletos`}
            >
              Carrito <span className="cart-badge">{cartCount}</span>
            </Link>
          )}

          {currentUser ? (
            <>
              <NavLink
                to="/perfil"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ textTransform: 'capitalize' }}
              >
                {currentUser.role}
              </NavLink>
              <button type="button" className="btn btn-outline" onClick={handleLogoutClick}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
