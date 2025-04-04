# Tournaments Frontend

## Development Server

The application uses Expo for development. To start the development server:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan the QR code with your phone's camera to open in Expo Go app

The server will automatically reload when you make changes to the code.

## Mock Authentication Server

For development purposes, a mock authentication server is included. To start it:

```bash
cd mock-server
npm run dev
```

This will start a local server on port 3000 that provides mock authentication endpoints:
- POST `/auth/login` - Login with email and password
- POST `/auth/register` - Register a new user
- GET `/auth/me` - Get current user profile

### Mock Users

The server includes these mock users for testing:
- Email: `user@example.com`, Password: `password`
- Email: `admin@example.com`, Password: `admin123`

Future plans: If we don't have a backend, we could mock some data in the NodeJS server too.

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```
