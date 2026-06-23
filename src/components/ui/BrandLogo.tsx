import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/index';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'lg',
  showTagline = true,
  lightText = false,
}) => {
  const { fonts, gradients, colors } = useTheme();

  const sizes = {
    sm: { mark: 40, fSize: 22, title: 22, tag: 12 },
    md: { mark: 52, fSize: 28, title: 28, tag: 13 },
    lg: { mark: 64, fSize: 34, title: 34, tag: 14 },
  };
  const s = sizes[size];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...gradients.brandMark]}
        start={{ x: 0.2, y: 1 }}
        end={{ x: 0.8, y: 0 }}
        style={[
          styles.mark,
          {
            width: s.mark,
            height: s.mark,
            borderRadius: s.mark * 0.28,
          },
        ]}
      >
        <Text style={[styles.markLetter, { fontSize: s.fSize, fontFamily: fonts.display }]}>
          F
        </Text>
      </LinearGradient>

      <View style={styles.wordmark}>
        <Text
          style={[
            styles.word,
            {
              fontSize: s.title,
              fontFamily: fonts.display,
              color: lightText ? '#FFFFFF' : colors.textPrimary,
            },
          ]}
        >
          task{' '}
        </Text>
        <Text
          style={[
            styles.word,
            {
              fontSize: s.title,
              fontFamily: fonts.display,
              color: colors.primaryEnd,
            },
          ]}
        >
          flow
        </Text>
      </View>

      {showTagline ? (
        <Text
          style={[
            styles.tagline,
            {
              fontFamily: fonts.body,
              fontSize: s.tag,
              color: lightText ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
            },
          ]}
        >
          Plan. Focus. Achieve.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLetter: {
    color: '#FFFFFF',
    marginTop: -2,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: -2,
  },
});
