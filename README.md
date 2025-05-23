# Ridely - Uber-like App

Ridely is a modern ride-sharing application built with React Native and Expo, designed to work on both iOS and Android platforms. The app features separate dashboards for users (riders) and drivers, real-time location tracking, and seamless ride management.

## Features

### User (Rider) Features
- User authentication and profile management
- Real-time location tracking
- Request rides with pickup and destination selection
- Choose available drivers
- Schedule rides for later
- View ride history
- Real-time ride status updates
- Payment integration (coming soon)

### Driver Features
- Driver authentication and profile management
- Toggle availability status
- Accept or reject ride requests
- Navigation to pickup and destination
- Complete rides and view earnings
- Track ride history

## Technology Stack

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation
- **Maps & Location**: Google Maps API, Expo Location
- **Authentication & Database**: Firebase Authentication, Firestore
- **State Management**: React Context API
- **Real-time Updates**: Firebase Realtime Database

## Getting Started

### Prerequisites
- Node.js
- npm or Yarn
- Expo CLI
- Android Studio (for Android development)
- Expo Go app (for iOS testing without a Mac)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AMALIK8989/ridely_native.git
cd ridely
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and add your API keys:
```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Run on device or emulator:
```bash
npm run android
# or
npm run ios # (Mac only)
# or use Expo Go app on your device
```

## Project Structure

```
ridely/
├── src/
│   ├── components/         # Reusable UI components
│   ├── config/             # Configuration files
│   ├── context/            # React Context for state management
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # App screens
│   │   ├── auth/           # Authentication screens
│   │   ├── user/           # Rider screens
│   │   └── driver/         # Driver screens
│   ├── services/           # API and service functions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
├── app.json                # Expo configuration
└── App.js                  # App entry point
```

## Future Enhancements

- Multi-language support
- In-app chat between driver and rider
- Ride sharing options
- Advanced analytics for drivers
- Loyalty program for frequent users
- Enhanced payment options

## License

[MIT License](LICENSE)

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [Google Maps API](https://developers.google.com/maps)
