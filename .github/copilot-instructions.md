# Triangle Agency Character Sheet - AI Developer Guide

## Project Overview
This is a modular front-end character sheet system for the "Triangle Agency" TTRPG, built with **React 18**, **TypeScript**, and **Vite**.

## Architecture & State Management
- **State First**: The application logic resembles a "thick client". Most logic lives in **Zustand** stores (`src/stores/`), not React components.
- **Immutability**: `characterStore.ts` uses `immer` middleware. updates should mutate the draft state directly.
- **Data Model**: The core data structure is strict and defined in `src/types/index.ts`. Always check/update types *before* modifying logic.
- **Static Data**: Game rules (Anomalies, Realities, Functions) are separated in `src/data/`.

### Key Directories
- `src/stores/`: Global state (`characterStore` for data, `uiStore` for interaction).
- `src/components/panels/`: Main tab views (Profile, Attributes, etc.).
- `src/components/ui/`: Reusable, generic UI components.
- `src/data/`: JSON/TS definitions of static game rules.

## Visual Style & Theming
- **Strict Adherence**: Follow `VISUAL_STYLE_GUIDE.md` for all UI changes.
- **Tailwind CSS**: Used for all styling. Use `clsx` for conditional class merging.
- **Components**: Prefer using existing components in `src/components/ui/` over standard HTML elements.
- **Themes**: The app supports multiple themes (Night, Day, Retro, etc.). Ensure colors use CSS variables or Tailwind theme classes compatible with theme switching.

## Development Workflow
- **Package Manager**: npm
- **Dev Server**: `npm run dev` (Vite)
- **Linting**: `npm run lint`
- **Testing**: No automated test suite currently exists. Verify changes manually via the dev server.

## Coding Conventions
- **Imports**: Always use the `@/` alias for local imports (e.g., `import { useUIStore } from '@/stores'`).
- **Icons**: Use `react-icons` or inline SVGs consistent with existing style.
- **Types**: all strictly typed. Avoid `any`.
- **File Structure**: Colocate feature-specific components in `src/components/panels/[FeatureName].tsx`.

## Common Tasks Reference
- **Adding a new Attribute/Field**:
  1. Update type definition in `src/types/index.ts`.
  2. Add default value in `createNewCharacter` utility.
  3. Add setter action in `src/stores/characterStore.ts`.
  4. Create/Update UI component in `src/components/panels/`.
