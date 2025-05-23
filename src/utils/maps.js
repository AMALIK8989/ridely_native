import { GOOGLE_MAPS_API_KEY } from '@env';

// Get place details using Google Places API
export const getPlaceDetails = async (placeId) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Error fetching place details: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error('Error in getPlaceDetails:', error);
    throw error;
  }
};

// Search for places using Google Places Autocomplete API
export const searchPlaces = async (query, location = null) => {
  try {
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&key=${GOOGLE_MAPS_API_KEY}`;

    // If location is provided, use it as a bias
    if (location) {
      url += `&location=${location.latitude},${location.longitude}&radius=50000`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Error searching places: ${data.status}`);
    }

    return data.predictions || [];
  } catch (error) {
    console.error('Error in searchPlaces:', error);
    throw error;
  }
};

// Get directions between two points
export const getDirections = async (origin, destination) => {
  try {
    const originString = `${origin.latitude},${origin.longitude}`;
    const destinationString = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Error fetching directions: ${data.status}`);
    }

    return {
      distance: data.routes[0].legs[0].distance,
      duration: data.routes[0].legs[0].duration,
      steps: data.routes[0].legs[0].steps,
      polyline: data.routes[0].overview_polyline,
    };
  } catch (error) {
    console.error('Error in getDirections:', error);
    throw error;
  }
};

// Calculate ETA based on distance and traffic
export const calculateETA = async (origin, destination) => {
  try {
    const directions = await getDirections(origin, destination);

    return {
      distance: directions.distance,
      duration: directions.duration,
      eta: new Date(Date.now() + directions.duration.value * 1000),
    };
  } catch (error) {
    console.error('Error in calculateETA:', error);
    throw error;
  }
};

// Calculate fare based on distance and time
export const calculateFare = (distance, duration, baseRate = 2.5, perKm = 1.5, perMinute = 0.35, surge = 1.0) => {
  const distanceInKm = distance.value / 1000;
  const durationInMinutes = duration.value / 60;

  const baseFare = baseRate;
  const distanceFare = distanceInKm * perKm;
  const timeFare = durationInMinutes * perMinute;

  // Calculate the total fare
  const totalFare = (baseFare + distanceFare + timeFare) * surge;

  return {
    baseFare,
    distanceFare,
    timeFare,
    totalFare: Math.round(totalFare * 100) / 100, // Round to 2 decimal places
    currency: 'USD',
  };
};
