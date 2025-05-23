import React, { createContext, useState, useContext } from 'react';
import { collection, addDoc, updateDoc, getDoc, getDocs, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

// Create the context
export const RideContext = createContext();

// Custom hook to use the ride context
export const useRide = () => {
  return useContext(RideContext);
};

export const RideProvider = ({ children }) => {
  const { user, userRole } = useAuth();
  const [currentRide, setCurrentRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request a new ride
  const requestRide = async (rideData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const newRide = {
        userId: user.uid,
        userDisplayName: user.displayName,
        userEmail: user.email,
        driverId: rideData.driverId || null,
        status: 'pending', // pending, accepted, in_progress, completed, cancelled
        pickup: rideData.pickup,
        destination: rideData.destination,
        fare: rideData.fare,
        distance: rideData.distance,
        duration: rideData.duration,
        scheduledFor: rideData.scheduledFor || null,
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const rideRef = await addDoc(collection(db, 'rides'), newRide);
      const ride = { id: rideRef.id, ...newRide };

      setCurrentRide(ride);
      setLoading(false);
      return ride;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Accept a ride (for drivers)
  const acceptRide = async (rideId) => {
    if (!user || userRole !== 'driver') return;

    try {
      setLoading(true);
      setError(null);

      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        throw new Error('Ride not found');
      }

      const rideData = rideSnap.data();

      if (rideData.status !== 'pending') {
        throw new Error(`Ride cannot be accepted. Current status: ${rideData.status}`);
      }

      await updateDoc(rideRef, {
        driverId: user.uid,
        driverDisplayName: user.displayName,
        driverEmail: user.email,
        status: 'accepted',
        updatedAt: new Date().toISOString(),
      });

      const updatedRide = {
        id: rideId,
        ...rideData,
        driverId: user.uid,
        driverDisplayName: user.displayName,
        driverEmail: user.email,
        status: 'accepted',
        updatedAt: new Date().toISOString(),
      };

      setCurrentRide(updatedRide);
      setLoading(false);
      return updatedRide;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Start a ride (for drivers)
  const startRide = async (rideId) => {
    if (!user || userRole !== 'driver') return;

    try {
      setLoading(true);
      setError(null);

      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        throw new Error('Ride not found');
      }

      const rideData = rideSnap.data();

      if (rideData.status !== 'accepted') {
        throw new Error(`Ride cannot be started. Current status: ${rideData.status}`);
      }

      if (rideData.driverId !== user.uid) {
        throw new Error('You are not the assigned driver for this ride');
      }

      await updateDoc(rideRef, {
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const updatedRide = {
        id: rideId,
        ...rideData,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentRide(updatedRide);
      setLoading(false);
      return updatedRide;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Complete a ride (for drivers)
  const completeRide = async (rideId) => {
    if (!user || userRole !== 'driver') return;

    try {
      setLoading(true);
      setError(null);

      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        throw new Error('Ride not found');
      }

      const rideData = rideSnap.data();

      if (rideData.status !== 'in_progress') {
        throw new Error(`Ride cannot be completed. Current status: ${rideData.status}`);
      }

      if (rideData.driverId !== user.uid) {
        throw new Error('You are not the assigned driver for this ride');
      }

      await updateDoc(rideRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const updatedRide = {
        id: rideId,
        ...rideData,
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentRide(null);
      setLoading(false);
      return updatedRide;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Cancel a ride (for users or drivers)
  const cancelRide = async (rideId, reason) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        throw new Error('Ride not found');
      }

      const rideData = rideSnap.data();

      if (['completed', 'cancelled'].includes(rideData.status)) {
        throw new Error(`Ride cannot be cancelled. Current status: ${rideData.status}`);
      }

      // Check if the user is either the passenger or the driver
      if (rideData.userId !== user.uid && rideData.driverId !== user.uid) {
        throw new Error('You are not authorized to cancel this ride');
      }

      const cancelledBy = rideData.userId === user.uid ? 'user' : 'driver';

      await updateDoc(rideRef, {
        status: 'cancelled',
        cancelledBy,
        cancellationReason: reason || 'No reason provided',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const updatedRide = {
        id: rideId,
        ...rideData,
        status: 'cancelled',
        cancelledBy,
        cancellationReason: reason || 'No reason provided',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentRide(null);
      setLoading(false);
      return updatedRide;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Get ride history for the current user
  const getRideHistory = async () => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);

      let q;

      if (userRole === 'driver') {
        q = query(
          collection(db, 'rides'),
          where('driverId', '==', user.uid),
          orderBy('requestedAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'rides'),
          where('userId', '==', user.uid),
          orderBy('requestedAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const rides = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRideHistory(rides);
      setLoading(false);
      return rides;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Get a specific ride by ID
  const getRideById = async (rideId) => {
    try {
      setLoading(true);
      setError(null);

      const rideRef = doc(db, 'rides', rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        throw new Error('Ride not found');
      }

      const ride = {
        id: rideId,
        ...rideSnap.data(),
      };

      setLoading(false);
      return ride;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Get available drivers near a location
  const getAvailableDrivers = async (location, radius = 5) => {
    try {
      setLoading(true);
      setError(null);

      const driversRef = collection(db, 'drivers');
      const driversSnap = await getDocs(driversRef);

      const drivers = driversSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(driver => driver.isOnline && driver.location);

      // Calculate distance to each driver
      const driversWithDistance = drivers.map(driver => {
        const distance = calculateDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: driver.location.latitude, longitude: driver.location.longitude }
        );

        return {
          ...driver,
          distance,
        };
      });

      // Filter drivers within the radius
      const availableDrivers = driversWithDistance
        .filter(driver => driver.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setLoading(false);
      return availableDrivers;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Helper function to calculate distance between two coordinates
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
    currentRide,
    rideHistory,
    loading,
    error,
    requestRide,
    acceptRide,
    startRide,
    completeRide,
    cancelRide,
    getRideHistory,
    getRideById,
    getAvailableDrivers,
  };

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  );
};

export default RideProvider;
