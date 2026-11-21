const STEPS = [
  { num: 1, label: 'Boletos' },
  { num: 2, label: 'Resumen' },
  { num: 3, label: 'Pago' },
  { num: 4, label: 'Confirmación' }
];

export default function CheckoutStepper({ currentStep }) {
  return (
    <nav aria-label="Progreso de compra" style={{ marginBottom: '1.75rem' }}>
      <ol
        style={{
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem'
        }}
      >
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <li
              key={step.num}
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: isCompleted
                  ? 'var(--success-bg)'
                  : isCurrent
                  ? 'var(--brand-primary)'
                  : 'var(--bg-surface)',
                color: isCompleted
                  ? 'var(--success)'
                  : isCurrent
                  ? '#ffffff'
                  : 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}
            >
              {isCompleted ? '✓ ' : `${step.num}. `}
              {step.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
