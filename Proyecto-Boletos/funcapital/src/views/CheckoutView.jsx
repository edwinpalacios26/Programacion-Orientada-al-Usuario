import { useState } from 'react';
import CheckoutStepper from '../components/CheckoutStepper';
import OrderSummaryCard from '../components/OrderSummaryCard';
import TicketQRPass from '../components/TicketQRPass';
import PaymentFormFields from '../components/PaymentFormFields';
import { ErrorBanner, EmptyState } from '../components/StatusFeedback';
import { formatCurrency, generateOrderCode, generateSeatCode } from '../utils/helpers';

export default function CheckoutView({
  cartItem,
  currentUser,
  onClearCart,
  onCompleteOrder,
  onNavigate
}) {
  const [step, setStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+503 ',
    dui: currentUser?.dui || '',
    cardName: currentUser?.name || '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!cartItem && !completedOrder) {
    return (
      <main className="container" style={{ paddingTop: '2rem' }}>
        <EmptyState
          icon="🛒"
          title="Tu carrito está vacío"
          description="Selecciona un evento y tus localidades para iniciar la compra."
          actionLabel="Explorar eventos"
          onAction={() => onNavigate('home')}
        />
      </main>
    );
  }

  const subtotal = cartItem ? cartItem.unitPrice * cartItem.quantity : 0;
  const serviceFee = cartItem ? Number((subtotal * cartItem.serviceFeeRate).toFixed(2)) : 0;
  const total = subtotal + serviceFee;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Ingresa tu nombre completo.';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Ingresa un correo electrónico válido.';
    if (form.phone.replace(/\D/g, '').length < 8) newErrors.phone = 'Ingresa un teléfono válido (+503).';
    if (!/^\d{8}-\d$/.test(form.dui.trim())) newErrors.dui = 'Formato de DUI inválido (ej. 00000000-0).';
    if (!form.cardName.trim()) newErrors.cardName = 'Ingresa el nombre impreso en la tarjeta.';
    if (form.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = 'Ingresa los 16 dígitos de la tarjeta.';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry.trim())) newErrors.expiry = 'Usa formato MM/AA.';
    if (!/^\d{3,4}$/.test(form.cvv.trim())) newErrors.cvv = 'CVV inválido (3 o 4 dígitos).';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;

    setPaymentError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (simulateError) {
        setPaymentError('La transacción fue rechazada por el banco emisor. Verifica tus datos o intenta nuevamente.');
        return;
      }

      const newOrder = {
        id: generateOrderCode(),
        eventId: cartItem.eventId,
        eventTitle: cartItem.eventTitle,
        venue: cartItem.venue,
        displayDate: cartItem.displayDate,
        image: cartItem.image,
        zoneId: cartItem.zoneId,
        zoneName: cartItem.zoneName,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        serviceFee,
        total,
        seat: generateSeatCode(),
        holderName: form.fullName.trim(),
        status: 'CONFIRMADO',
        createdAt: new Date().toISOString().slice(0, 10)
      };

      onCompleteOrder(newOrder);
      setCompletedOrder(newOrder);
      setStep(4);
    }, 900);
  };

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <CheckoutStepper currentStep={step} />

      {step === 2 && cartItem && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <section className="card" style={{ padding: '1.5rem' }}>
            <h1 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Resumen de tu selección</h1>
            <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{cartItem.eventTitle}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Localidad: <strong>{cartItem.zoneName}</strong> • Cantidad: <strong>{cartItem.quantity}</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Continuar al pago
              </button>
              <button type="button" className="btn btn-outline" onClick={onClearCart}>
                Vaciar carrito
              </button>
            </div>
          </section>
          <OrderSummaryCard item={cartItem} />
        </div>
      )}

      {step === 3 && cartItem && (
        <form onSubmit={handlePaySubmit} noValidate>
          {paymentError && (
            <ErrorBanner
              title="Error en el pago"
              message={paymentError}
              onRetry={() => {
                setSimulateError(false);
                setPaymentError('');
              }}
            />
          )}

          <PaymentFormFields form={form} errors={errors} onChange={updateField} />

          <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
              />
              Simular fallo de tarjeta
            </label>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.85rem 2rem' }}>
              {isSubmitting ? 'Procesando pago...' : `Pagar ${formatCurrency(total)}`}
            </button>
          </div>
        </form>
      )}

      {step === 4 && completedOrder && (
        <section style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--success)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ✓ ¡Compra completada con éxito!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Tu orden ha sido procesada de forma segura. Guardamos tus boletos en tu perfil.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <OrderSummaryCard
              item={{
                eventTitle: completedOrder.eventTitle,
                venue: completedOrder.venue,
                displayDate: completedOrder.displayDate,
                zoneName: completedOrder.zoneName,
                quantity: completedOrder.quantity,
                unitPrice: completedOrder.unitPrice,
                serviceFeeRate: completedOrder.serviceFee / (completedOrder.unitPrice * completedOrder.quantity)
              }}
              orderCode={completedOrder.id}
            />

            <div>
              <TicketQRPass order={completedOrder} />
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-primary" onClick={() => onNavigate('tickets')}>
                  Ir a mis eventos
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
