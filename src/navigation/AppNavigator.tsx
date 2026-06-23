import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@theme/index';
import { useAuthStore } from '@store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { AddTaskScreen } from '@screens/tasks/AddTaskScreen';

const RootStack = createStackNavigator();

function SplashScreen() {
  const { colors, fonts } = useTheme();
  return (
    <View style={[styles.splash, { backgroundColor: colors.primary }]}>
      <Text style={[styles.splashText, { fontFamily: fonts.display }]}>
        TaskFlow
      </Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 16 }} />
    </View>
  );
}

export const AppNavigator: React.FC = () => {
  const { user, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen
              name="AddTaskModal"
              component={AddTaskScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 36,
    color: '#FFFFFF',
  },
});
