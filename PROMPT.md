# TaskFlow — Cursor Master Build Prompt

> Paste this entire file as your first message in a new Cursor Composer session.
> Work through each section **in order**, push to https://github.com/Agasya27/TaskFlow.git after each section completes, then move to the next.

---

## Who You Are Building For

You are a senior React Native developer building a production-grade mobile app called **TaskFlow** for a technical internship assignment at KnockOnce. The app must feel premium — polished animations, thoughtful UI decisions, zero placeholder UX — like something shipped by a small but serious product team.

---

## Tech Stack (Non-Negotiable)

- **React Native** with **TypeScript** (strict mode)
- **React Navigation v6** — Stack + Bottom Tabs
- **Zustand** for state management
- **Axios** for HTTP
- **AsyncStorage** for session persistence
- **JSONPlaceholder** as the backend (https://jsonplaceholder.typicode.com/todos)
- **React Native Reanimated 3** for animations
- **React Native Vector Icons** (MaterialCommunityIcons)
- **date-fns** for any date formatting

---

## Design System (Apply Globally, Before Writing Any Screen)

Define a `src/theme/index.ts` file with the complete design token system before building any screen. Every color, spacing, font size, and radius must come from this file — no hardcoded values anywhere else.

### Color Palette

```ts
colors: {
  // Primary
  primary: '#5B4FE9',       // deep indigo — CTAs, active states
  primaryLight: '#EAE8FD',  // soft lavender — backgrounds, chips
  primaryDark: '#3D33C4',   // pressed/hover state

  // Surface
  background: '#F7F8FC',    // near-white page background
  surface: '#FFFFFF',       // cards, modals
  surfaceAlt: '#F0F1F7',    // subtle input backgrounds

  // Text
  textPrimary: '#16172B',   // headings
  textSecondary: '#6B6E8A', // subtext, placeholders
  textDisabled: '#B0B3C6',

  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  // Neutral
  border: '#E4E5EF',
  divider: '#ECEDF5',
  shadow: 'rgba(91, 79, 233, 0.12)',
}
```

### Typography

```ts
fonts: {
  display: 'Inter-Bold',       // 28-32px — screen titles
  heading: 'Inter-SemiBold',   // 18-22px — section headers
  body: 'Inter-Regular',       // 14-16px — body text
  label: 'Inter-Medium',       // 12-14px — labels, chips, tags
  mono: 'SpaceMono-Regular',   // task IDs, metadata
}
```

Use **Inter** (system fallback: SF Pro / Roboto) with proper font loading via `expo-font` or `react-native-fonts`.

### Spacing Scale

```ts
spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }
```

### Border Radius

```ts
radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 }
```

### Shadows

```ts
shadows: {
  card: {
    shadowColor: '#5B4FE9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  }
}
```

---

## Folder Structure (Exact)

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
│       └── storage.ts
├── AI_USAGE.md
├── README.md
└── PROMPT.md
```

---

## Section 1 — Project Scaffold & Theme

**Push commit: `init: project scaffold and design system`**

1. Initialize a new React Native project with TypeScript template (Expo managed or bare — pick the one that gives cleanest APK builds).
2. Install all dependencies listed in the tech stack section.
3. Create `src/theme/index.ts` with the full token system above.
4. Create a `ThemeProvider` context that exposes the theme object via a `useTheme()` hook.
5. Set up folder structure exactly as specified.
6. Configure `tsconfig.json` with path aliases: `@components`, `@screens`, `@store`, `@services`, `@utils`, `@theme`.
7. Set app name to "TaskFlow", bundle ID to `com.agasya.taskflow`.
8. Configure `babel.config.js` with module resolver for the above aliases.
9. Set up ESLint + Prettier with sensible rules.
10. Create an empty `README.md` and `AI_USAGE.md` (will be filled later).

Push to GitHub. Verify the project builds and runs on Android emulator before moving on.

---

## Section 2 — Reusable UI Component Library

**Push commit: `feat: ui component library`**

Build the following components in `src/components/ui/`. Each must use the theme system, accept standard React Native props via extension, and be properly typed with TypeScript interfaces.

### `Button.tsx`
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- Props: `onPress`, `label`, `loading` (shows spinner), `disabled`, `leftIcon`, `rightIcon`, `fullWidth`
- Animated press scale using Reanimated: scale to 0.96 on press, spring back on release
- Loading state shows an `ActivityIndicator` inside, disables interaction

### `Input.tsx`
- Props: `label`, `placeholder`, `value`, `onChangeText`, `error`, `secureTextEntry`, `leftIcon`, `rightIcon`, `hint`
- Animated border color transition on focus (primary color) using Reanimated
- Error state: red border + error message below
- `secureTextEntry` toggle eye icon built in

### `Badge.tsx`
- Variants: `success`, `warning`, `danger`, `neutral`, `primary`
- Props: `label`, `size` (`sm` | `md`)
- Pill-shaped, uses `primaryLight` / `successLight` etc. as background

### `Card.tsx`
- Wraps children with surface background, card shadow, and `radius.md`
- Props: `onPress` (optional — makes it pressable with ripple), `style`

### `Avatar.tsx`
- Circular avatar with initials fallback (colored background from a deterministic hash of the name)
- Props: `name`, `size`, `imageUri` (optional)

### `Skeleton.tsx`
- Animated shimmer effect (pulsing opacity via Reanimated loop)
- Props: `width`, `height`, `borderRadius`
- Export `TaskCardSkeleton` — a composed skeleton matching the TaskCard layout

### `EmptyState.tsx`
- Props: `icon` (MaterialCommunityIcons name), `title`, `subtitle`, `action` (label + onPress)
- Centered layout, icon at top, muted colors

### `Toast.tsx`
- Slides in from top with Reanimated spring
- Variants: `success`, `error`, `info`
- Auto-dismisses after 3s
- Expose via a `useToast()` hook + `ToastProvider`

---

## Section 3 — Authentication

**Push commit: `feat: auth flow with session persistence`**

### Auth Store (`src/store/authStore.ts`)

Use Zustand. Store:
```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}
```

- `login`: validate credentials against a hardcoded mock (email: any valid email format, password: min 6 chars). Generate a fake JWT string (`btoa(email + Date.now())`), persist both user object and token to AsyncStorage under keys `@taskflow/user` and `@taskflow/token`.
- `restoreSession`: called on app launch — reads AsyncStorage and rehydrates state.
- `logout`: clears AsyncStorage, resets state.

### Login Screen (`src/screens/auth/LoginScreen.tsx`)

Layout:
- Top 35%: indigo gradient background (`#5B4FE9` → `#7C6FF7`) with the app logo mark (a stylized checkmark or lightning bolt — design it as an SVG or use a vector icon) and the word "TaskFlow" in display font, white.
- Bottom 65%: white surface card that overlaps the gradient slightly (top border radius `xl`), containing the form.

