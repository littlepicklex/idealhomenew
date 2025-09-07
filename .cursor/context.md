# PropertyFinder Pro - Project Context

## Overview
PropertyFinder Pro is a comprehensive property listing application that helps users find their ideal properties through an intelligent scoring system and interactive features.

## Key Features
- **Property Discovery**: Browse properties with advanced filtering and sorting
- **Ideality Scoring**: AI-powered scoring system (0-100) based on user preferences
- **Interactive Maps**: Mapbox integration with property markers and hover effects
- **User Authentication**: JWT-based auth with httpOnly cookies
- **Property Wizard**: Multi-step preference collection
- **Favorites System**: Save and manage favorite properties
- **PDF Reports**: Generate detailed property reports
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Technology Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT with httpOnly cookies, bcrypt for passwords
- **Maps**: Mapbox GL JS with React integration
- **PDF Generation**: Puppeteer for server-side PDF creation
- **Testing**: Playwright for end-to-end testing
- **Charts**: Recharts for data visualization

## Database Schema
- **User**: Authentication and profile data
- **Property**: Property listings with location, features, and scores
- **Favorite**: User-property relationships

## API Endpoints
- `/api/auth/*` - Authentication (register, login, logout, me)
- `/api/properties` - Property listings with filtering and pagination
- `/api/properties/[id]` - Individual property details
- `/api/favorites` - Favorite management (auth required)
- `/api/facets` - Filter ranges and options
- `/api/report/[id]` - PDF report generation

## Key Components
- **PropertyCard**: Displays property information with ideality score
- **ScoreBreakdownChart**: Visualizes scoring components
- **MapboxMap**: Interactive map with property markers
- **FiltersSidebar**: Property filtering interface
- **PropertyWizard**: Multi-step preference collection

## Development Workflow
1. Use `npm run dev` to start development server
2. Use `npm run test` to run Playwright tests
3. Use `npx prisma studio` to view database
4. Use `npm run build` to build for production

## Environment Variables
- `DATABASE_URL` - Database connection string
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox access token
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

## Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user flow testing with Playwright
- **Visual Tests**: Screenshot comparison for UI consistency

## Deployment
- **Development**: Local SQLite database
- **Production**: PostgreSQL database with proper environment configuration
- **CI/CD**: Automated testing and deployment pipeline
