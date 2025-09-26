# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is STRUDEL Kit, a React and TypeScript-based starter kit for building scientific UIs. It provides templates implementing common task flows for scientific applications and is built on the STRUDEL Design System.

## Development Commands

### Primary Development

- `npm start` or `npm run dev` - Start development server (http://localhost:5175)
- `npm run build` - Build production bundle (runs TypeScript check first)
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Run ESLint on TypeScript/JavaScript files
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run prettier` - Check code formatting
- `npm run prettier:fix` - Auto-format code
- `npm run style:all` - Run TypeScript check, lint, and prettier

### Testing

- `npm run cy:open` - Open Cypress for interactive testing
- `npm run cy:test` - Run Cypress tests headlessly

### Deployment

- `npm run deploy` - Deploy to GitHub Pages

## Architecture

### Core Technologies

- **React 18** with TypeScript for component development
- **TanStack Router** for file-based routing with type safety
- **Material UI (MUI)** for design system components
- **TanStack Query** for data fetching and state management
- **Plotly.js** for data visualization
- **Vite** for build tooling

### Application Structure

#### Routing System

- File-based routing using TanStack Router
- Routes defined in `src/pages/` directory
- Generated route tree in `src/routeTree.gen.ts`
- Root layout in `src/pages/__root.tsx`

#### Task Flow Pattern

The app implements six main task flow templates:

- `explore-data/` - Data exploration and visualization
- `search-data-repositories/` - Search and discovery interfaces
- `compare-data/` - Data comparison workflows
- `run-computation/` - Computational workflow management
- `contribute-data/` - Data submission and validation
- `monitor-activities/` - Activity monitoring and tracking

Each task flow follows this structure:

- `index.tsx` - Main page component
- `_layout.tsx` - Shared layout for nested routes
- `$id.tsx` - Dynamic route for individual items
- `-components/` - Task flow-specific components
- `-context/` - Local state management
- `-tests/` - Cypress test files

#### Component Organization

- `src/components/` - Shared UI components
- `src/hooks/` - Custom React hooks for data fetching
- `src/context/` - Global application state
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions

#### Key Components

- `FilterContext.tsx` - Provides filtering capabilities across task flows
- `SciDataGrid.tsx` - Scientific data table component
- `TopBar.tsx` - Application navigation
- `Layout.tsx` - Common page layout wrapper

### State Management

- React Context for global state (`src/context/ContextProvider.tsx`)
- TanStack Query for server state management
- Local context providers for task flow-specific state

### Data Fetching

- Custom hooks in `src/hooks/` for data operations
- `useListQuery.ts` - For list/collection data
- `useDetailQuery.ts` - For individual item data
- `useDataFromSource.tsx` - Generic data source hook

## Development Guidelines

### File Organization

- Components use PascalCase naming
- Hooks use camelCase with `use` prefix
- Pages follow the file-based routing structure
- Private components/utilities use `-` prefix (e.g., `-components/`)

### TypeScript Configuration

- Strict mode enabled
- ES2020 target
- Bundler module resolution
- Types for Node, Cypress, and React included

### Code Quality Tools

- ESLint with Airbnb TypeScript configuration
- Prettier for code formatting
- Husky for pre-commit hooks
- lint-staged for staged file linting
