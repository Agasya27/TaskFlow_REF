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
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AuthFieldProps extends Omit<TextInputProps, 'style'> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  containerStyle?: ViewStyle;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry: secureProp = false,
  leftIcon,
  containerStyle,
  ...rest
}) => {
  const [secureVisible, setSecureVisible] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <MaterialCommunityIcons name={leftIcon} size={20} color="#A89FF5" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A8B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureProp && !secureVisible}
          {...rest}
        />
        {secureProp ? (
          <Pressable
            onPress={() => setSecureVisible((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={secureVisible ? 'Hide password' : 'Show password'}
          >
            <MaterialCommunityIcons
              name={secureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#B0B8C8"
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EAF2',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  fieldError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1C3D',
    height: '100%',
  },
  error: {
    marginTop: 6,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#EF4444',
  },
});
