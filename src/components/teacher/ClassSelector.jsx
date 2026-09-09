import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function ClassSelector({ groups, selectedGroupId }) {
  const { theme } = useTheme();
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      <Text style={[styles.title, { color: theme.colors.textMain }]}>
        {currentGroup.grade}{currentGroup.group} — {currentGroup.subject}
      </Text>
      <View style={[styles.scheduleBadge, { backgroundColor: theme.colors.bgPrimary }]}>
        <Icon name="clock" size={13} color={theme.colors.primary} />
        <Text style={[styles.scheduleText, { color: theme.colors.primary }]}>{currentGroup.schedule}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  scheduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});

