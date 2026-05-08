# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Expo dev server (prompts platform choice)
npm run web        # Launch in browser
npm run android    # Launch in Android emulator
npm run ios        # Launch in iOS simulator
npm test           # Run Jest in watch mode
npm run lint       # Run Expo lint
npm run router-types  # Regenerate TypeScript types for Expo Router
```

To run a single test file: `npx jest path/to/test.test.ts`

### Mock auth server (local dev)

```bash
cd mock-server && node server.js   # Starts on port 3000
```

Pre-configured mock users: `user@example.com` and `admin@example.com` (see README for passwords).

## Architecture

This is a **React Native / Expo** sports tournament management app (Android, iOS, web) using file-based routing via Expo Router.

### Route layout

```
src/app/
  _layout.tsx            # Root layout — fonts, auth gate, Redux Provider
  (auth)/                # Public: /login, /register
  (app)/                 # Protected: bottom tab navigator
    home/                # Leagues list, create league, league details, applications
    teams/               # Teams list, create team, team details, invites
    settings/            # Language, privacy policy, user settings
```

`ProtectedRoute` in the root layout redirects unauthenticated users to `(auth)`.

### State management

Two layers:

- **AuthContext** (`contexts/AuthContext.tsx`) — JWT tokens, current user, login/logout. Tokens are persisted in `expo-secure-store`. A 401 triggers one automatic token refresh, then broadcasts a logout event via `DeviceEventEmitter`.
- **Redux Toolkit** (`store/`) — server data split into feature slices: `leagues`, `teams`, `games`, `gameStats`, `teamInvites`, `players`, `applications`.

### API layer

All HTTP calls go through `httpRequest<T>()` in `services/tournaments.service.ts`. It:
- Reads the Bearer token from secure storage on each call
- Retries once on 401 after refreshing the token
- Throws a typed `HttpError` (with `status` and `ErrorDetails`) on failure

Image uploads use S3 presigned URLs fetched from the API, then a direct PUT to S3.

The API base URL comes from the env var `EXPO_PUBLIC_API_URL` (set in `.env`).

### i18n

`i18next` with EN/ES support. Translation files live in `locales/{en,es}/{namespace}.json`. Namespaces: `errors`, `login`, `register`, `home`, `common`, `settings`, `teams`. Use the `useTranslation(namespace)` hook in components.

### Path aliases

`@/*` resolves to the repo root (configured in `tsconfig.json`), so imports like `@/components/Foo` work everywhere.

### Key conventions

- Forms use **React Hook Form** (`react-hook-form`).
- The `ImageFetcher` component handles image loading with a fallback default image.
- Swipeable list rows (e.g., team invites) use `react-native-swipe-list-view`.
- Date formatting uses `date-fns`.
