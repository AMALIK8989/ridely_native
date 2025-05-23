import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Create the context
export const LocationContext = createContext();

// Custom hook to use the location context
export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const { user, userRole } = useAuth();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLocationServiceEnabled, setIsLocationServiceEnabled] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  // Function to request location permissions
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return false;
      }

      const isEnabled = await Location.hasServicesEnabledAsync();
      setIsLocationServiceEnabled(isEnabled);

      if (!isEnabled) {
        setErrorMsg('Location services are disabled');
        return false;
      }

      return true;
    } catch (error) {
      setErrorMsg('Error requesting location permission');
      return false;
    }
  };

  // Function to get the current location
  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      setErrorMsg('Error getting current location');
      return null;
    }
  };

  // Function to start updating location in real-time (for drivers)
  const startLocationUpdates = async () => {
    if (userRole !== 'driver' || !user) return;

    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        return;
      }

      setIsUpdatingLocation(true);

      // Subscribe to location updates
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000, // Update every 5 seconds
        },
        async (newLocation) => {
          setLocation(newLocation);

          // Update driver location in Firestore
          await updateDoc(doc(db, 'drivers', user.uid), {
            location: {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              heading: newLocation.coords.heading,
              speed: newLocation.coords.speed,
              timestamp: new Date().toISOString(),
            },
            isOnline: true,
          });
        }
      );

      return locationSubscription;
    } catch (error) {
      setErrorMsg('Error starting location updates');
      setIsUpdatingLocation(false);
      return null;
    }
  };

  // Function to stop updating location
  const stopLocationUpdates = async (locationSubscription) => {
    if (locationSubscription) {
      locationSubscription.remove();
    }

    setIsUpdatingLocation(false);

    if (user && userRole === 'driver') {
      await updateDoc(doc(db, 'drivers', user.uid), {
        isOnline: false,
      });
    }
  };

  // Function to calculate the distance between two coordinates
  const calculateDistance = (coords1, coords2) => {
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      0.5 - Math.cos(dLat)/2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      (1 - Math.cos(dLon))/2;

    const distance = R * 2 * Math.asin(Math.sqrt(a));
    return distance; // Distance in km
  };

  // Value object to provide to the context
  const value = {
    location,
    errorMsg,
    isLocationServiceEnabled,
    isUpdatingLocation,
    locationPermission,
    requestLocationPermission,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates,
    calculateDistance,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
