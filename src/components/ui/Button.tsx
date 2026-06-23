import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';

type Variant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
}) => {
  const { colors, fonts, spacing, radius, gradients, shadows } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isDisabled = disabled || loading;
  const useGradient = variant === 'gradient' || variant === 'primary';

  const variantStyles: Record<Exclude<Variant, 'gradient' | 'primary'>, { bg: string; text: string; border?: string }> = {
    secondary: { bg: colors.primaryLight, text: colors.primary },
    ghost: { bg: 'transparent', text: colors.link },
    danger: { bg: colors.danger, text: '#FFFFFF' },
  };

  const sizeStyles: Record<Size, { height: number; px: number; fontSize: number; iconSize: number }> = {
    sm: { height: 38, px: spacing.md, fontSize: 13, iconSize: 16 },
    md: { height: 48, px: spacing.lg, fontSize: 15, iconSize: 18 },
    lg: { height: 54, px: spacing.xl, fontSize: 17, iconSize: 20 },
  };

  const s = sizeStyles[size];
  const v = useGradient ? null : variantStyles[variant as 'secondary' | 'ghost' | 'danger'];

  const containerStyle: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.px,
    backgroundColor: useGradient ? 'transparent' : isDisabled ? colors.surfaceAlt : v?.bg,
    borderRadius: radius.md,
    borderWidth: v?.border ? 1 : 0,
    borderColor: isDisabled ? colors.border : v?.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: fullWidth ? 'stretch' : 'auto',
    opacity: isDisabled ? 0.6 : 1,
    overflow: 'hidden',
    ...(useGradient && !isDisabled ? shadows.button : {}),
  };

  const textStyle: TextStyle = {
    fontFamily: fonts.label,
    fontSize: s.fontSize,
    color: isDisabled
      ? colors.textDisabled
      : useGradient
        ? '#FFFFFF'
        : v?.text ?? '#FFFFFF',
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={useGradient ? '#FFFFFF' : isDisabled ? colors.textDisabled : v?.text}
        />
      ) : (
        <>
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon}
              size={s.iconSize}
              color={textStyle.color as string}
            />
          )}
          <Text style={textStyle}>{label}</Text>
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={s.iconSize}
              color={textStyle.color as string}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[containerStyle, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {useGradient && !isDisabled ? (
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.inner}>{content}</View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
