import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { fakeApi } from '../api/fakeApi';
import { MOCK_USERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ErrorBanner } from '../components/StatusFeedback';

export default function AuthProfileView({ mode = 'login' }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = state;

  const [emailInput, setEmailInput] = useState('estudiante@uca.edu.sv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const destination = location.state?.from || '/eventos';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await fakeApi.loginWithRole(emailInput.trim());
      dispatch({ type: 'LOGIN', payload: user });
      navigate(user.role === 'cliente' ? destination : '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await fakeApi.loginWithRole(role);
      dispatch({ type: 'LOGIN', payload: user });
      navigate(role === 'cliente' ? destination : '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'profile' && currentUser) {
    return (
      <main className="container" style={{ paddingTop: '2rem', maxWidth: '680px' }}>
        <section className="card" style={{ padding: '1.75rem' }}>
          <h1 style={{ fontSize: '1.55rem', marginBottom: '0.25rem' }}>Mi Perfil</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Sesión simulada persistida en almacenamiento local.
          </p>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <p><strong>Nombre:</strong> {currentUser.name}</p>
            <p><strong>Correo:</strong> {currentUser.email}</p>
            <p><strong>Teléfono:</strong> {currentUser.phone}</p>
            <p><strong>DUI:</strong> {currentUser.dui}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <label htmlFor="role-switcher" style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem' }}>
              Cambiar rol de demostración (control de acceso):
            </label>
            <select
              id="role-switcher"
              value={currentUser.role}
              onChange={(e) => dispatch({ type: 'SWITCH_ROLE', payload: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
            >
              <option value="cliente">Cliente (compra y boletos)</option>
              <option value="organizador">Organizador (panel eventos e inventario)</option>
              <option value="administrador">Administrador (acceso total + reportes)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/boletos')}>
              Ver mis tickets ({state.orders.length})
            </button>
            {(currentUser.role === 'administrador' || currentUser.role === 'organizador') && (
              <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
                Ir al Panel Admin
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: '2.5rem', maxWidth: '520px' }}>
      <section className="card" style={{ padding: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Iniciar sesión</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Ingresa con una cuenta de demostración o selecciona un rol rápido.
        </p>

        {error && <ErrorBanner title="Acceso denegado" message={error} />}

        <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Correo institucional o de prueba
            </label>
            <input
              id="login-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Validando...' : 'Entrar con correo'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Acceso directo por rol (Credenciales Demo):
          </p>
          <div style={{ display: 'grid', gap: '0.55rem' }}>
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                className="btn btn-outline"
                disabled={loading}
                onClick={() => handleQuickRoleLogin(u.role)}
                style={{ justifyContent: 'space-between', textAlign: 'left' }}
              >
                <span>
                  <strong style={{ textTransform: 'capitalize' }}>{u.role}</strong> — {u.email}
                </span>
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
