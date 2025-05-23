import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = ({
  userLocation,
  driverLocation,
  pickupLocation,
  destinationLocation,
  showDirections = false,
  onRegionChange,
  markers = [],
  initialRegion = null,
  style = {},
  mapPadding = { top: 0, right: 0, bottom: 0, left: 0 },
  showsUserLocation = true,
  showsMyLocationButton = true,
  followsUserLocation = true,
}) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Calculate the initial region
  const getInitialRegion = () => {
    if (initialRegion) {
      return initialRegion;
    }

    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }

    // Default region (can be configured based on your app's needs)
    return {
      latitude: 37.78825,  // Default to San Francisco
      longitude: -122.4324,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  };

  // Fit the map to show all the important locations
  const fitToMarkers = () => {
    if (!mapRef.current || !mapReady) return;

    const points = [];

    if (userLocation) points.push(userLocation);
    if (driverLocation) points.push(driverLocation);
    if (pickupLocation) points.push(pickupLocation);
    if (destinationLocation) points.push(destinationLocation);

    // Add other markers
    markers.forEach(marker => {
      if (marker.coordinate) {
        points.push(marker.coordinate);
      }
    });

    if (points.length === 0) return;

    if (points.length === 1) {
      // If only one point, center the map around it
      mapRef.current.animateToRegion({
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } else {
      // If multiple points, fit the map to show all of them
      mapRef.current.fitToCoordinates(points, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  };

  // Fit to markers when locations change
  useEffect(() => {
    fitToMarkers();
  }, [userLocation, driverLocation, pickupLocation, destinationLocation, markers, mapReady]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={getInitialRegion()}
        onRegionChange={onRegionChange}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
        followsUserLocation={followsUserLocation}
        onMapReady={() => setMapReady(true)}
        mapPadding={mapPadding}
      >
        {/* Driver marker */}
        {driverLocation && (
          <Marker coordinate={driverLocation}>
            <View style={styles.driverMarker}>
              <Ionicons name="car" size={20} color={theme.colors.white} />
            </View>
          </Marker>
        )}

        {/* Pickup location marker */}
        {pickupLocation && (
          <Marker coordinate={pickupLocation}>
            <View style={styles.pickupMarker}>
              <Ionicons name="location" size={20} color={theme.colors.white} />
            </View>
          </Marker>
        )}

        {/* Destination marker */}
        {destinationLocation && (
          <Marker coordinate={destinationLocation}>
            <View style={styles.destinationMarker}>
              <Ionicons name="flag" size={20} color={theme.colors.white} />
            </View>
          </Marker>
        )}

        {/* Custom markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          >
            {marker.customMarker}
          </Marker>
        ))}

        {/* Directions between pickup and destination */}
        {showDirections && pickupLocation && destinationLocation && (
          <MapViewDirections
            origin={pickupLocation}
            destination={destinationLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor={theme.colors.primary}
            optimizeWaypoints={true}
            onReady={result => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 50,
                  right: 50,
                  bottom: 50,
                  left: 50,
                },
                animated: true,
              });
            }}
          />
        )}

        {/* Line between driver and pickup */}
        {driverLocation && pickupLocation && (
          <Polyline
            coordinates={[driverLocation, pickupLocation]}
            strokeColor={theme.colors.accent}
            strokeWidth={3}
            lineDashPattern={[1, 3]}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  pickupMarker: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  destinationMarker: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
});

export default Map;
