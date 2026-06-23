import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SocialButtonProps {
  icon: 'google' | 'apple' | 'microsoft';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ICONS = {
  google: 'google',
  apple: 'apple',
  microsoft: 'microsoft',
} as const;

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  loading = false,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    accessibilityRole="button"
    accessibilityLabel={`Continue with ${icon}`}
    style={({ pressed }) => [
      styles.button,
      { opacity: pressed ? 0.9 : disabled ? 0.45 : 1 },
    ]}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#4A5CFE" />
    ) : (
      <MaterialCommunityIcons
        name={ICONS[icon]}
        size={24}
        color={icon === 'apple' ? '#1A1C3D' : undefined}
      />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEFF5',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
