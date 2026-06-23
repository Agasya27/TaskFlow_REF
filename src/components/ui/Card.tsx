import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@theme/index';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const { colors, radius, shadows } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadows.card,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          styles.padding,
          pressed && { opacity: 0.95 },
          style,
        ]}
        android_ripple={{ color: colors.primaryLight, borderless: false }}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, styles.padding, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  padding: {
    padding: 16,
  },
});
