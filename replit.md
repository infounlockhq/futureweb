# UnlockHQ - AI-Powered Business Solutions Platform

## Overview

UnlockHQ is a modern web application offering AI-powered business solutions including lead generation, customer support automation, and data analytics. The platform features a sleek landing page with a contact form system that integrates with multiple third-party services for lead management and notifications.

The application is built as a full-stack TypeScript solution with a React frontend and Express backend, utilizing PostgreSQL for data persistence and multiple external integrations for business operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite for fast development and optimized production builds
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack Query (React Query) for server state management
- **Form Handling:** React Hook Form with Zod validation for type-safe form management
- **UI Components:** Radix UI primitives with custom shadcn/ui components
- **Styling:** Tailwind CSS with custom design tokens for dark theme
- **Animations:** Framer Motion for smooth UI transitions and particle effects

**Design Decisions:**
- Custom particle system for visual appeal on landing page
- Responsive design with mobile-first approach
- Dark theme with custom color palette (navy, indigo, purple, cyan)
- Reusable component architecture following atomic design principles

**Project Structure:**
- `/client/src/components` - Reusable UI components and shadcn/ui library
- `/client/src/pages` - Page-level components (home, not-found)
- `/client/src/hooks` - Custom React hooks for common functionality
- `/client/src/lib` - Utility functions and query client configuration

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js for REST API
- **Database ORM:** Drizzle ORM with PostgreSQL dialect
- **Database Provider:** Neon serverless PostgreSQL
- **Validation:** Zod schemas shared between frontend and backend

**API Design:**
- RESTful endpoints with JSON responses
- `/api/contact` - POST endpoint for contact form submissions
- `/api/contacts` - GET endpoint for retrieving all contacts (admin)
- Request/response logging middleware for debugging
- Centralized error handling middleware

**Storage Layer:**
- Interface-based storage system (`IStorage`) for flexibility
- In-memory storage implementation (`MemStorage`) for development/testing
- Designed to easily swap storage implementations (e.g., PostgreSQL via Drizzle)

**Design Rationale:**
The storage interface pattern allows development to proceed without database setup while maintaining the same API contract. This can be replaced with a Drizzle-based implementation when PostgreSQL is provisioned.

### Data Schema

**Database Tables:**

1. **users table:**
   - id (UUID primary key)
   - username (unique text)
   - password (text)
   - Purpose: User authentication (currently unused but infrastructure ready)

2. **contacts table:**
   - id (UUID primary key)
   - name (text, required)
   - email (text, required)
   - phone (text, optional)
   - company (text, optional)
   - createdAt (timestamp with default now())
   - Purpose: Store contact form submissions

**Validation:**
- Shared Zod schemas ensure type safety across frontend and backend
- Insert schemas define required fields and validation rules
- Type inference from schemas provides TypeScript types

### External Dependencies

**Third-Party Services:**

1. **SendGrid Email Service:**
   - Purpose: Send email notifications for new contact form submissions
   - Configuration: Requires `SENDGRID_API_KEY` environment variable
   - Verified sender: noreply@unlockhq.com
   - Recipient: info.unlockhq@gmail.com
   - Graceful degradation: App continues to function without SendGrid configured

2. **Google Sheets Integration:**
   - Purpose: Automatically log contact submissions to spreadsheet
   - Configuration: Requires `GOOGLE_SHEETS_ID` and `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` environment variables
   - Authentication: Google Service Account with JWT
   - Scope: Spreadsheet write permissions
   - Graceful degradation: App continues to function without Google Sheets configured

3. **Neon Database:**
   - Purpose: Serverless PostgreSQL database hosting
   - Configuration: Requires `DATABASE_URL` environment variable
   - Connection: Via `@neondatabase/serverless` driver
   - Migration support: Drizzle Kit for schema migrations

**Communication Services:**
- WhatsApp integration for direct messaging (phone: +918860881127)
- Social media links: Instagram, LinkedIn, X (Twitter)

**Development Tools:**
- Replit-specific plugins for development environment (cartographer, dev banner, runtime error modal)
- Environment detection for conditional plugin loading
- Vercel deployment configuration

**Design Approach:**
All external integrations are designed with fault tolerance - failures in email or spreadsheet logging don't block the primary contact form functionality. Errors are logged but don't prevent successful form submission.