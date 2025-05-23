import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import HomeScreen from '../screens/user/HomeScreen';
import RideHistoryScreen from '../screens/user/RideHistoryScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import RideDetailsScreen from '../screens/user/RideDetailsScreen';
import RequestRideScreen from '../screens/user/RequestRideScreen';
import PaymentScreen from '../screens/user/PaymentScreen';
import DriverListScreen from '../screens/user/DriverListScreen';
import ScheduleRideScreen from '../screens/user/ScheduleRideScreen';

// Import theme
import theme from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="RequestRide" component={RequestRideScreen} />
    <Stack.Screen name="DriverList" component={DriverListScreen} />
    <Stack.Screen name="ScheduleRide" component={ScheduleRideScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

const RideHistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RideHistoryScreen" component={RideHistoryScreen} />
    <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

const UserNavigator = () => {
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
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rides') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Rides" component={RideHistoryStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default UserNavigator;
