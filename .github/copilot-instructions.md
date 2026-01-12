# Triangle Agency Character Sheet - AI Developer Guide

## Core Architecture
- **State Management**: Using **Zustand** with **Immer** middleware (`src/stores/`). 
  - Central data is `CharacterData` in `useCharacterStore`.
  - Prefer immutable updates via `immer`'s `state.character.X = Y` syntax within store actions.
  - Never update state directly in components; use store actions.
- **Thick Store Pattern**: Complex logic (e.g., cross-attribute calculations, migration) lives in `characterStore.ts` or `src/utils/character.ts`, not in React components.
- **Strict Typing**: `src/types/index.ts` defines the single source of truth for all data structures. All new fields must be added here first.
- **Static Content**: Game rules are isolated in `src/data/*.ts`. Access them via helper functions like `findFunctionByName` or `getAnomalyNames`.

## UI & Styling
- **Design System**: Strict adherence to `VISUAL_STYLE_GUIDE.md`. 
- **Tailwind CSS**: Use Tailwind for all styling. Use the `bg-theme-X` and `text-theme-Y` utility classes for theme compatibility.
- **Reusable UI Components** (`src/components/ui/`):
  - `DotTracker`: For 1-N attribute values (e.g., Professionalism, Grit).
  - `ProgressTrack`: For 3x3 grids (Functional, Reality, Anomaly).
  - `Card`: Standard container for sections.
  - `Counter`: For numerical values with +/- buttons (e.g., KPI).
- **Import Aliases**: Always use `@/` for project roots (e.g., `import { ... } from '@/stores'`).

## Developer Workflows
- **Running Dev**: `npm run dev`
- **Build**: `npm run build` (runs `tsc` then `vite build`)
- **Data Initialization**: `createNewCharacter` in `src/utils/character.ts` defines default values for all state fields.
- **Persistence**: Managed by `storageService` in `src/utils/storage.ts` using `localStorage` with `lz-string` compression might be used (check `package.json`).

## Common Tasks Reference
- **Adding a New Profile Field**:
  1. Add property to `CharacterData` in `src/types/index.ts`.
  2. Update `createNewCharacter` in `src/utils/character.ts` with a default value.
  3. Add a setter action (e.g., `setField: (val) => void`) to `src/stores/characterStore.ts`.
  4. Implement an `Input` or `Select` in `src/components/panels/ProfilePanel.tsx`.
- **Handling Attribute Changes**:
  - Most attribute logic should use the `setAttributeCurrent` action which handles range clamping.
  - For complex logic (like "Self Assessment" affecting multiple attributes), implement it in the panel component calling multiple store actions.

## Contextual Icons
- Use `react-icons/fi` (Feather), `react-icons/ri` (Remix), or `react-icons/bi` (BoxIcons) consistently with existing icons.