Form:
- Email input with validation (must be valid email format)
- Password input with show/hide toggle
- "Sign In" Button (full width, primary variant)
- Inline field-level error messages (no alert dialogs)
- Keyboard-aware scroll — inputs scroll up when keyboard opens
- Disable button and show loading spinner while login is in progress

Animations:
- Form card slides up with a spring animation on mount
- Input labels animate up (floating label style) when focused

Do NOT use placeholder credentials shown visibly. The validation logic is in `src/utils/validation.ts`.

---

## Section 4 — Task Dashboard

**Push commit: `feat: task dashboard`**

### Task Service (`src/services/taskService.ts`)

```ts
// GET all tasks — map JSONPlaceholder /todos to Task shape
// POST new task — POST to /todos
// PATCH task status — PATCH to /todos/:id
```

Map the JSONPlaceholder response to this interface:
```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string; // use current date for new tasks
  priority: 'low' | 'medium' | 'high'; // randomly assign for fetched, user-chosen for new
}
```

### Task Store (`src/store/taskStore.ts`)

```ts
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
  searchQuery: string;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  setFilter: (filter: TaskState['filter']) => void;
  setSearch: (query: string) => void;
}
```

Derived selector: `filteredTasks` — applies both `filter` and `searchQuery` to `tasks`.

### TaskCard (`src/components/task/TaskCard.tsx`)

- Shows: task title (truncated at 2 lines), priority badge, completion checkbox (animated checkmark using Reanimated), created date in `MMM d` format.
- Completed tasks: title has a strikethrough, card background is slightly muted (`surfaceAlt`).
- Press on checkbox calls `toggleTask` with an optimistic UI update.
- Swipe-left gesture hint (subtle chevron) — no need to implement swipe actions, just the visual affordance.
- Entry animation: each card fades in + slides up with a staggered delay based on index (use Reanimated `FadeInDown` with `delay(index * 60)`).

### TaskDashboard Screen

Layout:
- Sticky header: App name "TaskFlow" left, user Avatar right (taps to Profile).
- Search bar below header (rounded, subtle background, magnifier icon).
- Filter chips row: "All", "Pending", "Completed" — pill chips, active chip uses primary color.
- Task count summary: e.g. "12 tasks · 4 completed" in muted text.
- FlatList of TaskCards with pull-to-refresh.
- Loading state: show 5× `TaskCardSkeleton` components.
- Empty state (per filter): appropriate icon + message + CTA if applicable.
- FAB (Floating Action Button) bottom-right: "+" icon, primary color, opens AddTask screen.

