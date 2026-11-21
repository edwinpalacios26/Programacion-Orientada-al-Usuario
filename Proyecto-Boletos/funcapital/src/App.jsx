import { useState, useEffect } from 'react';
import { INITIAL_EVENTS, INITIAL_ORDERS } from './data/mockData';
import { loadFromStorage, saveToStorage } from './utils/helpers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import EventDetailView from './views/EventDetailView';
import CheckoutView from './views/CheckoutView';
import MyTicketsView from './views/MyTicketsView';
import AuthProfileView from './views/AuthProfileView';
import AdminDashboardView from './views/AdminDashboardView';

export default function App() {
  const [events, setEvents] = useState(() => loadFromStorage('fc_events', INITIAL_EVENTS));
  const [orders, setOrders] = useState(() => loadFromStorage('fc_orders', INITIAL_ORDERS));
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage('fc_user', null));
  const [cartItem, setCartItem] = useState(() => loadFromStorage('fc_cart', null));

  const [currentView, setCurrentView] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => saveToStorage('fc_events', events), [events]);
  useEffect(() => saveToStorage('fc_orders', orders), [orders]);
  useEffect(() => saveToStorage('fc_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('fc_cart', cartItem), [cartItem]);

  const handleSelectEvent = (event) => {
    setSelectedEventId(event.id);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (item) => {
    setCartItem(item);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleCompleteOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id !== newOrder.eventId) return evt;
        const updatedZones = evt.zones.map((z) =>
          z.id === newOrder.zoneId
            ? { ...z, available: Math.max(0, z.available - newOrder.quantity) }
            : z
        );
        const totalRemaining = updatedZones.reduce((s, z) => s + z.available, 0);
        return {
          ...evt,
          zones: updatedZones,
          status: totalRemaining === 0 ? 'Agotado' : evt.status
        };
      })
    );
    setCartItem(null);
  };

  const handleToggleEventStatus = (eventId) => {
    const orderStatuses = ['Disponible', 'Últimos boletos', 'Agotado'];
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const nextIdx = (orderStatuses.indexOf(evt.status) + 1) % orderStatuses.length;
        return { ...evt, status: orderStatuses[nextIdx] };
      })
    );
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo(0, 0);
        }}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentView('home');
        }}
        cartCount={cartItem ? cartItem.quantity : 0}
      />

      <div style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomeView events={events} onSelectEvent={handleSelectEvent} />
        )}

        {currentView === 'detail' && selectedEvent && (
          <EventDetailView
            event={selectedEvent}
            onBack={() => setCurrentView('home')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cartItem={cartItem}
            currentUser={currentUser}
            onClearCart={() => setCartItem(null)}
            onCompleteOrder={handleCompleteOrder}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'tickets' && (
          <MyTicketsView orders={orders} onNavigate={setCurrentView} />
        )}

        {(currentView === 'login' || currentView === 'profile') && (
          <AuthProfileView
            currentUser={currentUser}
            onLogin={(user) => {
              setCurrentUser(user);
              setCurrentView('home');
            }}
            onUpdateUser={setCurrentUser}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            events={events}
            orders={orders}
            onToggleEventStatus={handleToggleEventStatus}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
