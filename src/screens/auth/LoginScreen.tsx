import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@store/authStore';
import { validateEmail, validatePassword } from '@utils/validation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const { colors, fonts, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }

    setErrors({});
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#5B4FE9', '#7C6FF7']}
        style={[styles.gradient, { paddingTop: insets.top + spacing.xl }]}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <MaterialCommunityIcons name="check-bold" size={36} color="#FFFFFF" />
          </View>
          <Text style={[styles.logoText, { fontFamily: fonts.display }]}>TaskFlow</Text>
          <Text style={[styles.tagline, { fontFamily: fonts.body }]}>
            Get things done, beautifully.
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Animated.View
            entering={FadeInUp.duration(600).springify()}
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
                paddingBottom: insets.bottom + spacing.xl,
              },
            ]}
          >
            <Text
              style={[
                styles.welcomeText,
                { color: colors.textPrimary, fontFamily: fonts.heading },
              ]}
            >
              Welcome back
            </Text>
            <Text
              style={[
                styles.subtitleText,
                { color: colors.textSecondary, fontFamily: fonts.body },
              ]}
            >
              Sign in to continue
            </Text>

            <View style={styles.formFields}>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="email-outline"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                autoComplete="password"
                leftIcon="lock-outline"
              />

              <Button
                label="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B4FE9',
  },
  gradient: {
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
  },
  formWrapper: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formCard: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 22,
  },
  subtitleText: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 24,
  },
  formFields: {
    gap: 4,
  },
});
