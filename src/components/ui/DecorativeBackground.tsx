import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/index';

export const DecorativeBackground: React.FC = () => {
  const { colors, isDark } = useTheme();

  if (isDark) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.blob, styles.topBlob, { backgroundColor: colors.primaryLight, opacity: 0.35 }]} />
        <View style={[styles.blob, styles.bottomBlob, { backgroundColor: colors.primaryLight, opacity: 0.2 }]} />
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['rgba(79,107,246,0.12)', 'rgba(79,107,246,0)']}
        style={[styles.wave, styles.topWave]}
      />
      <LinearGradient
        colors={['rgba(155,93,229,0)', 'rgba(155,93,229,0.1)']}
        style={[styles.wave, styles.bottomWave]}
      />
      <View style={[styles.dot, { top: 72, left: 36, backgroundColor: 'rgba(79,107,246,0.15)' }]} />
      <View style={[styles.dot, { top: 110, right: 48, backgroundColor: 'rgba(155,93,229,0.12)' }]} />
      <View style={[styles.dot, { bottom: 120, left: 52, backgroundColor: 'rgba(79,107,246,0.1)' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 180,
  },
  topWave: {
    top: 0,
  },
  bottomWave: {
    bottom: 0,
    height: 140,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  topBlob: {
    width: 220,
    height: 220,
    top: -80,
    right: -40,
  },
  bottomBlob: {
    width: 180,
    height: 180,
    bottom: -60,
    left: -30,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
