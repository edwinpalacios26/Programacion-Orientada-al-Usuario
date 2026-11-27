import { createHashRouter } from 'react-router';
import RootLayout from './components/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomeView from './views/HomeView';
import EventDetailView from './views/EventDetailView';
import CheckoutView from './views/CheckoutView';
import MyTicketsView from './views/MyTicketsView';
import AuthProfileView from './views/AuthProfileView';
import AdminDashboardView from './views/AdminDashboardView';
import NotFoundView from './views/NotFoundView';

export const router = createHashRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomeView isLanding /> },
        { path: 'eventos', element: <HomeView /> },
        { path: 'eventos/:id', element: <EventDetailView /> },
        { path: 'carrito', element: <CheckoutView initialStep={2} /> },
        { path: 'checkout', element: <CheckoutView initialStep={3} /> },
        { path: 'login', element: <AuthProfileView mode="login" /> },
        {
          path: 'boletos',
          element: (
            <ProtectedRoute>
              <MyTicketsView />
            </ProtectedRoute>
          )
        },
        {
          path: 'perfil',
          element: (
            <ProtectedRoute>
              <AuthProfileView mode="profile" />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin',
          element: (
            <ProtectedRoute allowedRoles={['administrador', 'organizador']}>
              <AdminDashboardView activeSection="dashboard" />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/eventos',
          element: (
            <ProtectedRoute allowedRoles={['administrador', 'organizador']}>
              <AdminDashboardView activeSection="eventos" />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/inventario',
          element: (
            <ProtectedRoute allowedRoles={['administrador', 'organizador']}>
              <AdminDashboardView activeSection="inventario" />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/reportes',
          element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminDashboardView activeSection="reportes" />
            </ProtectedRoute>
          )
        },
        { path: '*', element: <NotFoundView /> }
      ]
    }
  ]
);
