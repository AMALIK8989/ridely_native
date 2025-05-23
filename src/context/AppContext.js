import React from 'react';
import AuthProvider from './AuthContext';
import LocationProvider from './LocationContext';
import RideProvider from './RideContext';

const AppContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LocationProvider>
        <RideProvider>
          {children}
        </RideProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default AppContextProvider;
