import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';

// Import navigators
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import DriverNavigator from './DriverNavigator';

// Import firebase auth
import { auth } from '../config/firebase';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        // Get user role from AsyncStorage
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show loading screen or splash screen
    // For now, we'll just return null
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is signed in
          userRole === 'driver' ? (
            // Driver role
            <Stack.Screen name="DriverApp" component={DriverNavigator} />
          ) : (
            // User/Rider role
            <Stack.Screen name="UserApp" component={UserNavigator} />
          )
        ) : (
          // User is not signed in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
