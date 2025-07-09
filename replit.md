# Ecological Game Platform

## Overview

This is a React-based educational gaming platform focused on environmental awareness and sustainability. The application is a full-stack web application built with React frontend and Express backend, designed to teach users about ecology and environmental responsibility through interactive games.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom ecological theme colors
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Development Environment
- **Platform**: Replit-optimized with specific plugins and configurations
- **Hot Module Replacement**: Vite HMR for development
- **Error Handling**: Runtime error overlay for development debugging

## Key Components

### Database Schema
The application uses three main database tables:
- **users**: User account management with username/password authentication
- **game_progress**: Tracks user progress including total score, level, completed challenges, current streak, and earned badges
- **game_results**: Stores individual game session results with score, time spent, and game type

### Game Types
The platform includes nine different educational games:
1. **Waste Sorting Game**: Drag-and-drop waste items into correct recycling bins
2. **Eco Quiz**: Multiple choice questions about environmental topics
3. **Catch Waste Game**: Arcade-style game to catch falling waste items
4. **True/False Game**: Quick true/false questions about sustainability
5. **Spot Behavior Game**: Identify good and bad environmental behaviors
6. **Mobility Plan Game**: Choose optimal transportation methods based on CO2 emissions
7. **Cigarette Battle Game**: Whack-a-mole style game to clean up cigarette butts in a park
8. **Light Hunt Game**: Click on wasteful lights in buildings to reduce light pollution and save energy
9. **Facade Renovation Game**: Choose eco-friendly solutions to green a building facade

### Game Logic System
- **Scoring System**: Different point values for different game types
- **Level Progression**: Automatic level calculation based on total score
- **Badge System**: Achievement system with various ecological badges
- **Streak Tracking**: Tracks consecutive successful game completions
- **Difficulty Scaling**: Dynamic difficulty adjustment based on user level
  - **EASY (Levels 1-2)**: Slower speed, more time, fewer elements
  - **MEDIUM (Levels 3-4)**: Standard difficulty settings
  - **HARD (Levels 5-7)**: Faster speed, less time, more elements
  - **EXPERT (Level 8+)**: Maximum challenge with rapid gameplay

### UI Components
- **Modular Design**: Reusable game components with consistent interface
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Achievement System**: Toast notifications for new badges and achievements
- **Progress Tracking**: Visual progress indicators and statistics

## Data Flow

### Game Session Flow
1. User selects a game from the main dashboard
2. Game modal opens with specific game component
3. Game tracks user interactions and calculates score
4. On completion, result is sent to backend via POST /api/results
5. Backend calculates new progress metrics and badge achievements
6. Frontend updates UI with new progress and shows achievement notifications

### Progress Management
- **Local Storage**: Temporary progress stored in browser localStorage
- **Server Sync**: Progress synchronized with backend database
- **Real-time Updates**: UI updates immediately after each game completion

### API Endpoints
- `GET /api/progress/:userId` - Retrieve user progress
- `PUT /api/progress/:userId` - Update user progress
- `POST /api/results` - Save game result
- `GET /api/results/:userId` - Retrieve user's game history

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Utilities**: clsx for conditional classes, date-fns for date manipulation
- **Development**: Vite, TypeScript, ESLint for development tooling

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon Database driver
- **Session Management**: express-session with connect-pg-simple
- **Validation**: Zod for runtime type checking and validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Replit Integration**: Cartographer plugin for Replit workspace integration
- **Error Handling**: Runtime error overlay for development debugging
- **Build Tools**: Vite for frontend, esbuild for backend bundling

## Deployment Strategy

### Development Mode
- **Frontend**: Vite development server with HMR
- **Backend**: tsx watch mode for automatic TypeScript compilation
- **Database**: Neon Database with development connection
- **Environment**: Replit environment with specific optimizations

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Assets**: Frontend serves static files from build directory
- **Database**: Production PostgreSQL via Neon Database

### Environment Configuration
- **Database URL**: Configured via `DATABASE_URL` environment variable
- **Build Process**: Separate build commands for frontend and backend
- **Deployment**: Single production server serving both API and static assets

## Changelog

- July 08, 2025. Initial setup with 6 games
- July 08, 2025. Added 3 additional games: Cigarette Battle, Watering Game, Facade Renovation
- July 08, 2025. Changed background to plant-themed images with green gradient
- July 08, 2025. Updated title to "Planète Party"
- July 08, 2025. Implemented dynamic difficulty levels for action games based on user progression
- July 09, 2025. Replaced watering game with "Chasse aux lumières" (Light Hunt) game focused on light pollution and energy conservation

## User Preferences

Preferred communication style: Simple, everyday language.