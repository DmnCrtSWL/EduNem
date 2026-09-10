import { enqueueChange, markAsSynced } from './offlineStore';

const GROUPS_ID = 'groups';
const PLANS_ID = 'monthlyPlans';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/edunem' : 'http://localhost:3000');

/**
 * Verifica si hay conectividad real al servidor (ping rapido).
 * @returns {Promise<boolean>}
 */
async function hasRealConnection() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      method: 'GET',
      cache: 'no-store',  // No usar cache del SW
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}

async function fetchFromApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/${id}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`[db] Error fetching ${id}:`, error);
    return null;
  }
}

/**
 * Guarda en la cola local primero (latencia cero) y luego intenta subir al servidor.
 * Si falla la red, el syncEngine lo reintentará automáticamente.
 */
async function saveToApi(id, data) {
  // 1. Encolar SIEMPRE en localStorage primero (offline-first, latencia cero)
  const localId = enqueueChange(id, data);

  // 2. Si el dispositivo no tiene red (ej. modo avión), salir de inmediato (0ms espera)
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.info(`[db] Dispositivo offline (modo avión/sin red) — cambio encolado (${id}):`, localId);
    return;
  }

  // 3. Verificar conectividad real antes de hacer fetch
  const connected = await hasRealConnection();
  if (!connected) {
    console.info(`[db] Sin red — cambio encolado (${id}):`, localId);
    return; // Sale aqui — el syncEngine lo reintentará
  }

  // 3. Si hay red, enviar al servidor
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ data })
    });
    if (!response.ok) throw new Error('Server error');
    // 4. Exito: marcar como SYNCED
    markAsSynced([{ localId }]);
  } catch (error) {
    console.warn(`[db] Fallo al enviar (${id}), queda en cola:`, localId);
  }
}

export async function fetchGroups() {
  return fetchFromApi(GROUPS_ID);
}

export async function saveGroups(groups) {
  return saveToApi(GROUPS_ID, groups);
}

export async function fetchMonthlyPlans() {
  return fetchFromApi(PLANS_ID);
}

export async function saveMonthlyPlans(plans) {
  return saveToApi(PLANS_ID, plans);
}

export async function seedDatabase(mockGroups, mockPlans) {
  try {
    console.log("Seeding Postgres database...");
    await saveGroups(mockGroups);
    await saveMonthlyPlans(mockPlans);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
