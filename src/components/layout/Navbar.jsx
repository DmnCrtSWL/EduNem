import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from '../ui/Icon';

export default function Navbar({ activeRole, onRoleChange, theme, onToggleTheme, onLogout, currentUser }) {
  const isDark = theme === 'dark';
  return (
    <View style={[
      styles.header,
      {
        paddingTop: Platform.OS === 'ios' ? 44 : 12,
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderBottomColor: isDark ? '#334155' : '#e2e8f0'
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

        <TouchableOpacity onPress={onToggleTheme} style={[styles.themeIconButton, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: isDark ? '#334155' : '#e2e8f0' }]} activeOpacity={0.8}>
          <Icon name={isDark ? 'moon' : 'sun'} size={18} color={isDark ? '#60a5fa' : '#d97706'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
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
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#f8fafc',
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
    backgroundColor: '#334155',
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
  themeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
