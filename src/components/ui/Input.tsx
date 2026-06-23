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
  const { colors, fonts, spacing, radius, shadows } = useTheme();
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

  return (
    <View style={[styles.container, { marginBottom: spacing.md }, containerStyle]}>
      {label ? (
        <Animated.Text
          style={[
            styles.label,
            { fontFamily: fonts.label, marginBottom: spacing.xs },
            labelAnimatedStyle,
          ]}
        >
          {label}
        </Animated.Text>
      ) : null}
      <AnimatedView
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            ...shadows.social,
          },
          borderAnimatedStyle,
        ]}
      >
        {leftIcon ? (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        ) : null}
        <TextInput
          style={[styles.input, { color: colors.textPrimary, fontFamily: fonts.body }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureProp && !secureVisible}
          {...rest}
        />
        {secureProp ? (
          <Pressable
            onPress={() => setSecureVisible(!secureVisible)}
            accessibilityRole="button"
            accessibilityLabel={secureVisible ? 'Hide password' : 'Show password'}
          >
            <MaterialCommunityIcons
              name={secureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
        {rightIcon && !secureProp ? (
          <MaterialCommunityIcons
            name={rightIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        ) : null}
      </AnimatedView>
      {error ? (
        <Text style={[styles.errorText, { color: colors.danger, fontFamily: fonts.body }]}>
          {error}
        </Text>
      ) : null}
      {hint && !error ? (
        <Text style={[styles.hintText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
});
