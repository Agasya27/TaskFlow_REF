# TaskFlow

A polished task management app built with React Native and Expo for the KnockOnce React Native Developer Intern take-home assignment.

## Screenshots

_Screenshots to be added after final build._

## Features

- Email/password login with client-side validation and session persistence via AsyncStorage
- Task dashboard with pull-to-refresh, search, and filter (All / Pending / Completed)
- Add new tasks with title, priority selector, and optional notes
- Toggle task completion with optimistic UI updates and haptic feedback
- Profile screen with task stats, settings, and inline sign-out confirmation
- Offline-aware — shows a banner when disconnected, falls back to cached tasks, and syncs pending changes when back online
- Dark mode with persisted preference (toggle in Profile)
- Firebase Authentication (with mock auth fallback when Firebase is not configured)
- Skeleton loading states, animated card entries, and spring-based micro-interactions
- Global toast notification system (success / error / info)
- Error boundary for graceful crash recovery

## Tech Stack

| Category            | Library                                   | Version  |
| ------------------- | ----------------------------------------- | -------- |
| Framework           | React Native (Expo managed)               | 0.81     |
| Language            | TypeScript (strict)                       | 5.9      |
| Navigation          | React Navigation (Stack + Bottom Tabs)    | 7.x      |
| State Management    | Zustand                                   | 5.x      |
| HTTP                | Axios                                     | 1.x      |
| Storage             | AsyncStorage                              | 2.x      |
| Animations          | React Native Reanimated                   | 4.x      |
| Icons               | @expo/vector-icons (MaterialCommunityIcons)| —       |
| Date Formatting     | date-fns                                  | 4.x      |
| Fonts               | @expo-google-fonts/inter + expo-font      | —        |
| Haptics             | expo-haptics                              | —        |
| Network Info        | @react-native-community/netinfo           | 12.x     |
| Authentication      | Firebase Auth (optional)                  | 12.x     |
| Testing             | Jest + jest-expo                          | 54.x     |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio with an Android emulator (for APK testing)

### Setup

```bash
git clone https://github.com/Agasya27/TaskFlow_REF.git
cd TaskFlow_REF
npm install
cp .env.example .env   # optional — for Firebase Auth
npx expo start
```

### Firebase Authentication (optional)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** sign-in under Authentication → Sign-in method
3. Register a web app and copy the config values into `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Create a test user in Firebase → Authentication → Users
5. Restart Expo (`npx expo start`)

### Google Sign-In (optional)

1. In Firebase → **Authentication → Sign-in method** → enable **Google**
2. Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials) for your Firebase project
3. Copy the **Web client ID** and add OAuth clients for your platform:

| Platform | OAuth client type | Identifier |
|----------|-------------------|------------|
| Web | Already created by Firebase | — |
| iOS (Expo Go) | iOS | `host.exp.Exponent` |
| Android (dev APK) | Android | `com.agasya.taskflow` + EAS SHA-1 |

**Android note:** Google sign-in does **not** work in Expo Go on Android. Use a development APK (see below).

4. Add all IDs to `.env`:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=684498719028-xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=684498719028-yyyyy.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=684498719028-zzzzz.apps.googleusercontent.com
```

5. Restart Expo — the login screen shows **Continue with Google**

**iOS note:** `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` is required on iPhone/simulator. The web client ID alone is not enough.

Without `.env`, the app falls back to mock auth (any valid email + password ≥ 6 chars).

### Run Tests

```bash
npm test
```

Press `a` to open in Android emulator or scan the QR code with Expo Go.

### Standalone installable APK (for submission)

Use this build when reviewers install the app on their phone. **No dev server, no Metro, no laptop required** — the JavaScript bundle is packaged inside the APK.

```bash
npx eas login
npx eas env:push preview --path .env   # required if using Firebase / Google sign-in
npm run build:apk
```

