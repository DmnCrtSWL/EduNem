import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../ui/Icon';
import OfflineSyncSheet from '../ui/OfflineSyncSheet';

const STORAGE_KEY = 'edunem_offline_queue';

/** Lee directamente de localStorage — sin depender del contexto */
function usePendingCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function read() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const q = raw ? JSON.parse(raw) : [];
        setCount(q.filter(i => i.syncStatus === 'PENDING').length);
      } catch {
        setCount(0);
      }
    }

    read(); // lectura inmediata
    const interval = setInterval(read, 2000); // refresca cada 2 segundos
    return () => clearInterval(interval);
  }, []);

  return count;
}

export default function Navbar({ activeRole, onRoleChange, theme, onToggleTheme, onLogout, currentUser }) {
  const isDark = theme === 'dark';
  const pendingCount = usePendingCount();
  const [showSyncSheet, setShowSyncSheet] = useState(false);

  return (
    <>
      <View style={[
        styles.header,
        {
          marginTop: 'max(env(safe-area-inset-top), 18px)',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          borderRadius: 24,
          marginHorizontal: 12,
          marginBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          elevation: 8,
        }
      ]}>
        <View style={styles.brandRow}>
          <View style={styles.badgeSep}>
            <Text style={styles.badgeSepText}>SEP</Text>
          </View>
          <View>
            <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>EduNEM Pro • Ecosistema Digital</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>Secundaria Técnica #45 Vicente Guerrero • Michoacán</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {currentUser && (
            <View style={[
              styles.userCard,
              {
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                borderColor: isDark ? '#334155' : '#e2e8f0'
              }
            ]}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Icon name="user" size={16} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.userName, { color: isDark ? '#f8fafc' : '#0f172a' }]}>{currentUser.name}</Text>
                  <Text style={styles.userRole}>
                    {currentUser.role === 'teacher' ? 'Docente' : currentUser.role === 'director' ? 'Director' : currentUser.role === 'parent' ? 'Padre de Familia' : 'Trabajo Social'}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />

              <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Salir</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Badge de nube — lee localStorage directo, sin contexto */}
          {pendingCount > 0 && (
            <TouchableOpacity
              onPress={() => setShowSyncSheet(true)}
              style={[
                styles.offlineBadge,
                { backgroundColor: isDark ? '#292524' : '#fffbeb', borderColor: isDark ? '#78350f' : '#fde68a' }
              ]}
              activeOpacity={0.75}
            >
              <Text style={styles.offlineBadgeCloud}>☁</Text>
              <Text style={[styles.offlineBadgeCount, { color: isDark ? '#fbbf24' : '#92400e' }]}>
                {pendingCount}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onToggleTheme}
            style={[styles.themeIconButton, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: isDark ? '#334155' : '#e2e8f0' }]}
            activeOpacity={0.8}
          >
            <Icon name={isDark ? 'moon' : 'sun'} size={18} color={isDark ? '#60a5fa' : '#d97706'} />
          </TouchableOpacity>
        </View>
      </View>

      <OfflineSyncSheet visible={showSyncSheet} onClose={() => setShowSyncSheet(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeSep: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSepText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
  },
  userRole: {
    fontSize: 10,
    fontWeight: '700',
    color: '#60a5fa',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 20,
  },
  logoutButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  offlineBadgeCloud: {
    fontSize: 13,
    color: '#d97706',
  },
  offlineBadgeCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  themeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
