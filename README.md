# PropertyFinder Pro

A comprehensive property listing application with intelligent scoring, interactive maps, and user preferences.

## 🏠 Features

- **Property Discovery**: Browse properties with advanced filtering and sorting
- **Ideality Scoring**: AI-powered scoring system (0-100) based on user preferences
- **Interactive Maps**: Mapbox integration with property markers and hover effects
- **User Authentication**: JWT-based auth with httpOnly cookies
- **Property Wizard**: Multi-step preference collection
- **Favorites System**: Save and manage favorite properties
- **PDF Reports**: Generate detailed property reports
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT with httpOnly cookies, bcrypt for passwords
- **Maps**: Mapbox GL JS with React integration
- **PDF Generation**: Puppeteer for server-side PDF creation
- **Testing**: Playwright for end-to-end testing
- **Charts**: Recharts for data visualization

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-finder-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your_mapbox_token"

# JWT
JWT_SECRET="your-long-secret-key"

# Environment
NODE_ENV="development"
```

## 🗄️ Database Schema

### User
- `id`: Primary key
- `email`: Unique email address
- `passwordHash`: Hashed password
- `createdAt`: Account creation timestamp

### Property
- `id`: Primary key
- `title`: Property title
- `price`: Property price
- `sqft`: Square footage
- `yearBuilt`: Year built
- `beds`: Number of bedrooms
- `baths`: Number of bathrooms
- `lat/lng`: Coordinates
- `type`: Property type (house, apartment, condo)
- `locationScore`: Location quality score
- `safetyScore`: Safety score
- `schoolScore`: School quality score
- `commuteMinutes`: Average commute time
- `idealityScore`: Overall ideality score
- `createdAt`: Listing creation timestamp

### Favorite
- `id`: Primary key
- `userId`: Foreign key to User
- `propertyId`: Foreign key to Property
- `createdAt`: Favorite creation timestamp

## 🛣️ API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List properties with filtering and pagination
- `GET /api/properties/[id]` - Get property details
- `GET /api/facets` - Get filter ranges and options

### Favorites
- `GET /api/favorites` - Get user favorites (auth required)
- `POST /api/favorites` - Add/remove favorite (auth required)

### Reports
- `GET /api/report/[id]` - Generate PDF report for property

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Test Coverage
- **Authentication Flow**: Register, login, logout
- **Property Wizard**: Multi-step preference collection
- **Property List**: Filtering, sorting, favorites
- **Profile Management**: Favorites, user info
- **End-to-End**: Complete user journey

## 📱 Pages

### Public Pages
- `/` - Landing page with property listings
- `/wizard` - Property preference wizard
- `/properties` - Filtered property results
- `/property/[id]` - Property detail page
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/profile` - User profile and favorites

## 🎨 Components

### Core Components
- `PropertyCard` - Property display card
- `ScoreBreakdownChart` - Ideality score visualization
- `MapboxMap` - Interactive map component
- `FiltersSidebar` - Property filtering interface
- `PropertyWizard` - Multi-step preference form

### UI Components
- `Nav` - Navigation component
- `Protected` - Route protection wrapper
- Various shadcn/ui components

## 🔐 Authentication

The application uses JWT-based authentication with httpOnly cookies:

1. **Registration**: Users create accounts with email/password
2. **Login**: JWT token stored in httpOnly cookie
3. **Protected Routes**: Middleware checks authentication
4. **Logout**: Cookie is cleared

## 🗺️ Maps Integration

Mapbox GL JS integration provides:
- Interactive property maps
- Property markers with hover effects
- Map/list view toggle
- Responsive design

## 📊 Ideality Scoring

Properties are scored (0-100) based on:
- **Price**: Affordability relative to market
- **Features**: Size, bedrooms, bathrooms, year built
- **Location**: Neighborhood quality and amenities
- **Safety**: Crime rates and safety metrics
- **Schools**: School district quality
- **Commute**: Transportation accessibility

## 📄 PDF Reports

Server-side PDF generation includes:
- Property details and photos
- Ideality score breakdown
- Neighborhood data and statistics
- Professional formatting

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Migration
```bash
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.
