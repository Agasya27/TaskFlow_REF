import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';

interface TaskSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const TaskSearchBar: React.FC<TaskSearchBarProps> = ({
  value,
  onChangeText,
}) => {
  const { colors, fonts, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={colors.textSecondary}
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.textPrimary, fontFamily: fonts.body },
        ]}
        placeholder="Search tasks..."
        placeholderTextColor={colors.textDisabled}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
});
