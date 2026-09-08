import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({
  children,
  type = 'normal',
  icon = null,
  size = 'md',
  style = {}
}) {
  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 3, fontSize: 11 },
    md: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 }
  };

  const typeStyles = {
    normal: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
    success: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    danger: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    info: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    ai: { bg: '#f3e8ff', color: '#7c3aed', border: '#ddd6fe' }
  };

  const t = typeStyles[type] || typeStyles.normal;
  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <View style={[
      styles.badge,
      { backgroundColor: t.bg, borderColor: t.border, paddingHorizontal: s.paddingHorizontal, paddingVertical: s.paddingVertical },
      style
    ]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: t.color, fontSize: s.fontSize }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 2,
  },
  text: {
    fontWeight: '700',
  },
});
