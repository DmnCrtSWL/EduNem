import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { theme } from '../../theme/tokens';

export default function Button({
  children,
  onClick,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null,
  disabled = false,
  style,
  ...props
}) {
  const handlePress = onPress || onClick;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style
      ]}
      {...props}
    >
      {icon && typeof icon === 'string' ? (
        <Text style={styles.iconText}>{icon}</Text>
      ) : (
        icon
      )}
      {typeof children === 'string' ? (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  iconText: {
    fontSize: 16,
  },
  text: {
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },

  // Sizes
  sm: { paddingVertical: 6, paddingHorizontal: 12 },
  md: { paddingVertical: 10, paddingHorizontal: 16 },
  lg: { paddingVertical: 14, paddingHorizontal: 22 },
  xl: { paddingVertical: 18, paddingHorizontal: 28 },

  // Variants
  primary: { backgroundColor: theme.colors.primary },
  primaryText: { color: '#ffffff' },
  ai: { backgroundColor: '#8b5cf6' },
  aiText: { color: '#ffffff' },
  sos: { backgroundColor: theme.colors.danger },
  sosText: { color: '#ffffff' },
  warning: { backgroundColor: theme.colors.warn },
  warningText: { color: '#ffffff' },
  secondary: { backgroundColor: theme.colors.bgRow, borderWidth: 1, borderColor: theme.colors.borderLight },
  secondaryText: { color: theme.colors.textMain },
  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: theme.colors.textMuted },
  success: { backgroundColor: theme.colors.ok },
  successText: { color: '#ffffff' },
});

