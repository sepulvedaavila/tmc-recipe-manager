# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm start`: Run frontend React app
- `node src/api/server.js`: Run backend server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm test -- --testPathPattern=src/path/to/test.js`: Run single test

## Code Style
- **Components**: Use functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Files**: camelCase for filenames
- **Imports**: Group by type (React, third-party, local, styles)
- **Language**: Mixed Spanish/English naming (preserve this pattern)
- **MongoDB**: Use Mongoose schemas with proper validation
- **Errors**: Use try/catch blocks with detailed error logging
- **State**: Use React hooks for state management
- **Formatting**: Follow existing indentation (2 spaces)
- **Forms**: Use controlled components for form elements

## Project Structure
- `/src/components`: React components
- `/src/api`: Backend code (controllers, models, routes)
- `/src/styles`: CSS/SCSS styling
- `/src/utils`: Helper functions