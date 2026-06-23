import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@theme/index';

interface AvatarProps {
  name: string;
  size?: number;
  imageUri?: string;
}

const AVATAR_COLORS = [
  '#4F6BF6', '#9B5DE5', '#22C55E', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#14B8A6',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  imageUri,
}) => {
  const { fonts } = useTheme();
  const bgColor = AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length];
  const fontSize = size * 0.38;

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize, fontFamily: fonts.heading }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
  },
  image: {
    resizeMode: 'cover',
  },
});
