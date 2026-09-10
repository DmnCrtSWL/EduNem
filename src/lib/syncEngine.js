/**
 * syncEngine.js — Motor de Sincronización en Segundo Plano para EduNem
 * Detecta conectividad real con el servidor y sube los cambios pendientes en lote.
 */

import {
  getPendingQueue,
  markAsSynced,
  markAsFailed,
  clearSyncedItems,
} from './offlineStore';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.PROD
    ? '/edunem'
    : 'http://localhost:3000');

const HEALTH_URL = `${API_BASE_URL}/health`;
const SYNC_URL = `${API_BASE_URL}/api/data`;

/**
 * Verifica si el servidor realmente responde.
 * Usa AbortController para timeout estricto de 3.5 segundos.
 * @returns {Promise<boolean>}
 */
export async function checkServerConnection() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(HEALTH_URL, { signal: controller.signal, method: 'GET' });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}

/**
 * Sincroniza todos los cambios PENDING con el servidor.
 * Envía cada recurso por separado usando el endpoint existente POST /api/data/:id.
 * @param {(syncedCount: number) => void} onSyncDone - Callback cuando termina
 * @returns {Promise<number>} Cantidad de items sincronizados
 */
export async function syncPendingQueue(onSyncDone) {
  const pending = getPendingQueue();
  if (pending.length === 0) return 0;

  const isOnline = await checkServerConnection();
  if (!isOnline) return 0;

  // Agrupar por resource para enviar un único payload por tipo
  const grouped = {};
  for (const item of pending) {
    if (!grouped[item.resource]) grouped[item.resource] = [];
    grouped[item.resource].push(item);
  }

  const syncedResults = [];
  const failedIds = [];

  for (const [resource, items] of Object.entries(grouped)) {
    try {
      // El backend guarda el estado completo del array — tomamos el payload más reciente
      const latestPayload = items[items.length - 1].payload;
      const res = await fetch(`${SYNC_URL}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: latestPayload }),
      });
      if (res.ok) {
        // Marcar todos los items de este resource como sincronizados
        for (const item of items) {
          syncedResults.push({ localId: item.localId });
        }
      } else {
        for (const item of items) {
          failedIds.push(item.localId);
        }
      }
    } catch {
      for (const item of items) {
        failedIds.push(item.localId);
      }
    }
  }

  if (syncedResults.length > 0) markAsSynced(syncedResults);
  if (failedIds.length > 0) markAsFailed(failedIds);

  clearSyncedItems();

  if (syncedResults.length > 0 && onSyncDone) {
    onSyncDone(syncedResults.length);
  }

  return syncedResults.length;
}

let autoSyncIntervalId = null;
let onlineListenerAdded = false;

/**
 * Inicia la sincronización automática periódica y al recuperar red.
 * @param {(syncedCount: number) => void} onSyncDone
 * @param {number} intervalMs - Default: 20000 (20 segundos)
 */
export function startAutoSync(onSyncDone, intervalMs = 20000) {
  // Limpiar intervalo previo
  if (autoSyncIntervalId) clearInterval(autoSyncIntervalId);

  autoSyncIntervalId = setInterval(() => {
    syncPendingQueue(onSyncDone);
  }, intervalMs);

  // Listener de reconexión del browser (solo una vez)
  if (!onlineListenerAdded && typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      syncPendingQueue(onSyncDone);
    });
    onlineListenerAdded = true;
  }
}

/** Detiene el auto-sync (para cleanup en unmount) */
export function stopAutoSync() {
  if (autoSyncIntervalId) {
    clearInterval(autoSyncIntervalId);
    autoSyncIntervalId = null;
  }
}
