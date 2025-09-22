# replit.md

## Overview

This is a full-stack web application for UnlockHQ, an AI agent platform that provides automated business solutions. The application is built with a React frontend using Vite, an Express.js backend, and PostgreSQL database with Drizzle ORM. The platform showcases AI-powered services including lead generation, calling agents, review management, and follow-up automation. It features a modern, dark-themed UI with particle effects and smooth animations, designed to convey a futuristic, tech-savvy aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions and effects

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite integration in development mode

### Database & Data Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Schema Management**: Shared schema definitions between client and server
- **Validation**: Zod schemas for runtime type validation
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### UI/UX Design System
- **Theme**: Dark mode with navy, indigo, purple, and cyan color palette
- **Typography**: Modern sans-serif fonts (Inter, DM Sans, Geist Mono)
- **Components**: Consistent component library with shadcn/ui
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Visual Effects**: Custom particle system and gradient backgrounds

### Development Configuration
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Type Checking**: TypeScript with strict mode enabled
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Development Tools**: Replit integration with cartographer and dev banner plugins

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Uses `@neondatabase/serverless` driver

### UI Component Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider functionality

### Form & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for both frontend and backend

### Development & Build Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Backend bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Animation & Effects
- **Framer Motion**: Animation library for React components
- **Custom Particle System**: Canvas-based particle effects

### Utility Libraries
- **clsx/tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation