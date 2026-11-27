const STEPS = [
  { num: 1, label: 'Boletos' }, //arreglo de objetos 
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
        {STEPS.map((step) => { //lista del arreblo 
          const isCompleted = currentStep > step.num;  //comporacion de si el paso actual es mayor al paso del arreglo 
          const isCurrent = currentStep === step.num;  //color y paso igual 
          return (
            <li
              key={step.num}  // identiicador unico 
              aria-current={isCurrent ? 'step' : undefined} // short form de if para verificar si es el mismo 
              style={{
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: isCompleted // si es completado se pone el color de fondo de exito
                  ? 'var(--success-bg)' 
                  : isCurrent 
                  ? 'var(--brand-primary)'
                  : 'var(--bg-surface)',
                color: isCompleted  // si es el paso actual se pone el color de fondo de primario
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
