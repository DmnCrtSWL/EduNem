/**
 * OfflineContext.jsx — Contexto global de conectividad offline para EduNem
 * Version simplificada sin Animated (evita bugs en react-native-web).
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPendingCount } from '../lib/offlineStore';
import { checkServerConnection, syncPendingQueue, startAutoSync, stopAutoSync } from '../lib/syncEngine';

const OfflineContext = createContext({
  isOnline: true,
  pendingCount: 0,
  forceSync: async () => 0,
  lastSyncedAt: null,
  refreshPendingCount: () => {},
});

function SyncToast({ message, visible }) {
  if (!visible) return null;
  return (
    <View style={styles.syncToast} pointerEvents="none">
      <Text style={styles.syncToastText}>{message}</Text>
    </View>
  );
}

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(() => getPendingCount());
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncToast, setSyncToast] = useState({ visible: false, message: '' });
  const toastTimerRef = useRef(null);

  const showSyncToast = useCallback((count) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setSyncToast({
      visible: true,
      message: `☁  ${count} ${count === 1 ? 'registro sincronizado' : 'registros sincronizados'}`,
    });
    toastTimerRef.current = setTimeout(() => {
      setSyncToast({ visible: false, message: '' });
    }, 2800);
  }, []);

  const refreshPendingCount = useCallback(() => {
    setPendingCount(getPendingCount());
  }, []);

  const handleSyncDone = useCallback((syncedCount) => {
    refreshPendingCount();
    setLastSyncedAt(new Date());
    if (syncedCount > 0) showSyncToast(syncedCount);
  }, [refreshPendingCount, showSyncToast]);

  // Verificación de conectividad real cada 15 segundos
  useEffect(() => {
    let cancelled = false;
    async function checkConnection() {
      try {
        const online = await checkServerConnection();
        if (!cancelled) setIsOnline(online);
      } catch {
        if (!cancelled) setIsOnline(false);
      }
    }
    checkConnection();
    const checkInterval = setInterval(checkConnection, 15000);
    const handleOnline = () => checkConnection();
    const handleOffline = () => { if (!cancelled) setIsOnline(false); };
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    return () => {
      cancelled = true;
      clearInterval(checkInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Polling rapido del contador local (localStorage) — sin red, sin costo
  useEffect(() => {
    const pollInterval = setInterval(refreshPendingCount, 2000);
    return () => clearInterval(pollInterval);
  }, [refreshPendingCount]);

  // Auto-sync cada 20 segundos
  useEffect(() => {
    startAutoSync(handleSyncDone, 20000);
    return () => stopAutoSync();
  }, [handleSyncDone]);

  // Cleanup del toast timer
  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, []);

  const forceSync = useCallback(async () => {
    const count = await syncPendingQueue(handleSyncDone);
    refreshPendingCount();
    return count;
  }, [handleSyncDone, refreshPendingCount]);

  return (
    <OfflineContext.Provider value={{ isOnline, pendingCount, forceSync, lastSyncedAt, refreshPendingCount }}>
      {children}
      <SyncToast message={syncToast.message} visible={syncToast.visible} />
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}

const styles = StyleSheet.create({
  syncToast: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999,
  },
  syncToastText: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
