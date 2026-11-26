import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import PWABanners from './PWABanners';
import { useApp } from '../context/AppContext';

export default function RootLayout() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PWABanners />
      <Navbar
        currentUser={state.currentUser}
        onLogout={handleLogout}
        cartCount={state.cartItem ? state.cartItem.quantity : 0}
      />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
