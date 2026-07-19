export const categories = [
  { id: 1, name: "Gastronomía", description: "Restaurantes, cafeterías y sabores locales" },
  { id: 2, name: "Aventura", description: "Experiencias al aire libre y deportes" },
  { id: 3, name: "Cultura", description: "Museos, historia y patrimonio" },
  { id: 4, name: "Naturaleza", description: "Parques, reservas y paisajes" }
];

export const activities = [
  { id: 1, ownerId: 2, categoryId: 1, category: "Gastronomía", name: "Ruta de sabores quiteños", description: "Recorrido por mercados y espacios gastronómicos tradicionales con degustaciones locales.", city: "Quito", address: "Centro Histórico", latitude: -0.2202, longitude: -78.5123, referencePrice: 35, schedule: "Sábados 09:00 - 14:00", phone: "099 123 4567", email: "sabores@cityspot.ec", status: "ACTIVA", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, ownerId: 3, categoryId: 2, category: "Aventura", name: "Kayak en la laguna", description: "Experiencia guiada para principiantes con equipo incluido y vistas panorámicas.", city: "Cuenca", address: "Laguna de Busa", latitude: -3.123, longitude: -79.234, referencePrice: 48, schedule: "Viernes a domingo 08:00 - 16:00", phone: "098 555 1020", email: "aventura@cityspot.ec", status: "ACTIVA", image: "https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=1200&q=80" },
  { id: 3, ownerId: 2, categoryId: 3, category: "Cultura", name: "Museos y leyendas del centro", description: "Caminata cultural por museos, plazas y relatos representativos de la ciudad.", city: "Guayaquil", address: "Barrio Las Peñas", latitude: -2.1894, longitude: -79.882, referencePrice: 22, schedule: "Martes a domingo 10:00 - 18:00", phone: "096 222 3344", email: "cultura@cityspot.ec", status: "PENDIENTE", image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=80" },
  { id: 4, ownerId: 4, categoryId: 4, category: "Naturaleza", name: "Sendero de cascadas", description: "Ruta natural de dificultad media con guía local y paradas fotográficas.", city: "Baños", address: "Ruta de las Cascadas", latitude: -1.396, longitude: -78.423, referencePrice: 30, schedule: "Todos los días 07:30 - 15:30", phone: "097 777 8899", email: "naturaleza@cityspot.ec", status: "ACTIVA", image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80" }
];

export const searchHistory = [
  { id: 1, date: "2026-07-18", city: "Quito", company: "CitySpot", budget: 50, type: "Gastronomía" },
  { id: 2, date: "2026-07-16", city: "Baños", company: "CitySpot", budget: 40, type: "Naturaleza" }
];