Performance:
- Use `useCallback` on renderItem.
- Use `keyExtractor` with task id.
- Set `initialNumToRender={10}` and `maxToRenderPerBatch={10}`.

---

## Section 5 — Add Task Screen

**Push commit: `feat: add task screen`**

Open as a modal sheet (slides up from bottom, `presentation: 'modal'` in navigation options).

Form fields:
- **Title** — required, min 3 chars, max 100 chars
- **Priority** — segmented control with three options: Low, Medium, High (custom segmented control component using Reanimated animated indicator)
- **Notes** — optional, multiline, max 300 chars, character counter shown

Behavior:
- All validation runs on submit, not on blur (cleaner UX).
- On success: dismiss modal, show success toast ("Task added"), scroll FlatList to top.
- On API error: show error toast, keep form open with data intact.
- "Cancel" button top-left dismisses with no action.
- Submit button top-right labeled "Add" (disabled while loading).

The priority segmented control:
- Three segments in a pill-shaped container (surfaceAlt background)
- Animated white pill indicator slides between segments (Reanimated `withSpring`)
- Active segment text uses `textPrimary`, inactive uses `textSecondary`

---

## Section 6 — Profile Screen

**Push commit: `feat: profile screen`**

Layout:
- Large avatar (80px) with user initials, centered near top
- User's name (derived from email — capitalize the part before `@`) and email below
- Stats row: total tasks count, completed count, pending count — three equal columns with a divider between each
- Settings list below (styled as grouped rows with right chevrons):
  - "Notifications" (toggle switch — UI only, no real logic needed)
  - "Theme" (shows "Light" — no dark mode needed unless you're doing the bonus)
  - "About TaskFlow" (shows app version)
- Danger zone at the bottom: "Sign Out" button — `danger` variant, full width, triggers `authStore.logout()` after a confirmation.

Logout confirmation:
- Use a bottom sheet or a clean in-screen confirmation rather than an `Alert.alert`. A small `View` slides down below the Sign Out button asking "Are you sure?" with "Cancel" and "Confirm" buttons.

---

## Section 7 — Navigation

**Push commit: `feat: navigation and deep linking setup`**

### AppNavigator
- Reads `authStore.user` — renders `AuthNavigator` if null, `TabNavigator` if authenticated.
- Call `authStore.restoreSession()` inside a `useEffect` on mount.
- Show a splash/loading screen (full-screen centered logo + spinner) while session is being restored.

### TabNavigator (Bottom Tabs)
- Tabs: **Tasks** (home icon), **Add** (plus-circle — tapping this navigates to AddTaskScreen modal instead of a tab), **Profile** (account icon)
- Custom tab bar: white background, top border (divider color), active icon in primary color with a small pill indicator above the icon (not below, which is default).
- Tab labels hidden — icons only, with `accessibilityLabel` set.

### AuthNavigator
- Simple stack: just LoginScreen for now. No registration needed.

---

## Section 8 — Error Handling & Polish

**Push commit: `feat: error handling, loading states, and polish`**

1. **Axios interceptors** in `src/services/api.ts`:
   - Request interceptor: attach `Authorization: Bearer <token>` header from the store.
   - Response interceptor: on 401, trigger `authStore.logout()`. On network error, throw a typed error with a user-readable message.

2. **Global error boundary** — wrap the app root in an `ErrorBoundary` class component that catches rendering errors and shows a recovery screen.

3. **Pull-to-refresh** on TaskDashboard re-fetches tasks and shows a native `RefreshControl`.

4. **Offline awareness** — use `@react-native-community/netinfo`. Show a non-intrusive banner at the top when offline: "You're offline · Changes will sync when you're back". This satisfies the offline caching bonus if you also store last-fetched tasks in AsyncStorage and display them when offline.

5. **Keyboard handling** — `KeyboardAvoidingView` on Login and AddTask screens, with correct `behavior` per platform (`'padding'` on iOS, `'height'` on Android).

6. **Platform-specific shadow**: use `elevation` on Android, `shadow*` props on iOS — the theme's `shadows` object handles this already.

7. **Status bar**: use `expo-status-bar` or `react-native` StatusBar. Set to `dark-content` on light screens, `light-content` on the Login gradient header.

8. **Haptic feedback**: on task toggle (checkbox tap), trigger `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` using `expo-haptics`.

---

## Section 9 — README & AI_USAGE.md

**Push commit: `docs: readme and ai usage disclosure`**

### README.md

Write a clean, developer-focused README. Sections:
- **TaskFlow** — one-line description
- **Screenshots** — placeholder section (leave space for images, don't add broken links)
- **Features** — bullet list of everything built
- **Tech Stack** — table: Category | Library | Version
- **Getting Started** — step-by-step: clone, `npm install`, environment setup, `npx expo start`, build APK command
- **Folder Structure** — the tree from above
- **Architecture Decisions** — 3-4 short paragraphs explaining why Zustand over Redux, why JSONPlaceholder, why the modal-based Add screen, etc. Written in a natural, first-person developer voice.
- **Known Limitations** — honest list: no real backend, JWT is simulated, etc.

### AI_USAGE.md

```md
# AI Usage Disclosure

## Tools Used
- Cursor (AI-powered code editor) — primary development environment

## What Was AI-Assisted
- Boilerplate generation for Zustand store structure
- Axios interceptor setup patterns
- Reanimated animation configuration for card entry effects
- TypeScript interface definitions

## What Was Written Manually
- All business logic and validation rules
- Navigation flow decisions and implementation
- UI/UX design decisions, layout structure, and color system
- Component API design (props, variants)
- Error handling strategy
- Git commit messages and project organization

## Prompting Approach
Cursor was used with detailed, specific prompts describing the desired output.
All generated code was reviewed, tested, and often modified before being committed.
AI suggestions that didn't match the intended architecture were discarded.

## Notes
All code was reviewed for correctness and style consistency.
The AI acted as a coding assistant — architecture and design decisions were made independently.
```

---

## Section 10 — Build & Final Push

**Push commit: `release: production build and final cleanup`**

1. Run a final TypeScript type-check: `npx tsc --noEmit`. Fix all errors.
2. Run ESLint: `npx eslint src/`. Fix all warnings.
3. Remove all `console.log` statements (use a custom logger utility that no-ops in production).
4. Verify the app works end-to-end on Android emulator:
   - Cold launch → session restored → TaskDashboard loads
   - Login with fresh session
   - Add a task → appears in list
   - Toggle task → persists on refresh
   - Logout → returns to Login
5. Build APK: `eas build -p android --profile preview` (if using Expo) or `cd android && ./gradlew assembleRelease`.
6. Tag the release: `git tag v1.0.0 && git push origin v1.0.0`
7. Final push: `git push origin main`

---

## Coding Standards (Apply Throughout)

- **No `any` types.** Use `unknown` and narrow it, or define a proper interface.
- **No inline styles** except for dynamic values that depend on state. All static styles go in `StyleSheet.create()`.
- **Comments**: only write a comment when the code itself cannot explain the *why*. Never write comments that describe what the next line does. E.g., `// retry logic — JSONPlaceholder occasionally drops POST requests` is good. `// This calls the API` is not.
- **Imports**: always use path aliases (`@components/ui/Button`), never relative `../../`.
- **File naming**: PascalCase for components and screens, camelCase for utilities and services.
- **Git commits**: write commits in conventional format (`feat:`, `fix:`, `refactor:`, `docs:`). Keep messages short and factual. No AI tool names in commit messages.

---

## Bonus Features (Build These After Core is Stable)

If time permits, implement in this order:

1. **Offline Task Caching (+5)** — already partially covered in Section 8. Fully implement by writing fetched tasks to AsyncStorage on every successful fetch, reading from cache when offline.
2. **Dark Mode (+3)** — add a `darkColors` token set. Toggle via the Profile screen toggle. Persist preference in AsyncStorage. All components read from `useTheme()` so they respond automatically.
3. **Unit Testing (+5)** — write tests for: `validation.ts`, `authStore` (login/logout logic), `taskStore` (filter/search selectors). Use Jest + `@testing-library/react-native`.

---

## Final Checklist Before Submission

- [ ] App runs on Android emulator from a clean install
- [ ] Login flow works, session survives app restart
- [ ] Tasks fetch, display, can be added, toggled, searched, and filtered
- [ ] Pull-to-refresh works
- [ ] All four required screens are present and functional
- [ ] No TypeScript errors, no ESLint warnings
- [ ] README is complete with run instructions
- [ ] AI_USAGE.md is filled in
- [ ] APK builds successfully
- [ ] GitHub repo is public with clean commit history
- [ ] Demo video recorded (3-5 min: walk through Login → Dashboard → Add Task → Toggle → Profile → Logout, briefly explain architecture choices)