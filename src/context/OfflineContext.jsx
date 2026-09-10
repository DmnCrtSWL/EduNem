/**
 * OfflineContext.jsx — Contexto global de conectividad offline para EduNem
 * Provee isOnline, pendingCount, forceSync y lastSyncedAt a toda la app.
 * Incluye su propio toast de sincronización silencioso integrado.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getPendingCount } from '../lib/offlineStore';
import { checkServerConnection, syncPendingQueue, startAutoSync, stopAutoSync } from '../lib/syncEngine';

const OfflineContext = createContext({
  isOnline: true,
  pendingCount: 0,
  forceSync: () => {},
  lastSyncedAt: null,
  refreshPendingCount: () => {},
});

function SyncToast({ message, visible }) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.syncToast, { opacity }]}>
      <Text style={styles.syncToastText}>{message}</Text>
    </Animated.View>
  );
}

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncToast, setSyncToast] = useState({ visible: false, message: '' });

  const showSyncToast = useCallback((count) => {
    setSyncToast({ visible: true, message: `☁  ${count} ${count === 1 ? 'registro sincronizado' : 'registros sincronizados'}` });
    setTimeout(() => setSyncToast({ visible: false, message: '' }), 2800);
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
      const online = await checkServerConnection();
      if (!cancelled) setIsOnline(online);
    }

    checkConnection();
    const checkInterval = setInterval(checkConnection, 15000);

    const handleOnline = () => checkConnection();
    const handleOffline = () => !cancelled && setIsOnline(false);
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
    const pollInterval = setInterval(refreshPendingCount, 3000);
    return () => clearInterval(pollInterval);
  }, [refreshPendingCount]);

  // Auto-sync cada 20 segundos
  useEffect(() => {
    refreshPendingCount();
    startAutoSync(handleSyncDone, 20000);
    return () => stopAutoSync();
  }, [handleSyncDone, refreshPendingCount]);

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
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 99999,
    pointerEvents: 'none',
  },
  syncToastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
