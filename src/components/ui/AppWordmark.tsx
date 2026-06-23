import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightColors, useTheme } from '@theme/index';

interface AppWordmarkProps {
  size?: 'md' | 'lg';
  lightText?: boolean;
  onLightBackground?: boolean;
}

const FONT_SIZES = {
  md: 26,
  lg: 34,
} as const;

export const AppWordmark: React.FC<AppWordmarkProps> = ({
  size = 'md',
  lightText = false,
  onLightBackground = false,
}) => {
  const { colors, fonts } = useTheme();
  const fontSize = FONT_SIZES[size];
  const palette = onLightBackground ? lightColors : colors;
  const taskColor = lightText ? '#FFFFFF' : palette.textPrimary;
  const flowColor = lightText ? '#D4C4FF' : palette.primary;

  return (
    <View style={styles.row}>
      <Text style={[styles.text, { color: taskColor, fontFamily: fonts.display, fontSize }]}>Task</Text>
      <Text style={[styles.text, { color: flowColor, fontFamily: fonts.display, fontSize }]}>Flow</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    letterSpacing: -0.5,
  },
});
