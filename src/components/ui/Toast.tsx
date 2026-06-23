import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/index';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType>({
  show: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const counter = useRef(0);
  const translateY = useSharedValue(-100);
  const { colors, fonts, spacing, radius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const hide = useCallback(() => {
    setToast(null);
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      counter.current += 1;
      const id = counter.current;
      setToast({ id, message, variant });
      translateY.value = -100;
      translateY.value = withSequence(
        withSpring(0, { damping: 15, stiffness: 200 }),
        withDelay(
          3000,
          withTiming(-100, { duration: 300 }, (finished) => {
            if (finished) {
              runOnJS(hide)();
            }
          }),
        ),
      );
    },
    [translateY, hide],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const variantConfig: Record<
    ToastVariant,
    { bg: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; iconColor: string }
  > = {
    success: {
      bg: colors.successLight,
      icon: 'check-circle',
      iconColor: colors.success,
    },
    error: {
      bg: colors.dangerLight,
      icon: 'alert-circle',
      iconColor: colors.danger,
    },
    info: {
      bg: colors.primaryLight,
      icon: 'information',
      iconColor: colors.primary,
    },
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              top: insets.top + spacing.sm,
              backgroundColor: variantConfig[toast.variant].bg,
              borderRadius: radius.md,
              ...shadows.card,
            },
            animatedStyle,
          ]}
          pointerEvents="box-none"
        >
          <Pressable
            style={styles.toastContent}
            onPress={() => {
              translateY.value = withTiming(-100, { duration: 200 }, (finished) => {
                if (finished) runOnJS(hide)();
              });
            }}
          >
            <MaterialCommunityIcons
              name={variantConfig[toast.variant].icon}
              size={20}
              color={variantConfig[toast.variant].iconColor}
            />
            <Text
              style={[
                styles.toastText,
                { color: colors.textPrimary, fontFamily: fonts.label },
              ]}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
  },
});
