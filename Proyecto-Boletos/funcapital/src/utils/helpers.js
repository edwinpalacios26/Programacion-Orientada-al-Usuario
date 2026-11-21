export function formatCurrency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export function generateOrderCode() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `FC-${randomNum}`;
}

export function generateSeatCode() {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const num = Math.floor(1 + Math.random() * 40);
  return `${row}-${num}`;
}

export function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }
}
