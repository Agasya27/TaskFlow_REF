import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppWordmark } from '@components/ui/AppWordmark';

const GRADIENT = ['#4A5CFE', '#6F6AF8', '#9F6BFF'] as const;

interface RibbonBrandHeaderProps {
  lightText?: boolean;
}

function RibbonF({ size }: { size: number }) {
  const w = size * 0.26;
  const armW = size * 0.62;

  return (
    <View style={{ width: size * 0.72, height: size, marginBottom: 6 }}>
      <LinearGradient
        colors={[...GRADIENT]}
        start={{ x: 0.1, y: 1 }}
        end={{ x: 0.9, y: 0 }}
        style={[styles.stem, { width: w, height: size, borderRadius: w * 0.35 }]}
      />
      <LinearGradient
        colors={[...GRADIENT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.arm,
          {
            width: armW,
            height: size * 0.22,
            borderRadius: size * 0.08,
            top: size * 0.02,
            transform: [{ rotate: '-14deg' }],
          },
        ]}
      />
      <LinearGradient
        colors={['#5B6CF8', '#8F6CF8', '#B86CF0']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.arm,
          {
            width: armW * 0.82,
            height: size * 0.2,
            borderRadius: size * 0.08,
            top: size * 0.4,
            transform: [{ rotate: '-10deg' }],
          },
        ]}
      />
    </View>
  );
}

export const RibbonBrandHeader: React.FC<RibbonBrandHeaderProps> = ({ lightText = false }) => {
  const tagColor = lightText ? 'rgba(255,255,255,0.82)' : '#8E8E93';

  return (
    <View style={styles.container}>
      <RibbonF size={76} />
      <View style={styles.wordmark}>
        <AppWordmark size="lg" lightText={lightText} onLightBackground={!lightText} />
      </View>
      <Text style={[styles.tagline, { color: tagColor }]}>Plan. Focus. Achieve.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  stem: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  arm: {
    position: 'absolute',
    left: 0,
  },
  wordmark: {
    marginTop: 2,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
});
