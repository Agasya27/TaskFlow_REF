import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/index';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
}) => {
  const { colors, fonts, spacing, radius } = useTheme();

  const variantMap: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning },
    danger: { bg: colors.dangerLight, text: colors.danger },
    neutral: { bg: colors.surfaceAlt, text: colors.textSecondary },
    primary: { bg: colors.primaryLight, text: colors.primary },
  };

  const sizeMap: Record<BadgeSize, { py: number; px: number; fontSize: number }> = {
    sm: { py: 2, px: spacing.sm, fontSize: 11 },
    md: { py: spacing.xs, px: spacing.md, fontSize: 13 },
  };

  const v = variantMap[variant];
  const s = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: v.bg,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: radius.full,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: fonts.label,
          fontSize: s.fontSize,
          color: v.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
