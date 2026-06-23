import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@theme/index';

type FilterType = 'all' | 'pending' | 'completed';

interface TaskFilterProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export const TaskFilter: React.FC<TaskFilterProps> = ({ active, onChange }) => {
  const { colors, fonts, spacing, radius } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      {FILTERS.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <Pressable key={key} onPress={() => onChange(key)}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.primary : colors.chipInactive,
                  paddingVertical: 9,
                  paddingHorizontal: spacing.md,
                  borderRadius: radius.full,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: fonts.label,
                  fontSize: 13,
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                }}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  chip: {
    alignItems: 'center',
  },
});
