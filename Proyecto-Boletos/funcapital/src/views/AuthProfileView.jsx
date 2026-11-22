import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

export default function AuthProfileView({ currentUser, onLogin, onUpdateUser }) {
  const [mode, setMode] = useState('login'); 
  const [phone, setPhone] = useState('+503 7000-0000');
  const [channel, setChannel] = useState('whatsapp');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (mode === 'recover') {
      setFeedback(`Código de recuperación enviado por ${channel.toUpperCase()} al ${phone}.`);
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || !phone.trim()) return;
      onLogin({
        id: `usr-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || 'usuario@funcapital.sv',
        dui: '00000000-0',
        role: 'cliente'
      });
      return;
    }

    const found = MOCK_USERS.find((u) => u.phone === phone.trim()) || {
      id: `usr-${Date.now()}`,
      name: 'Cliente Autorizado UCA',
      phone: phone.trim(),
      email: 'cliente@funcapital.sv',
      dui: '05489210-4',
      role: 'cliente'
    };
    onLogin(found);
  };

  if (currentUser) {
    return (
      <main className="container" style={{ paddingTop: '2rem', maxWidth: '640px' }}>
        <section className="card" style={{ padding: '1.75rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            Rol activo: {currentUser.role}
          </span>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Mi Perfil</h1>

          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            <p><strong>Nombre:</strong> {currentUser.name}</p>
            <p><strong>Teléfono:</strong> {currentUser.phone}</p>
            <p><strong>Correo:</strong> {currentUser.email}</p>
            <p><strong>DUI:</strong> {currentUser.dui}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <label htmlFor="role-switcher" style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>
              Cambiar rol visual de demostración:
            </label>
            <select
              id="role-switcher"
              value={currentUser.role}
              onChange={(e) => onUpdateUser({ ...currentUser, role: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: '#fff'
              }}
            >
              <option value="cliente">Cliente (Compra y boletos QR)</option>
              <option value="organizador">Organizador (Acceso a Panel Admin)</option>
              <option value="administrador">Administrador (Control total + Reportes)</option>
            </select>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: '2.5rem', maxWidth: '460px' }}>
      <section className="card" style={{ padding: '2rem' }}>
        <p style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          FUN CAPITAL
        </p>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Recuperar acceso'}
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Enviaremos un código a tu teléfono para ingresar.
        </p>

        {feedback && (
          <div className="badge-success" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {feedback}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '1rem' }}>
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
                  Nombre completo *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label htmlFor="reg-email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
                  Correo electrónico *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@correo.com"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="login-phone" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Teléfono *
            </label>
            <input
              id="login-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+503 7000-0000"
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Ingresar usando
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${channel === 'whatsapp' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setChannel('whatsapp')}
              >
                WhatsApp
              </button>
              <button
                type="button"
                className={`btn ${channel === 'sms' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setChannel('sms')}
              >
                Mensaje de texto
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Continuar →
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta'}
          </button>
          <button
            type="button"
            onClick={() => setMode('recover')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Recuperar código
          </button>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Acceso rápido de prueba por rol:
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                onClick={() => onLogin(u)}
              >
                Entrar como {u.role}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
