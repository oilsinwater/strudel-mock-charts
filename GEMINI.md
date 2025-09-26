# Project Overview

This project is a React and TypeScript-based starter kit for building scientific UIs. It is built with Vite, Material UI, and TanStack Router, and it uses Cypress for end-to-end testing. The project provides a suite of templates to implement UIs for various different task flows common to the scientific domain.

## Building and Running

### Prerequisites

- Node.js (version 18.18.0 or higher)
- npm

### Installation

```bash
npm install
```

### Development

To start the development server, run:

```bash
npm start
```

The application will be available at [http://localhost:5175](http://localhost:5175).

### Building

To build the project for production, run:

```bash
npm run build
```

The production-ready files will be located in the `dist` directory.

### Testing

To run the Cypress tests, use the following commands:

- To open the Cypress test runner:

```bash
npm run cy:open
```

- To run the tests in headless mode:

```bash
npm run cy:test
```

## Development Conventions

### Code Style

This project uses ESLint and Prettier to enforce a consistent code style. The configuration for these tools can be found in `.eslintrc.json` and `.prettierrc.json`, respectively.

### Pre-commit Hooks

This project uses Husky to run a pre-commit hook that lints and styles staged code. The pre-commit hook is defined in `.husky/pre-commit`.

### TypeScript

This project uses a strict TypeScript configuration, which can be found in `tsconfig.json`. All new code should be written in TypeScript.

### Routing

This project uses TanStack Router for file-based routing. The routes are defined in the `src/pages` directory. The generated route tree is located in `src/routeTree.gen.ts`.
