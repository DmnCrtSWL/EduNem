/**
 * offlineStore.js — Outbox Pattern para EduNem
 * Persiste cambios en localStorage con estado PENDING hasta que el
 * syncEngine los suba al servidor y los marque como SYNCED.
 */

const STORAGE_KEY = 'edunem_offline_queue';

/** @returns {Array} Cola completa (todos los estados) */
function getQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** @param {Array} queue Guarda la cola completa */
function setQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edunem:queue_updated'));
    }
  } catch (e) {
    console.error('[OfflineStore] Error saving queue:', e);
  }
}

/**
 * Encola un cambio para sincronizar después.
 * @param {string} resource  - Identificador del recurso: 'groups' | 'monthlyPlans'
 * @param {*} payload        - Datos completos a guardar
 * @returns {string} localId generado
 */
export function enqueueChange(resource, payload) {
  const queue = getQueue();
  const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  queue.push({
    localId,
    resource,
    syncStatus: 'PENDING',
    createdAt: new Date().toISOString(),
    payload,
  });
  setQueue(queue);
  return localId;
}

/** @returns {Array} Solo los items con syncStatus === 'PENDING' */
export function getPendingQueue() {
  return getQueue().filter(item => item.syncStatus === 'PENDING');
}

/** @returns {number} Cantidad de cambios pendientes */
export function getPendingCount() {
  return getPendingQueue().length;
}

/**
 * Marca items como SYNCED tras confirmación del servidor.
 * @param {Array<{localId: string, serverId?: string}>} results
 */
export function markAsSynced(results) {
  const queue = getQueue();
  const syncedIds = new Set(results.map(r => r.localId));
  const updated = queue.map(item => {
    if (syncedIds.has(item.localId)) {
      const result = results.find(r => r.localId === item.localId);
      return { ...item, syncStatus: 'SYNCED', serverId: result?.serverId };
    }
    return item;
  });
  setQueue(updated);
}

/**
 * Marca items como FAILED tras error irrecuperable.
 * @param {string[]} localIds
 */
export function markAsFailed(localIds) {
  const failedSet = new Set(localIds);
  const queue = getQueue().map(item =>
    failedSet.has(item.localId) ? { ...item, syncStatus: 'FAILED' } : item
  );
  setQueue(queue);
}

/**
 * Elimina items SYNCED de más de 24 horas para no inflar el localStorage.
 */
export function clearSyncedItems() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const queue = getQueue().filter(item => {
    if (item.syncStatus !== 'SYNCED') return true;
    return new Date(item.createdAt).getTime() > cutoff;
  });
  setQueue(queue);
}
