import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Create the context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userAuth.uid));
        let role = 'user'; // Default role

        if (userDoc.exists()) {
          role = userDoc.data().role || 'user';
          // Save the role to AsyncStorage
          await AsyncStorage.setItem('userRole', role);
        }

        setUser(userAuth);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
        await AsyncStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName, role = 'user') => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
      });

      // Save the role to AsyncStorage
      await AsyncStorage.setItem('userRole', role);
      setUserRole(role);

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let role = 'user'; // Default role

      if (userDoc.exists()) {
        role = userDoc.data().role || 'user';
        // Save the role to AsyncStorage
        await AsyncStorage.setItem('userRole', role);
      }

      setUserRole(role);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userRole');
      setUserRole(null);
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Update user role
  const updateUserRole = async (uid, role) => {
    try {
      await setDoc(doc(db, 'users', uid), { role }, { merge: true });
      await AsyncStorage.setItem('userRole', role);
      setUserRole(role);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
