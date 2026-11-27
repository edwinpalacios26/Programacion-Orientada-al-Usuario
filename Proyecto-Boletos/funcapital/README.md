 main2
# FunCapital SV — Plataforma Web Progresiva (PWA) de Boletería
=======
# Entrega numero 3 Final 




# FunCapital El Salvador — Sitio de compra de boletos
 main

**Entrega número 3 (Final)**

Aplicación web frontend desarrollada con **React 19**, **Vite 8** y **React Router v7** para la exploración de eventos, selección de localidades, compra simulada en 4 pasos, emisión de boletos digitales con código QR y administración de eventos, inventario y reportes en El Salvador.

---

## Enlace en producción (GitHub Pages)

**URL pública:** https://github.io <!-- TODO: reemplazar por la URL completa: https://<usuario>.github.io/<repositorio>/ -->

---

## Credenciales de demostración por rol

La aplicación cuenta con control de acceso basado en roles. Puedes iniciar sesión con cualquiera de los siguientes perfiles de prueba (también se puede cambiar de rol desde "Iniciar sesión" o "Mi Perfil"):

| Rol | Correo electrónico | Permisos y vistas habilitadas |
|---|---|---|
| Cliente | `estudiante@uca.edu.sv` | Explorar eventos, carrito, checkout, perfil e historial de boletos QR (`/boletos`, `/perfil`). |
| Organizador | `eventos@laconstancia.sv` | Panel administrativo para gestión CRUD de eventos e inventario (`/admin`, `/admin/eventos`, `/admin/inventario`). |
| Administrador | `admin@funcapital.sv` | Acceso total: gestión de eventos, inventario, usuarios y reportes dinámicos de ventas (`/admin/reportes`). |

---

## Mapa de rutas

### Rutas públicas

| Ruta | Descripción |
|---|---|
| `/` | Página principal con eventos destacados y filtros por categoría, estado y búsqueda. |
| `/eventos` | Cartelera completa de eventos disponibles. |
| `/eventos/:id` | Detalle del evento, selección de localidades y disponibilidad. |
| `/carrito` | Resumen de boletos seleccionados antes del pago. |
| `/checkout` | Formulario validado de datos del comprador y simulación de pago. |
| `/login` | Inicio de sesión con credenciales o acceso rápido por rol. |
| `*` | Página de error `404` para rutas no encontradas. |

### Rutas protegidas (requieren autenticación)

| Ruta | Descripción |
|---|---|
| `/boletos` | Historial de compras confirmadas con pase digital y código QR. |
| `/perfil` | Información del usuario autenticado y selector de rol de demostración. |

### Rutas administrativas (protegidas por rol)

| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard principal con métricas globales de ingresos, boletos vendidos y usuarios. |
| `/admin/eventos` | Operaciones CRUD completas (crear, editar y eliminar eventos). |
| `/admin/inventario` | Actualización en tiempo real de precios y cupos por localidad. |
| `/admin/reportes` | Reportes dinámicos filtrables por evento y fecha (exclusivo del rol Administrador). |

---

## Arquitectura técnica y funcionalidades

- **Enrutamiento (React Router v7):** configurado con `createHashRouter` para garantizar navegación fluida y recarga sin errores 404 en GitHub Pages, incluyendo rutas anidadas con `RootLayout` y protección mediante `ProtectedRoute`.
- **Estado global (`Context API` + `useReducer`):** gestión centralizada en `src/context/AppContext.jsx` para sesión de usuario, carrito de compras, catálogo de eventos y órdenes emitidas, sincronizada con `localStorage`.
- **Capa de servicios (`src/api/fakeApi.js`):** simulación de API REST asíncrona con latencia controlada, soporte para cancelación de peticiones mediante `AbortController`, manejo de errores y persistencia local.
- **Experiencia de usuario (UX):** retroalimentación visual constante con estados de carga (spinners), banners de error con opción de reintento, estados vacíos (*empty states*), formularios validados y diseño responsivo.
- **Progressive Web App (PWA):**
  - Manifiesto web (`public/manifest.json`) con íconos instalables (`192x192` y `512x512`) y modo `standalone`.
  - Banner interactivo de instalación (`beforeinstallprompt`) y alerta automática al perder conexión a internet.
  - Service Worker (`public/sw.js`) con estrategia de caché para funcionamiento offline básico.

