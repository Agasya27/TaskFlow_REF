import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
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
  const { colors, fonts, spacing, radius } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isDisabled = disabled || loading;

  const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary, text: '#FFFFFF' },
    secondary: { bg: colors.primaryLight, text: colors.primary },
    ghost: { bg: 'transparent', text: colors.primary, border: colors.border },
    danger: { bg: colors.danger, text: '#FFFFFF' },
  };

  const sizeStyles: Record<Size, { height: number; px: number; fontSize: number; iconSize: number }> = {
    sm: { height: 36, px: spacing.md, fontSize: 13, iconSize: 16 },
    md: { height: 44, px: spacing.lg, fontSize: 15, iconSize: 18 },
    lg: { height: 52, px: spacing.xl, fontSize: 17, iconSize: 20 },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const containerStyle: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.px,
    backgroundColor: isDisabled ? colors.surfaceAlt : v.bg,
    borderRadius: radius.md,
    borderWidth: v.border ? 1 : 0,
    borderColor: isDisabled ? colors.border : v.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: fullWidth ? 'stretch' : 'auto',
    opacity: isDisabled ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    fontFamily: fonts.label,
    fontSize: s.fontSize,
    color: isDisabled ? colors.textDisabled : v.text,
  };

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
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isDisabled ? colors.textDisabled : v.text}
        />
      ) : (
        <>
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon}
              size={s.iconSize}
              color={isDisabled ? colors.textDisabled : v.text}
            />
          )}
          <Text style={textStyle}>{label}</Text>
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={s.iconSize}
              color={isDisabled ? colors.textDisabled : v.text}
            />
          )}
        </>
      )}
    </AnimatedPressable>
  );
};
