# TaskFlow — Development Notes & Select AI Prompts

This file documents how TaskFlow was built. **Most of the app was written manually** — screens, navigation, theme, Firebase integration, offline caching, notifications, and EAS/APK setup were implemented by hand and iterated through normal development.

Cursor was used as a **coding assistant for a few targeted tasks** (boilerplate, repetitive patterns, and docs). The prompts below are the actual-style requests used for those parts. See `AI_USAGE.md` for the full disclosure.

---

## Built manually (no AI)

- App architecture: Zustand stores, navigation flow, folder structure
- All four screens: layout, styling, form validation, UX decisions
- Design system: colors, typography, spacing, dark mode tokens
- Firebase Auth, Google Sign-In, session persistence
- Offline task cache, pending mutation queue, NetInfo banner
- Local notifications (Profile toggle, daily reminder, task-added alert)
- EAS build profiles, `google-services.json`, OAuth SHA-1 setup
- Component APIs (`Button` variants, `Input` focus animation, priority segmented control)
- Git history, README, and submission packaging

---

## AI-assisted portions (targeted prompts)

### 1. Zustand store scaffold

Used once at the start to generate the initial store shape. Business logic and Firebase wiring were added manually afterward.

```
Create a Zustand store for auth in TypeScript with:
- user: { email, name } | null
- token: string | null
- isLoading: boolean
- login(email, password): Promise<void>
- logout(): Promise<void>
- restoreSession(): Promise<void>

Persist user + token to AsyncStorage on login, clear on logout.
Use strict types, no any.
```

### 2. Axios instance + interceptors

Asked for a starting pattern; token attachment and 401 logout were reviewed and adjusted to read from the Zustand store.

```
Set up an axios instance in src/services/api.ts with:
- baseURL for JSONPlaceholder todos API
- request interceptor that attaches Authorization Bearer token when present
- response interceptor: on 401 call logout from auth store
- typed ApiError for network failures with a user-readable message
```

### 3. Reanimated card entry animation

Used for the staggered list effect on TaskCard. Delay values and easing were tuned manually.

```
Add a Reanimated entry animation to TaskCard using FadeInDown:
- stagger delay based on list index (index * 60ms)
- spring on the completion checkbox scale (0.9 → 1 on toggle)
Match existing theme, no inline magic numbers outside animation config.
```

### 4. TypeScript interfaces

Quick generation for shared types; fields like `priority` and `createdAt` were added manually to match the assignment spec.

```
Define Task and User interfaces for a todo app:
Task: id, title, completed, userId, createdAt (ISO string), priority (low | medium | high)
Export from taskService.ts
```

### 5. Jest test boilerplate

Test cases and assertions were written manually; AI only helped with the initial `jest.setup.ts` mock structure for Firebase and AsyncStorage.

```
Add jest-expo setup mocks for:
- @react-native-async-storage/async-storage (in-memory store)
- firebase/auth (signIn, signOut, onAuthStateChanged)
- expo-notifications (getPermissionsAsync, scheduleNotificationAsync)

Keep mocks minimal so I can write store tests myself.
```

### 6. README sections (draft only)

Used to draft the Architecture Decisions and Known Limitations sections. Wording was rewritten to match what was actually shipped.

```
Draft two README sections for a React Native task app:
- Architecture Decisions: Zustand vs Redux, JSONPlaceholder trade-offs, modal Add Task, offline cache
- Known Limitations: no real backend persistence, mock auth fallback, Google Sign-In needs standalone APK

Tone: first-person developer, concise, honest.
```

---

## What was explicitly not AI-generated

- Login screen branding, gradient hero, social button row
- Task dashboard header, filter chips, FAB tab bar
- Add Task priority segmented control (custom Reanimated indicator)
- Profile stats row, inline logout confirmation, notification toggle
- `notificationService.ts` standalone vs Expo Go detection
- `app.config.js` plugins, `eas.json` profiles, `google-services.json` integration
- All bug fixes (Google `DEVELOPER_ERROR` SHA-1, notification hydration, etc.)

---

## Prompting approach

1. **Small, scoped asks** — one file or one pattern at a time, not a full-app prompt.
2. **Review everything** — generated code was read, tested on device/emulator, and often rewritten.
3. **Architecture first** — stores, navigation, and theme were decided before asking for boilerplate.
4. **Discard bad suggestions** — e.g. Alert-based logout was rejected in favor of inline confirmation UI.

---

## Submission checklist

- [x] App runs on Android (standalone APK)
- [x] Login + session persistence
- [x] Tasks: fetch, add, toggle, search, filter
- [x] Pull-to-refresh
- [x] Four screens functional
- [x] README with screenshots
- [x] AI_USAGE.md filled in
- [x] APK builds on EAS
- [ ] Demo video (3–5 min: Login → Dashboard → Add Task → Toggle → Profile → Logout)