---

## Estructura de carpetas

```text
funcapital/
├── public/                 # Recursos estáticos públicos
│   ├── manifest.json       # Manifiesto PWA (íconos 192x192 y 512x512)
│   └── sw.js               # Service Worker (caché offline básico)
├── src/
│   ├── api/
│   │   └── fakeApi.js      # API REST simulada (latencia, AbortController, errores)
│   ├── context/
│   │   └── AppContext.jsx  # Estado global (Context API + useReducer)
│   ├── components/         # Componentes reutilizables de interfaz
│   │   ├── CheckoutStepper.jsx
│   │   ├── EventCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderSummaryCard.jsx
│   │   ├── PaymentFormFields.jsx
│   │   ├── QuantityStepper.jsx
│   │   ├── SearchFilterBar.jsx
│   │   ├── StatusFeedback.jsx   # LoadingSpinner, ErrorBanner, EmptyState
│   │   └── TicketQRPass.jsx
│   ├── views/              # Pantallas principales del flujo
│   │   ├── AdminDashboardView.jsx
│   │   ├── AuthProfileView.jsx
│   │   ├── CheckoutView.jsx
│   │   ├── EventDetailView.jsx
│   │   ├── HomeView.jsx
│   │   └── MyTicketsView.jsx
│   ├── data/
│   │   └── mockData.js     # 8 eventos (3 zonas c/u), usuarios por rol y órdenes iniciales
│   ├── utils/
│   │   └── helpers.js      # Formateo de moneda, códigos QR/orden y helpers de localStorage
│   ├── App.jsx             # Punto de composición de la app y rutas
│   ├── index.css           # Design System, variables CSS y reglas responsivas
│   └── main.jsx            # Punto de entrada React 19
├── docs/                   # Capturas de evidencia responsiva
└── README.md
```

---

## Estado y persistencia (`localStorage`)

El estado global se sincroniza automáticamente con `localStorage` mediante `useEffect`:

| Clave | Contenido |
|---|---|
| `fc_events` | Catálogo de 8 eventos e inventario dinámico de cupos por localidad. |
| `fc_cart` | Selección activa de evento, zona y cantidad antes de confirmar el pago. |
| `fc_orders` | Historial de órdenes confirmadas y boletos digitales con código QR. |
| `fc_user` | Sesión activa y rol del usuario (`cliente`, `organizador`, `administrador`). |

---

## Datos simulados y roles de prueba

- **Catálogo:** 8 eventos reales/temáticos de El Salvador (Oktoberfest Pilsener, Def Leppard SV, Tour Cervecero La Constancia, VIVIT FEST, Legado Moda, Ricardo Arjona SV, Héroes de Leyenda y EUPHORIA), cada uno con **3 zonas/localidades** y precios diferenciados.
- **Roles disponibles:**
  - `cliente`: búsqueda de eventos, compra en 4 pasos y visualización de boletos QR.
  - `organizador`: acceso al Panel Admin para gestionar disponibilidad y estados de eventos.
  - `administrador`: control total de inventario, usuarios y visualización de reportes y analítica.

---

## Instalación y ejecución local

1. **Requisitos previos:** Node.js v18+ y npm.
2. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd Programacion-Orientada-al-Usuario
   ```
   <!-- TODO: completar la URL del repositorio: https://github.com/<usuario>/<repositorio>.git -->
3. **Instalar dependencias:**
   ```bash
   npm install
   ```
4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
5. **Generar build de producción y vista previa PWA:**
   ```bash
   npm run build
   npm run preview
   ```

---

## Evidencia responsiva (breakpoints)

### Móvil (`375px`)
![Vista móvil 375px](docs/movil.png)

### Tablet (`768px`)
![Vista tablet 768px](docs/tablet.png)

### Escritorio (`1440px`)
![Vista escritorio 1440px](docs/escritorio.png)