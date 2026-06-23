import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@theme/index';
import { TaskDashboard } from '@screens/tasks/TaskDashboard';
import { ProfileScreen } from '@screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const TaskStack = createStackNavigator();

function TaskStackNavigator() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="TaskDashboard" component={TaskDashboard} />
    </TaskStack.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    Tasks: 'home-variant',
    AddTab: 'plus-circle',
    Profile: 'account',
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
          paddingBottom: insets.bottom || spacing.sm,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName = icons[route.name] ?? 'circle';

        const onPress = () => {
          if (route.name === 'AddTab') {
            navigation.getParent()?.navigate('AddTaskModal' as never);
            return;
          }
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.tabItem}
            hitSlop={8}
          >
            {isFocused && route.name !== 'AddTab' && (
              <View
                style={[styles.activeIndicator, { backgroundColor: colors.primary }]}
              />
            )}
            <MaterialCommunityIcons
              name={iconName}
              size={route.name === 'AddTab' ? 32 : 24}
              color={
                route.name === 'AddTab'
                  ? colors.primary
                  : isFocused
                    ? colors.primary
                    : colors.textDisabled
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Tasks" component={TaskStackNavigator} />
    <Tab.Screen
      name="AddTab"
      component={PlaceholderScreen}
      listeners={{ tabPress: (e) => e.preventDefault() }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

function PlaceholderScreen() {
  return null;
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});
