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
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: radius.full,
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
