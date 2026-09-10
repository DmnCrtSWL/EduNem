/**
 * OfflineSyncSheet.jsx — Bottom sheet suave de sincronización offline.
 * Aparece al tocar el micro-badge de nube en el Navbar.
 * No bloquea la pantalla, tap fuera lo cierra.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useOffline } from '../../context/OfflineContext';
import { useTheme } from '../../context/ThemeContext';

export default function OfflineSyncSheet({ visible, onClose }) {
  const { isOnline, pendingCount, forceSync, lastSyncedAt } = useOffline();
  const { theme, isDark } = useTheme();
  const [syncing, setSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setJustSynced(false);
    await forceSync();
    setSyncing(false);
    setJustSynced(true);
    setTimeout(() => { setJustSynced(false); onClose(); }, 1500);
  };

  const formatLastSync = () => {
    if (!lastSyncedAt) return 'Aún no sincronizado';
    const diff = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000);
    if (diff < 60) return `Hace ${diff} seg`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    return `Hace ${Math.floor(diff / 3600)} hrs`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay semi-transparente — tap fuera cierra */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }]}
          onPress={() => {}}
        >
          {/* Asa del sheet */}
          <View style={[styles.handle, { backgroundColor: isDark ? '#475569' : '#cbd5e1' }]} />

          {/* Icono de estado */}
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: isOnline ? '#ecfdf5' : '#fffbeb', borderColor: isOnline ? '#a7f3d0' : '#fde68a' }]}>
              <Text style={styles.iconText}>{isOnline ? '🟢' : '🟡'}</Text>
            </View>
            <View>
              <Text style={[styles.statusTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                {isOnline ? 'Conectado con la escuela' : 'Guardado en este teléfono'}
              </Text>
              <Text style={[styles.statusSub, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                Última sync: {formatLastSync()}
              </Text>
            </View>
          </View>

          {/* Mensaje descriptivo */}
          {pendingCount > 0 ? (
            <View style={[styles.pendingBox, { backgroundColor: isDark ? '#292524' : '#fffbeb', borderColor: isDark ? '#78350f' : '#fde68a' }]}>
              <Text style={[styles.pendingText, { color: isDark ? '#fbbf24' : '#92400e' }]}>
                ☁  {pendingCount} {pendingCount === 1 ? 'cambio guardado' : 'cambios guardados'} en este teléfono.
              </Text>
              <Text style={[styles.pendingDesc, { color: isDark ? '#a3a3a3' : '#78716c' }]}>
                Se sincronizarán solos cuando haya red estable.
              </Text>
            </View>
          ) : (
            <View style={[styles.pendingBox, { backgroundColor: isDark ? '#052e16' : '#ecfdf5', borderColor: isDark ? '#166534' : '#a7f3d0' }]}>
              <Text style={[styles.pendingText, { color: isDark ? '#4ade80' : '#166534' }]}>
                ✓  Todo sincronizado con el servidor.
              </Text>
            </View>
          )}

          {/* Botón de sincronización manual */}
          {pendingCount > 0 && (
            <TouchableOpacity
              onPress={handleSync}
              disabled={syncing || !isOnline}
              style={[
                styles.syncBtn,
                {
                  backgroundColor: isOnline ? (isDark ? '#2563eb' : '#2563eb') : (isDark ? '#374151' : '#e2e8f0'),
                  opacity: syncing ? 0.7 : 1,
                }
              ]}
              activeOpacity={0.8}
            >
              {syncing ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.syncBtnText}>Sincronizando...</Text>
                </>
              ) : justSynced ? (
                <Text style={styles.syncBtnText}>✓ Listo</Text>
              ) : (
                <Text style={[styles.syncBtnText, { color: isOnline ? '#ffffff' : (isDark ? '#6b7280' : '#94a3b8') }]}>
                  {isOnline ? 'Sincronizar ahora' : 'Sin conexión con el servidor'}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {/* Cerrar */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeBtnText, { color: isDark ? '#64748b' : '#94a3b8' }]}>Cerrar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 14,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusSub: {
    fontSize: 12,
    marginTop: 2,
  },
  pendingBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pendingDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  syncBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
