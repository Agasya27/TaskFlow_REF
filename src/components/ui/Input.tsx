import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  hint?: string;
  containerStyle?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry: secureProp = false,
  leftIcon,
  rightIcon,
  hint,
  containerStyle,
  ...rest
}) => {
  const { colors, fonts, spacing, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(!secureProp);
  const focusProgress = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 200 });
  };

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [error ? colors.danger : colors.border, error ? colors.danger : colors.primary],
    );
    return { borderColor };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.textSecondary, colors.primary],
    );
    return { color };
  });

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontFamily: fonts.label,
      fontSize: 13,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      borderWidth: 1.5,
      paddingHorizontal: spacing.md,
      height: 48,
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: fonts.body,
      fontSize: 15,
      color: colors.textPrimary,
      height: '100%',
    },
    errorText: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.danger,
      marginTop: spacing.xs,
    },
    hintText: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
        </Animated.Text>
      )}
      <AnimatedView style={[styles.inputContainer, borderAnimatedStyle]}>
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureProp && !secureVisible}
          {...rest}
        />
        {secureProp && (
          <Pressable onPress={() => setSecureVisible(!secureVisible)}>
            <MaterialCommunityIcons
              name={secureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
        {rightIcon && !secureProp && (
          <MaterialCommunityIcons
            name={rightIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        )}
      </AnimatedView>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};
