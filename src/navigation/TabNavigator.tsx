import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@theme/index';
import { TaskDashboard } from '@screens/tasks/TaskDashboard';
import { ProfileScreen } from '@screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const TaskStack = createStackNavigator();

const TAB_LABELS: Record<string, string> = {
  Tasks: 'Home',
  AddTab: 'Add Task',
  Profile: 'Profile',
};

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Tasks: 'home-variant',
  AddTab: 'plus',
  Profile: 'account',
};

function TaskStackNavigator() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="TaskDashboard" component={TaskDashboard} />
    </TaskStack.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, spacing, radius, gradients } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.navBackground,
          borderTopColor: colors.divider,
          paddingBottom: insets.bottom || spacing.sm,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isAdd = route.name === 'AddTab';
        const iconName = TAB_ICONS[route.name] ?? 'circle';
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          if (isAdd) {
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
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.tabItem}
            hitSlop={8}
          >
            {isFocused && !isAdd ? (
              <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />
            ) : (
              <View style={styles.activeBarPlaceholder} />
            )}

            {isAdd ? (
              <LinearGradient
                colors={[...gradients.primary]}
                style={[styles.addButton, { borderRadius: radius.full }]}
              >
                <MaterialCommunityIcons name={iconName} size={22} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={isFocused ? colors.primary : colors.textDisabled}
              />
            )}

            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? colors.primary : colors.textDisabled,
                  fontFamily: 'Inter_500Medium',
                },
              ]}
            >
              {label}
            </Text>
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
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  activeBar: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginBottom: 2,
  },
  activeBarPlaceholder: {
    height: 5,
  },
  addButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
  },
  label: {
    fontSize: 11,
  },
});
