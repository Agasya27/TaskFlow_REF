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
- Offline-aware — shows a banner when disconnected and falls back to cached tasks
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

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio with an Android emulator (for APK testing)

### Setup

```bash
git clone https://github.com/Agasya27/TaskFlow.git
cd TaskFlow
npm install
npx expo start
```

Press `a` to open in Android emulator or scan the QR code with Expo Go.

### Build APK

```bash
npx eas build -p android --profile preview
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

**Offline-first caching.** Tasks are persisted to AsyncStorage on every successful fetch. When the network drops, the store falls back to the cache and shows an unobtrusive banner, so the user can still browse their tasks.

## Known Limitations

- No real backend — the JWT is simulated and JSONPlaceholder doesn't persist writes
- Task toggle is optimistic only; reverts silently on API failure
- No dark mode (could be added via theme context)
- No push notifications or Firebase integration
- No unit tests in this version
- Search is client-side only (no server-side search)
