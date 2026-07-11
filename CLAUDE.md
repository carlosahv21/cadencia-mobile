# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DanceFlow Mobile — React Native (Expo SDK 54) app for a dance-academy management platform. TypeScript, React Navigation, Ant Design RN, i18next (es/en). Backend is a separate REST API (default dev: `http://192.168.1.25:8000/api` on device, `http://localhost:8000/api` on web; override with `EXPO_PUBLIC_API_BASE_URL`).

## Commands

```bash
npm start           # expo start (Expo Go, QR)
npm run tunnel      # expo start --tunnel
npm run ios / android / web
npm run lint        # eslint . --ext .ts,.tsx
npm run type-check  # tsc --noEmit
```

No test suite exists. Verify changes with `npm run type-check`.

## Architecture

Provider tree in `App.tsx`: `GestureHandlerRootView > SafeAreaProvider > AuthProvider > ThemeProvider > NotificationProvider > AppNavigator`. `App.tsx` also patches `setImmediate` for web.

**Navigation** (`src/navigation/`): `AppNavigator` routes on auth + onboarding state → `AuthNavigator` (not logged in), `OnboardingScreen` (first login), or `MainNavigator` (native-stack with a custom `TabNavigator` for Dashboard/Classes/Attendance/Profile plus detail screens: GlobalSearch, ResumeStudent, ResumenTeacher, ResumeClass, Notifications).

**API layer** (`src/services/`): all HTTP goes through the shared axios instance in `api.ts` — request interceptor injects `Bearer` token from storage; response interceptor clears auth on 401. Domain services (`auth`, `dashboard`, `clases`, `student`, `teacher`, `search`, `user`, notifications) wrap it. Add new endpoints as functions in the matching `*.service.ts`, never with raw axios.

**Storage** (`src/utils/storage.ts`): single `storage` object abstracting SecureStore (native) vs localStorage (web) for token, user, academy, theme, onboarding, and push-token keys. Always persist through it, never call SecureStore/AsyncStorage directly.

**State**: React contexts only (`AuthContext`, `ThemeContext`, `NotificationContext`) — no Redux/Zustand. Data fetching via custom hooks in `src/hooks/` that call services.

**Theming**: `useTheme()` from `ThemeContext` provides light/dark palettes defined in `src/theme/` (brand blue `#0c73dc` primary, `gradient`/`primarySoft` tokens). Style with `theme.colors.*`, not hard-coded colors.

**Visual rules**: clean headers (`common/BackHeader`, no gradients), cards on `surface` with radius 16+ and soft shadow (`shadowOpacity` ≤ 0.05). **Generous spacing everywhere** — never cram: ≥14 between header and content, ≥24 top padding for scroll content, ≥28 between sections; when in doubt, add air. Forms: icons beside uppercase labels (primary color), placeholders in inputs, submit button pinned at the bottom, section titles + `Divider` to group fields.

**i18n**: `useTranslation()` with strings in `src/i18n/locales/{es,en}.json`. UI copy and code comments are largely Spanish; keep new user-facing strings in both locale files.

**Structure conventions**: screens in `src/screens/<domain>/`, their components in `src/components/<domain>/` (shared ones in `common/` and `layout/`), types in `src/types/`.
