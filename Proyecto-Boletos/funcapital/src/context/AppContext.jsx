import { createContext, useContext, useReducer, useEffect } from 'react';
import { fakeApi } from '../api/fakeApi';
import { loadFromStorage, saveToStorage } from '../utils/helpers';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  CART: 'fc_cart_v3',
  USER: 'fc_user_v3',
  PREFS: 'fc_prefs_v3'
};

const initialState = {
  events: [],
  orders: [],
  cartItem: loadFromStorage(STORAGE_KEYS.CART, null),
  currentUser: loadFromStorage(STORAGE_KEYS.USER, null),
  preferences: loadFromStorage(STORAGE_KEYS.PREFS, { currency: 'USD', country: 'El Salvador' }),
  loading: true,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        events: action.payload.events,
        orders: action.payload.orders
      };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_CART':
      return { ...state, cartItem: action.payload };

    case 'UPDATE_CART_QTY':
      if (!state.cartItem) return state;
      return {
        ...state,
        cartItem: { ...state.cartItem, quantity: action.payload }
      };

    case 'CLEAR_CART':
      return { ...state, cartItem: null };

    case 'LOGIN':
      return { ...state, currentUser: action.payload };

    case 'LOGOUT':
      return { ...state, currentUser: null };

    case 'SWITCH_ROLE':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: { ...state.currentUser, role: action.payload }
      };

    case 'COMPLETE_ORDER':
      return {
        ...state,
        cartItem: null,
        orders: [action.payload.order, ...state.orders],
        events: action.payload.updatedEvents
      };

    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((ev) => (ev.id === action.payload.id ? action.payload : ev))
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((ev) => ev.id !== action.payload)
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);


  const reloadData = async (signal) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [events, orders] = await Promise.all([
        fakeApi.getEvents({ signal }),
        fakeApi.getOrders({ signal })
      ]);
      dispatch({ type: 'FETCH_SUCCESS', payload: { events, orders } });
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    reloadData(controller.signal);
    return () => controller.abort();
  }, []);


  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, state.cartItem);
  }, [state.cartItem]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, state.currentUser);
  }, [state.currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PREFS, state.preferences);
  }, [state.preferences]);

  return (
    <AppContext.Provider value={{ state, dispatch, reloadData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
