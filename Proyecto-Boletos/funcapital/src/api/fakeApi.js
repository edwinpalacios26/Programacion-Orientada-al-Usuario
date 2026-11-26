import { INITIAL_EVENTS, INITIAL_ORDERS, MOCK_USERS } from '../data/mockData';
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

import { loadFromStorage, saveToStorage } from '../utils/helpers';

const KEYS = {
  EVENTS: 'fc_events_v3',
  ORDERS: 'fc_orders_v3',
  USERS: 'fc_users_v3'
};


function simulateNetwork(signal, delay = 350) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Petición cancelada por el usuario', 'AbortError'));
    }

    const timer = setTimeout(() => {
      resolve();
    }, delay);

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new DOMException('Petición cancelada por el usuario', 'AbortError'));
        },
        { once: true }
      );
    }
  });
}

function getStoredEvents() {
  const saved = loadFromStorage(KEYS.EVENTS, null);
  if (saved && Array.isArray(saved) && saved.length > 0) return saved;
  saveToStorage(KEYS.EVENTS, INITIAL_EVENTS);
  return INITIAL_EVENTS;
}

function getStoredOrders() {
  const saved = loadFromStorage(KEYS.ORDERS, null);
  if (saved && Array.isArray(saved)) return saved;
  saveToStorage(KEYS.ORDERS, INITIAL_ORDERS);
  return INITIAL_ORDERS;
}

export const fakeApi = {

  async getEvents({ signal, simulateError = false } = {}) {
    await simulateNetwork(signal, 350);
    if (simulateError) throw new Error('No se pudo conectar con el servidor de eventos.');
    return getStoredEvents();
  },

  async getEventById(id, { signal } = {}) {
    await simulateNetwork(signal, 250);
    const events = getStoredEvents();
    const found = events.find((ev) => ev.id === id);
    if (!found) throw new Error('El evento solicitado no existe o fue retirado.');
    return found;
  },


  async createEvent(newEvent) {
    await simulateNetwork(null, 300);
    const events = getStoredEvents();
    const created = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      serviceFeeRate: newEvent.serviceFeeRate ?? 0.1
    };
    const updated = [created, ...events];
    saveToStorage(KEYS.EVENTS, updated);
    return created;
  },

  async saveEvent(eventData) {
    const fallbackImage = 'https://unsplash.com';
    const cleanImage = eventData.image && eventData.image.trim() !== '' ? eventData.image.trim() : fallbackImage;

    if (eventData.id) {
      return this.updateEvent(eventData.id, { ...eventData, image: cleanImage });
    }
    return this.createEvent({
      ...eventData,
      image: cleanImage,
      city: eventData.city || 'San Salvador',
      date: eventData.date || '2026-12-15',
      serviceFeeRate: eventData.serviceFeeRate ?? 0.1
    });
  },


  async updateEvent(eventId, updates) {
    await simulateNetwork(null, 250);
    const events = getStoredEvents();
    const updated = events.map((ev) => (ev.id === eventId ? { ...ev, ...updates } : ev));
    saveToStorage(KEYS.EVENTS, updated);
    return updated.find((ev) => ev.id === eventId);
  },

  async deleteEvent(eventId) {
    await simulateNetwork(null, 250);
    const events = getStoredEvents();
    const updated = events.filter((ev) => ev.id !== eventId);
    saveToStorage(KEYS.EVENTS, updated);
    return eventId;
  },


  async getOrders({ signal } = {}) {
    await simulateNetwork(signal, 250);
    return getStoredOrders();
  },

  async createOrder(newOrder, { simulateError = false } = {}) {
    await simulateNetwork(null, 650);
    if (simulateError) {
      throw new Error('La transacción fue rechazada por el banco emisor. Verifica tus datos.');
    }


    const events = getStoredEvents();
    const updatedEvents = events.map((ev) => {
      if (ev.id !== newOrder.eventId) return ev;
      const updatedZones = ev.zones.map((z) =>
        z.id === newOrder.zoneId
          ? { ...z, available: Math.max(0, z.available - newOrder.quantity) }
          : z
      );
      const totalLeft = updatedZones.reduce((acc, z) => acc + z.available, 0);
      return {
        ...ev,
        zones: updatedZones,
        status: totalLeft === 0 ? 'Agotado' : totalLeft <= 20 ? 'Últimos boletos' : ev.status
      };
    });
    saveToStorage(KEYS.EVENTS, updatedEvents);

  
    const orders = getStoredOrders();
    const updatedOrders = [newOrder, ...orders];
    saveToStorage(KEYS.ORDERS, updatedOrders);
    return { order: newOrder, updatedEvents };
  },

 
  async loginWithRole(identifier) {
    await delay(250);
    const key = String(identifier || '').trim().toLowerCase();
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === key || u.role.toLowerCase() === key
    );
    if (!user) {
      throw new Error('Usuario no encontrado. Usa uno de los roles o correos de demostración.');
    }
    return { ...user };
  },


  async getUsers({ signal } = {}) {
    await simulateNetwork(signal, 200);
    const saved = loadFromStorage(KEYS.USERS, null);
    if (saved) return saved;
    saveToStorage(KEYS.USERS,MOCK_USERS);
    return MOCK_USERS;
  }
};
