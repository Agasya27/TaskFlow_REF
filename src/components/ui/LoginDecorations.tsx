import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const LoginDecorations: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient
      colors={['rgba(155,107,255,0.18)', 'rgba(155,107,255,0)']}
      style={styles.topWave}
    />

    <View style={[styles.floatIcon, { top: 118, left: 28 }]}>
      <MaterialCommunityIcons name="checkbox-marked-outline" size={22} color="rgba(124,97,255,0.35)" />
    </View>
    <View style={[styles.floatIcon, { top: 96, right: 34 }]}>
      <MaterialCommunityIcons name="calendar-blank-outline" size={22} color="rgba(124,97,255,0.3)" />
    </View>
    <View style={[styles.dashArc, { top: 128, left: 54 }]} />

    <MaterialCommunityIcons
      name="star-four-points"
      size={14}
      color="rgba(155,107,255,0.45)"
      style={{ position: 'absolute', top: 168, right: 72 }}
    />

    <LinearGradient
      colors={['rgba(74,92,254,0)', 'rgba(74,92,254,0.22)', 'rgba(159,107,255,0.28)']}
      style={styles.bottomWaveA}
    />
    <LinearGradient
      colors={['rgba(74,92,254,0.15)', 'rgba(124,97,255,0.35)']}
      style={styles.bottomWaveB}
    />

    <View style={styles.checklistCard}>
      <View style={styles.checkRow}>
        <MaterialCommunityIcons name="check" size={12} color="#4A5CFE" />
        <View style={[styles.checkLine, { width: 42 }]} />
      </View>
      <View style={styles.checkRow}>
        <MaterialCommunityIcons name="check" size={12} color="#4A5CFE" />
        <View style={[styles.checkLine, { width: 36 }]} />
      </View>
      <View style={styles.checkRow}>
        <MaterialCommunityIcons name="check" size={12} color="#4A5CFE" />
        <View style={[styles.checkLine, { width: 48 }]} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    height: 160,
    borderBottomRightRadius: 120,
  },
  floatIcon: {
    position: 'absolute',
  },
  dashArc: {
    position: 'absolute',
    width: 120,
    height: 60,
    borderTopWidth: 1.5,
    borderColor: 'rgba(124,97,255,0.22)',
    borderStyle: 'dashed',
    borderRadius: 80,
    transform: [{ rotate: '12deg' }],
  },
  bottomWaveA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 40,
  },
  bottomWaveB: {
    position: 'absolute',
    bottom: -20,
    left: -30,
    width: 220,
    height: 120,
    borderTopRightRadius: 100,
    transform: [{ rotate: '-8deg' }],
  },
  checklistCard: {
    position: 'absolute',
    bottom: 54,
    right: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#4A5CFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8EDFF',
  },
});
