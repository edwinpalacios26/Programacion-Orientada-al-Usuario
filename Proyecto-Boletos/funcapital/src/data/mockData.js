export const INITIAL_EVENTS = [
  {
    id: 'evt-oktoberfest',
    title: 'Oktoberfest Pilsener 2026',
    subtitle: 'La fiesta cervecera más grande de El Salvador',
    category: 'Festival',
    date: '2026-10-17',
    displayDate: 'OCT 17, 7:00 PM',
    venue: 'Parque Deportivo El Cafetalón, Santa Tecla',
    city: 'Santa Tecla',
    status: 'Disponible',
    serviceFeeRate: 0.20,
    image: 'images/oktoberfest.jpg',
    zones: [
      { id: 'z-okt-1', name: 'Entrada General - Jueves 15 Oct', price: 5.00, available: 120 },
      { id: 'z-okt-2', name: 'Entrada General - Viernes 16 Oct', price: 10.00, available: 85 },
      { id: 'z-okt-3', name: 'Mesa VIP Biergarten - Sábado 17 Oct', price: 25.00, available: 18 }
    ]
  },
  {
    id: 'evt-def-leppard',
    title: 'Def Leppard SV - Live 2026',
    subtitle: 'Special Guest: EXTREME',
    category: 'Concierto',
    date: '2026-10-24',
    displayDate: 'OCT 24, 7:00 PM',
    venue: 'Estadio Cuscatlán, San Salvador',
    city: 'San Salvador',
    status: 'Últimos boletos',
    serviceFeeRate: 0.066,
    image: 'images/def-leppard.jpg',
    zones: [
      { id: 'z-def-1', name: 'General Preferencial', price: 65.00, available: 45 },
      { id: 'z-def-2', name: 'Tribuna Norte / Sur', price: 125.00, available: 22 },
      { id: 'z-def-3', name: 'Silla AMEX Preferencial', price: 225.00, available: 8 }
    ]
  },
  {
    id: 'evt-tour-cervecero',
    title: 'Tour Cervecero - La Constancia',
    subtitle: 'Recorrido histórico y cata guiada (+3 fechas)',
    category: 'Experiencia',
    date: '2026-10-24',
    displayDate: 'OCT 24, 7:00 PM',
    venue: 'La Constancia, San Salvador',
    city: 'San Salvador',
    status: 'Disponible',
    serviceFeeRate: 0.10,
    image: 'images/tour-cervecero.jpg',
    zones: [
      { id: 'z-tour-1', name: 'Pase Recorrido Clásico', price: 12.00, available: 40 },
      { id: 'z-tour-2', name: 'Pase Cata Maestro Cervecero', price: 22.00, available: 15 },
      { id: 'z-tour-3', name: 'Grupo Privado (4 Personas)', price: 75.00, available: 5 }
    ]
  },
  {
    id: 'evt-vivit-fest',
    title: 'VIVIT FEST 2026',
    subtitle: 'Un encuentro juvenil de música y propósito',
    category: 'Festival',
    date: '2026-10-24',
    displayDate: 'OCT 24, 4:00 PM',
    venue: 'Highlands International School, San Salvador',
    city: 'San Salvador',
    status: 'Disponible',
    serviceFeeRate: 0.10,
    image: 'images/vivit.jpg',
    zones: [
      { id: 'z-viv-1', name: 'Entrada Juvenil (15-30 años)', price: 8.00, available: 200 },
      { id: 'z-viv-2', name: 'Acceso General', price: 12.00, available: 150 },
      { id: 'z-viv-3', name: 'Zona Frontal + Kit', price: 20.00, available: 35 }
    ]
  },
  {
    id: 'evt-legado-moda',
    title: 'Legado - Moda Con Propósito',
    subtitle: 'Pasarela benéfica y concierto con Ricky Parrado',
    category: 'Gala',
    date: '2026-10-24',
    displayDate: 'OCT 24, 5:00 PM',
    venue: 'Presidente Plaza Tercer Nivel, San Salvador',
    city: 'San Salvador',
    status: 'Disponible',
    serviceFeeRate: 0.10,
    image: 'images/legado-moda.jpg',
    zones: [
      { id: 'z-leg-1', name: 'Plata General', price: 30.00, available: 60 },
      { id: 'z-leg-2', name: 'Oro Pasarela', price: 50.00, available: 30 },
      { id: 'z-leg-3', name: 'Mesa Gala Benéfica', price: 90.00, available: 10 }
    ]
  },
  {
    id: 'evt-arjona',
    title: 'Ricardo Arjona SV - Lo Que El Seco No Dijo',
    subtitle: 'Gira Oficial El Salvador',
    category: 'Concierto',
    date: '2026-10-31',
    displayDate: 'OCT 31, 8:30 PM',
    venue: 'Estadio Cuscatlán, San Salvador',
    city: 'San Salvador',
    status: 'Últimos boletos',
    serviceFeeRate: 0.10,
    image: 'images/arjona.jpg',
    zones: [
      { id: 'z-arj-1', name: 'Sombra Sur / Norte', price: 55.00, available: 30 },
      { id: 'z-arj-2', name: 'Platea Central', price: 115.00, available: 14 },
      { id: 'z-arj-3', name: 'Silla Diamante', price: 185.00, available: 6 }
    ]
  },
  {
    id: 'evt-heroes',
    title: 'Héroes De Leyenda: Tributo',
    subtitle: 'Noche de rock en español en vivo',
    category: 'Concierto',
    date: '2026-11-05',
    displayDate: 'NOV 05, 8:00 PM',
    venue: 'Nivel 12 Sports Bar, San Salvador',
    city: 'San Salvador',
    status: 'Disponible',
    serviceFeeRate: 0.10,
    image: 'images/heroes.jpg',
    zones: [
      { id: 'z-her-1', name: 'Barra General', price: 10.00, available: 50 },
      { id: 'z-her-2', name: 'Mesa Terraza', price: 18.00, available: 24 },
      { id: 'z-her-3', name: 'Salón VIP Escenario', price: 30.00, available: 12 }
    ]
  },
  {
    id: 'evt-euphoria',
    title: 'EUPHORIA - El Futuro Ya Suena',
    subtitle: 'Experiencia electrónica audiovisual',
    category: 'Fiesta',
    date: '2026-11-05',
    displayDate: 'NOV 05, 9:00 PM',
    venue: 'Musiklub, San Salvador',
    city: 'San Salvador',
    status: 'Agotado',
    serviceFeeRate: 0.10,
    image: 'images/euphoria.jpg',
    zones: [
      { id: 'z-eup-1', name: 'Dancefloor Early Bird', price: 15.00, available: 0 },
      { id: 'z-eup-2', name: 'Backstage Pass', price: 35.00, available: 0 },
      { id: 'z-eup-3', name: 'Mesa Lounge', price: 80.00, available: 0 }
    ]
  }
];

