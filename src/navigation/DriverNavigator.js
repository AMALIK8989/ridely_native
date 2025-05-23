import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import RideRequestsScreen from '../screens/driver/RideRequestsScreen';
import DriverRideDetailsScreen from '../screens/driver/DriverRideDetailsScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import NavigationScreen from '../screens/driver/NavigationScreen';

// Import theme
import theme from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DriverHomeScreen" component={DriverHomeScreen} />
    <Stack.Screen name="RideRequest" component={RideRequestsScreen} />
    <Stack.Screen name="DriverRideDetails" component={DriverRideDetailsScreen} />
    <Stack.Screen name="Navigation" component={NavigationScreen} />
  </Stack.Navigator>
);

const EarningsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DriverProfileScreen" component={DriverProfileScreen} />
  </Stack.Navigator>
);

const DriverNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.lightGray,
          ...theme.shadows.small,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Earnings" component={EarningsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
