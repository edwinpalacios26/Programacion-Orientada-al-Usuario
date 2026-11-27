export default function PaymentFormFields({ form, errors, onChange }) { // dibuja los 8 campos del formulario de pago de paso 3
  const inputStyle = { // guarda los estilos de los inputs para no repetirlos
    width: '100%', 
    padding: '0.65rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Información del Comprador</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Completa tus datos personales para la emisión de tus pases digitales.
        </p>

        <div style={{ display: 'grid', gap: '0.95rem' }}>
          <div>
            <label htmlFor="fullName" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Nombre completo *
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="Nombre completo"
              style={inputStyle}
            />
            {errors.fullName && <small style={{ color: 'var(--danger)' }}>{errors.fullName}</small>}
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
            />
            {errors.email && <small style={{ color: 'var(--danger)' }}>{errors.email}</small>}
          </div>

          <div>
            <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Número de teléfono *
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+503 7000-0000"
              style={inputStyle}
            />
            {errors.phone && <small style={{ color: 'var(--danger)' }}>{errors.phone}</small>}
          </div>

          <div>
            <label htmlFor="dui" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Número de DUI *
            </label>
            <input
              id="dui"
              type="text"
              value={form.dui}
              onChange={(e) => onChange('dui', e.target.value)}
              placeholder="00000000-0"
              style={inputStyle}
            />
            {errors.dui && <small style={{ color: 'var(--danger)' }}>{errors.dui}</small>} 
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Método de Pago</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Aceptamos tarjetas de crédito o débito Visa, Mastercard y Amex.
        </p>

        <div style={{ display: 'grid', gap: '0.95rem' }}>
          <div>
            <label htmlFor="cardName" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Nombre impreso en la tarjeta *
            </label>
            <input
              id="cardName"
              type="text"
              value={form.cardName}
              onChange={(e) => onChange('cardName', e.target.value)}
              placeholder="TarjetaHabiente"
              style={inputStyle}
            />
            {errors.cardName && <small style={{ color: 'var(--danger)' }}>{errors.cardName}</small>} 
          </div>

          <div>
            <label htmlFor="cardNumber" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
              Número de tarjeta *
            </label>
            <input
              id="cardNumber"
              type="text"
              maxLength={19}
              value={form.cardNumber}
              onChange={(e) => onChange('cardNumber', e.target.value)}
              placeholder="4000 1234 5678 9010"
              style={inputStyle}
            />
            {errors.cardNumber && <small style={{ color: 'var(--danger)' }}>{errors.cardNumber}</small>} 
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label htmlFor="expiry" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
                Expiración *
              </label>
              <input
                id="expiry"
                type="text"
                maxLength={5}
                value={form.expiry}
                onChange={(e) => onChange('expiry', e.target.value)}
                placeholder="MM/AA"
                style={inputStyle}
              />
              {errors.expiry && <small style={{ color: 'var(--danger)' }}>{errors.expiry}</small>} 
            </div>

            <div>
              <label htmlFor="cvv" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>
                CVV *
              </label>
              <input
                id="cvv"
                type="password"
                maxLength={4}
                value={form.cvv}
                onChange={(e) => onChange('cvv', e.target.value)}
                placeholder="***"
                style={inputStyle}
              />
              {errors.cvv && <small style={{ color: 'var(--danger)' }}>{errors.cvv}</small>} 
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