export const images = [
  {
    id: 'usr-1',
    name: 'Cliente Autorizado UCA',
    phone: '+503 7000-0000',
    email: 'estudiante@uca.edu.sv',
    dui: '05489210-4',
    role: 'cliente'
  },
  {
    id: 'usr-2',
    name: 'Admin FunCapital',
    phone: '+503 7111-1111',
    email: 'admin@funcapital.sv',
    dui: '01234567-8',
    role: 'administrador'
  },
  {
    id: 'usr-3',
    name: 'Productora La Constancia',
    phone: '+503 7222-2222',
    email: 'eventos@laconstancia.sv',
    dui: '09876543-2',
    role: 'organizador'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FC-92841',
    eventId: 'evt-oktoberfest',
    eventTitle: 'Oktoberfest Pilsener 2026',
    venue: 'Parque Deportivo El Cafetalón, Santa Tecla',
    displayDate: 'Sábado 17 de Octubre, 07:00 PM',
    image: 'images/oktoberfest.jpg',
    zoneName: 'General',
    quantity: 1,
    unitPrice: 5.00,
    serviceFee: 1.00,
    total: 6.00,
    seat: 'A-12',
    holderName: 'Cliente Autorizado UCA',
    status: 'CONFIRMADO',
    createdAt: '2026-10-01'
  }
];