When the build finishes, download the `.apk` from [expo.dev](https://expo.dev) → **@agasya27/taskflow** → latest Android build. Install it on any Android device (enable “Install unknown apps” if prompted) and open TaskFlow.

| Build command | Needs dev server? | Use case |
|---------------|-------------------|----------|
| `npm run build:apk` | **No** | Submission, sharing with reviewers |
| `npm run build:dev:android` | **Yes** (`npm run start:dev`) | Local development only |

### Google Sign-In on standalone APK

Google sign-in **does not work in Expo Go on Android**. It **does work** on the installable APK (`npm run build:apk`) when OAuth is configured for that APK’s signing certificate.

**1. Firebase Console** ([console.firebase.google.com](https://console.firebase.google.com))

- Authentication → Sign-in method → enable **Google**
- Project settings → **Add Android app** (if missing):
  - Package name: `com.agasya.taskflow`

**2. Get the APK signing SHA-1** (after at least one `preview` / `apk` EAS build)

```bash
npx eas credentials -p android
```

Select the **preview** (or default release) keystore and copy the **SHA-1** fingerprint.

**3. Register SHA-1 in two places**

| Where | What to add |
|-------|-------------|
| **Firebase** → Project settings → Your Android app | SHA-1 fingerprint |
| **Google Cloud** → APIs & Credentials → Create **Android** OAuth client | Package `com.agasya.taskflow` + same SHA-1 |

Keep the existing **Web client** from Firebase — its ID goes in `.env` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

**4. `.env` on your machine** (all `EXPO_PUBLIC_FIREBASE_*` + `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` filled in)

**5. Push env to EAS and build**

```bash
npx eas env:push preview --path .env
npm run build:apk
```

**6. Test on a real phone**

- Install the APK from [expo.dev](https://expo.dev) — **do not** run `npm run start:dev`
- Tap **Google** on the login screen → pick an account → you should reach the task dashboard

**If sign-in fails with `DEVELOPER_ERROR`:** the SHA-1 in Google Cloud does not match the APK you installed. Re-run `eas credentials`, update Google Cloud + Firebase, then rebuild.

### Build development APK (optional — for coding with Metro)

**1. Log in and link the project** (no global install — `eas-cli` is already in this repo)

```bash
npx eas login
npx eas init
```

**2. Push environment variables to EAS** (`.env` is not uploaded automatically)

```bash
npx eas env:push development --path .env
```

**3. Start the development build**

```bash
npm run build:dev:android
```

When the build finishes, download and install the APK on your device.

**4. Register the app with Google**

After the first build, get the Android signing certificate fingerprint:

```bash
npx eas credentials -p android
```

In [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials), create an **Android** OAuth client:

| Field | Value |
|-------|-------|
| Package name | `com.agasya.taskflow` |
| SHA-1 | From `eas credentials` |

Copy the new client ID into `.env` as `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, then push env vars and rebuild:

```bash
npx eas env:push development --path .env
npm run build:dev:android
```

**5. Run the dev client**

Install the APK, then start Metro for the dev client:

```bash
npm run start:dev
```

Open the app on your device (same Wi‑Fi as your computer) and tap **Continue with Google**.

### Build preview APK

Same standalone app as `npm run build:apk` (alias of the preview profile):

```bash
npm run build:preview:android
```

## Folder Structure

```
TaskFlow/
├── src/
│   ├── assets/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/              ← Button, Input, Badge, Card, Avatar, Skeleton, EmptyState, Toast
│   │   └── task/            ← TaskCard, TaskFilter, TaskSearchBar
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── tasks/
│   │   │   ├── TaskDashboard.tsx
│   │   │   └── AddTaskScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── services/
│   │   ├── api.ts           ← axios instance + interceptors
│   │   └── taskService.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── taskStore.ts
│   ├── theme/
│   │   └── index.ts
│   └── utils/
│       ├── validation.ts
│       ├── storage.ts
│       └── logger.ts
├── AI_USAGE.md
├── README.md
└── PROMPT.md
```

## Architecture Decisions

**Zustand over Redux.** For an app of this scope, Redux Toolkit would add ceremony without proportional benefit. Zustand's minimal API made it fast to set up stores for auth and tasks, and the `getState()` escape hatch worked well for the axios interceptor that needs the token outside of React.

**JSONPlaceholder as the backend.** The assignment calls for API integration skills, not backend engineering. JSONPlaceholder demonstrates GET / POST / PATCH patterns cleanly. The trade-off is that writes don't truly persist — the task store handles this by keeping local state authoritative after mutations.

**Modal-based Add Task screen.** Opening the form as a modal (instead of a separate tab or push screen) felt more natural for a quick-capture workflow. It also avoids cluttering the bottom tab bar with a full screen that's only used briefly.

**Offline-first caching.** Tasks are persisted to AsyncStorage on every fetch and mutation. When offline, changes are queued locally and synced automatically when connectivity returns. An unobtrusive banner communicates offline and sync status.

**Firebase with graceful fallback.** Firebase Auth is used when `EXPO_PUBLIC_FIREBASE_*` env vars are set. Otherwise mock auth preserves the original demo flow for evaluators without Firebase setup.

**Dark mode via theme context.** All screens read colors from `useTheme()`, so toggling light/dark mode updates the entire app without per-component changes.

## Known Limitations

- Task list is stored locally on device (welcome tasks on first install; not synced per Firebase user)
- JSONPlaceholder POST/PATCH are used for add/toggle when online, but the API does not persist data server-side
- Google Sign-In on Android requires the standalone APK with correct OAuth SHA-1 (does not work in Expo Go)
- Push notifications require the standalone APK (`npm run build:apk`); not supported in Expo Go
- Apple and Microsoft social login buttons are visual only
- Task notes on Add Task screen are not saved to the task model
- Search is client-side only
