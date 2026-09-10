import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function ClassSelector({ groups, selectedGroupId, onSelectGroup }) {
  const { theme } = useTheme();
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      <Text style={[styles.title, { color: theme.colors.textMain }]}>
        {currentGroup.grade}{currentGroup.group} — {currentGroup.subject}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
        <View style={[styles.scheduleBadge, { backgroundColor: theme.colors.bgPrimary }]}>
          <Icon name="clock" size={13} color={theme.colors.primary} />
          <Text style={[styles.scheduleText, { color: theme.colors.primary }]}>{currentGroup.schedule}</Text>
        </View>
        <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textMuted }}>{currentGroup.classroom}</Text>
      </View>

      {onSelectGroup && groups && groups.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 4, paddingBottom: 4 }}>
          {groups.map(g => {
            const isSelected = g.id === selectedGroupId;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => onSelectGroup(g.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: isSelected ? theme.colors.primary : (theme.isDark ? '#1e293b' : '#f1f5f9'),
                  borderWidth: 1,
                  borderColor: isSelected ? theme.colors.primary : (theme.isDark ? '#334155' : '#e2e8f0'),
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: isSelected ? '#ffffff' : theme.colors.textMain }}>
                  {g.grade}{g.group} • {g.subject.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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

