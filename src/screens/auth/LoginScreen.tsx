import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RibbonBrandHeader } from '@components/ui/RibbonBrandHeader';
import { LoginDecorations } from '@components/ui/LoginDecorations';
import { AuthField } from '@components/ui/AuthField';
import { AuthPrimaryButton } from '@components/ui/AuthPrimaryButton';
import { SocialButton } from '@components/ui/SocialButton';
import { useAuthStore } from '@store/authStore';
import { validateEmail, validatePassword } from '@utils/validation';
import { useGoogleSignIn, isAndroidExpoGo } from '@hooks/useGoogleSignIn';
import { isFirebaseConfigured } from '@config/firebase';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { login, register, loginWithGoogle, resetPassword, isAuthenticating, error, clearError } =
    useAuthStore();
  const showGoogleSignIn = isFirebaseConfigured();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    const passwordError = mode === 'forgot' ? null : validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }

    setErrors({});
    setGoogleError(null);
    setResetSuccess(false);
    clearError();
    try {
      if (mode === 'register') {
        await register(email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSuccess(true);
      } else {
        await login(email, password);
      }
    } catch {
      // Error surfaced via authStore.error
    }
  };

  const openForgotPassword = () => {
    clearError();
    setGoogleError(null);
    setErrors({});
    setResetSuccess(false);
    setMode('forgot');
  };

  const backToLogin = () => {
    clearError();
    setGoogleError(null);
    setErrors({});
    setResetSuccess(false);
    setMode('login');
  };

  const toggleMode = () => {
    clearError();
    setGoogleError(null);
    setErrors({});
    setResetSuccess(false);
    setMode((current) => (current === 'login' ? 'register' : 'login'));
  };

  const handleGoogleSuccess = useCallback(
    async (idToken: string) => {
      try {
        await loginWithGoogle(idToken);
        setGoogleError(null);
      } catch {
        // authStore.error is set inside loginWithGoogle
      }
    },
    [loginWithGoogle],
  );

  const handleGoogleError = useCallback((message: string) => {
    useAuthStore.setState({ isAuthenticating: false });
    setGoogleError(message);
  }, []);

  const { signIn: signInWithGoogle } = useGoogleSignIn(
    handleGoogleSuccess,
    handleGoogleError,
  );

  const handleGoogleSignIn = async () => {
    clearError();
    setGoogleError(null);
    useAuthStore.setState({ isAuthenticating: true });
    await signInWithGoogle();
  };

  const showAndroidExpoGoNote = isAndroidExpoGo();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LoginDecorations />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 18,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RibbonBrandHeader />

          <View style={styles.form}>
            <Text style={styles.title}>
              {mode === 'login'
                ? 'Welcome back'
                : mode === 'register'
                  ? 'Create account'
                  : 'Reset password'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in to continue'
                : mode === 'register'
                  ? 'Sign up to get started'
                  : "Enter your email and we'll send you a reset link"}
            </Text>

            <AuthField
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="email-outline"
            />

            {mode !== 'forgot' ? (
              <AuthField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                autoComplete={mode === 'register' ? 'password-new' : 'password'}
                leftIcon="lock-outline"
              />
            ) : null}

            {mode === 'login' ? (
              <View style={styles.optionsRow}>
                <Pressable
                  style={styles.rememberRow}
                  onPress={() => setRememberMe((v) => !v)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberMe }}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxOn]}>
                    {rememberMe ? (
                      <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </Pressable>
                {showGoogleSignIn ? (
                  <Pressable onPress={openForgotPassword} accessibilityRole="button">
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                ) : (
                  <View />
                )}
              </View>
            ) : null}

            <AuthPrimaryButton
              label={
                mode === 'login'
                  ? 'Sign in'
                  : mode === 'register'
                    ? 'Create account'
                    : 'Send reset link'
              }
              onPress={handleSubmit}
              loading={isAuthenticating}
            />

            {resetSuccess ? (
              <Text style={styles.successText}>
                Check your inbox for a password reset link. It may take a minute to arrive.
              </Text>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {showGoogleSignIn && mode !== 'forgot' ? (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                  <SocialButton
                    icon="google"
                    onPress={handleGoogleSignIn}
                    loading={isAuthenticating}
                  />
                  <SocialButton icon="apple" onPress={() => {}} disabled />
                  <SocialButton icon="microsoft" onPress={() => {}} disabled />
                </View>

                {googleError ? <Text style={styles.errorText}>{googleError}</Text> : null}
                {showAndroidExpoGoNote ? (
                  <Text style={styles.noteText}>
                    Google sign-in requires a development build on Android.
                  </Text>
                ) : null}
              </>
            ) : null}

            {mode === 'forgot' ? (
              <Pressable onPress={backToLogin} style={styles.footer} accessibilityRole="button">
                <Text style={styles.footerText}>
                  <Text style={styles.footerLink}>Back to sign in</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={toggleMode} style={styles.footer} accessibilityRole="button">
                <Text style={styles.footerText}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <Text style={styles.footerLink}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </Text>
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  form: {
    marginTop: 28,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: '#1A1C3D',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 22,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 2,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D5DBE8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxOn: {
    backgroundColor: '#4A5CFE',
    borderColor: '#4A5CFE',
  },
  rememberText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#5C6478',
  },
  forgotText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#7B61FF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E8F0',
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#8E8E93',
    paddingHorizontal: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
  },
  successText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#16A34A',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  noteText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
    paddingBottom: 8,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  footerLink: {
    fontFamily: 'Inter_600SemiBold',
    color: '#7B61FF',
  },
});
