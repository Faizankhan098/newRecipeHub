# RecipeHub - Collaborative Recipe Platform

A modern, GitHub-like collaborative recipe platform where users can create, share, and collaborate on recipes with real-time features, automatic ingredient scaling, and built-in cooking timers.

## 🚀 Features

### Core Functionality
- **Recipe CRUD Operations**: Create, read, update, and delete recipes with rich metadata
- **Automatic Ingredient Scaling**: Dynamic quantity recalculation based on serving adjustments
- **Step-by-Step Instructions**: Organized cooking steps with optional timers
- **Built-in Interactive Timers**: Visual and audio alerts with multiple notification methods
- **Collaboration System**: Invite collaborators via email with proper attribution to original creators
- **Public/Private Sharing**: Control recipe visibility and sharing permissions

### Advanced Features
- **Real-time Collaboration**: Multiple users can edit recipes simultaneously
- **Recipe Discovery**: Browse public recipes with categories and search
- **Original Creator Attribution**: Ensures credit is always given to recipe originators
- **Activity Tracking**: Monitor recipe changes and collaboration history
- **Responsive Design**: Optimized for desktop and mobile devices
- **Authentication**: Secure login via Replit OAuth integration

### Timer System
- **Multiple Alert Types**: Sound, visual, browser notifications, and page title updates
- **Smart Warning States**: Color-coded alerts for remaining time
- **Sound Control**: Toggle audio alerts on/off
- **Cross-browser Compatibility**: Fallback audio systems for maximum compatibility
- **Visual Effects**: Flashing animations and progress indicators

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Passport.js** - Authentication middleware
- **OpenID Connect** - Secure authentication protocol
- **Express Session** - Session management

### Database
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Drizzle Kit** - Database migration tool

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗 Architecture

### Database Schema
```sql
-- Users table for authentication
users (id, email, firstName, lastName, profileImageUrl, createdAt, updatedAt)

-- Core recipe data
recipes (id, title, description, createdBy, originalCreator, servings, prepTime, cookTime, tags, isPublic, heroImageUrl, createdAt, updatedAt)

-- Recipe components
ingredients (id, recipeId, name, quantity, unit, order, createdAt, updatedAt)
instructions (id, recipeId, stepNumber, description, timerMinutes, createdAt, updatedAt)

-- Collaboration features
collaborators (id, recipeId, userId, permission, createdAt, updatedAt)
recipe_activity (id, recipeId, userId, action, description, createdAt)

-- Session management
sessions (sid, sess, expire)
```

### API Endpoints
```
Authentication:
GET  /api/auth/user          - Get current user
GET  /api/login              - Initiate login
GET  /api/logout             - Logout user
GET  /api/callback           - OAuth callback

Recipes:
GET    /api/recipes          - Get user's recipes
POST   /api/recipes          - Create new recipe
GET    /api/recipes/public   - Get public recipes
GET    /api/recipes/:id      - Get recipe details
PUT    /api/recipes/:id      - Update recipe
DELETE /api/recipes/:id      - Delete recipe

Recipe Components:
POST /api/recipes/:id/ingredients   - Add ingredient
POST /api/recipes/:id/instructions  - Add instruction
POST /api/recipes/:id/collaborators - Add collaborator
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Replit account (for authentication)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   SESSION_SECRET=your-session-secret
   REPL_ID=your-replit-app-id
   REPLIT_DOMAINS=your-domain.com
   ```
4. Run database migrations: `npm run db:push`
5. Start the development server: `npm run dev`

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption
- `REPL_ID` - Replit application ID for OAuth
- `REPLIT_DOMAINS` - Comma-separated list of allowed domains

## 📱 User Interface

### Landing Page
- Professional hero banner with call-to-action
- Feature showcase with interactive demos
- Responsive design optimized for all devices

### Dashboard
- Recipe statistics and quick actions
- Recently created and collaborated recipes
- Quick access to recipe creation

### Recipe Creation
- Rich form with validation
- Dynamic ingredient and instruction management
- Real-time preview capabilities

### Recipe Detail
- Comprehensive recipe display
- Interactive ingredient scaling
- Built-in timer integration
- Collaboration panel

### Discover Page
- Public recipe browsing
- Category-based filtering
- Featured recipe highlights

## 🔧 Core Components

### Timer Widget
Advanced cooking timer with multiple alert systems:
- Visual progress indicators
- Audio alerts with fallbacks
- Browser push notifications
- Page title notifications
- Color-coded warning states

### Ingredient Scaler
Dynamic quantity adjustment system:
- Automatic calculation based on serving changes
- Support for fractional quantities
- Unit conversion handling
- Real-time updates

### Collaboration Panel
Real-time collaboration features:
- Email-based collaborator invitations
- Permission management
- Activity history tracking
- Original creator attribution

## 🔐 Security Features

- Secure OAuth authentication via Replit
- Session-based user management
- Permission-based access control
- SQL injection prevention via ORM
- Input validation and sanitization

## 📊 Performance Optimizations

- Server-side rendering for SEO
- Efficient database queries with proper indexing
- Lazy loading for large recipe lists
- Optimized bundle splitting
- CDN-ready static assets

## 🧪 Testing the Platform

### Timer Demo
Visit `/timer-demo` to test the interactive timer system:
- Try the 6-second quick test
- Test audio and visual alerts
- Experiment with pause/resume functionality

### Recipe Creation
1. Click "New Recipe" from the dashboard
2. Fill in recipe details and ingredients
3. Add step-by-step instructions with timers
4. Test ingredient scaling functionality

## 📈 Deployment

The application is designed for easy deployment on Replit with:
- Automatic PostgreSQL database provisioning
- Built-in OAuth integration
- Environment variable management
- Zero-configuration deployment

## 🤝 Contributing

This project follows modern development practices:
- TypeScript for type safety
- Component-based architecture
- Comprehensive error handling
- Responsive design principles
- Accessibility considerations

## 📝 License

This project is built for educational and demonstration purposes, showcasing modern full-stack development practices with React, Node.js, and PostgreSQL.