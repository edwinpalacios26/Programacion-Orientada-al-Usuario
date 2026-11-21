export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '4rem',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-surface)',
        padding: '1.75rem 0',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <p>
          <strong style={{ color: 'var(--text-main)' }}>FUN CAPITAL El Salvador</strong> — Plataforma integral de boletos y experiencias.
        </p>
        <p>Disfruta Responsablemente • Proyecto UCA 2026</p>
      </div>
    </footer>
  );
}
