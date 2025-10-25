# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes type checking)
- `pnpm preview` - Preview production build
- `pnpm test:e2e` - Run Playwright end-to-end tests

### Database
- `pnpm astro db push` - Push database schema changes
- `pnpm astro db seed` - Seed database with initial data

## Architecture Overview

### Tech Stack
- **Astro 5.10.1** - Static site generator with hybrid rendering
- **React 19.1.0** & **Vue 3.4.31** - Mixed framework components
- **TypeScript** - Full type safety
- **Astro DB** - Built-in SQLite database
- **Tailwind CSS 4.0.7** - Utility-first styling
- **Vercel** - Deployment platform

### Core Directory Structure

```
src/
├── actions/           # Server actions (Astro actions pattern)
├── components/        # Mixed React/Vue/Astro components
│   ├── ui/           # Reusable UI primitives
│   └── dashboard/    # Dashboard-specific components
├── content/          # Astro content collections
├── data/resources/   # Static learning resources (podcasts, TV shows)
├── layouts/          # Page layouts
├── lib/              # Core utilities
│   ├── cookies/      # Session cookie management
│   └── session/      # Session handling
├── pages/            # File-based routing
│   ├── api/          # API endpoints
│   └── login/        # Feature-based page organization
├── types/            # TypeScript definitions
└── utils/            # General utilities
```

### Authentication Architecture

**Session-Based Authentication:**
- Custom session management with secure cookies
- Database sessions with expiration tracking
- Client IP and User Agent tracking for security
- bcryptjs for password hashing
- Email confirmation via Resend service

**Key Files:**
- `src/lib/session/create-session.query.ts` - Session creation
- `src/lib/cookies/session-cookie.ts` - Cookie management
- `src/pages/login/_actions/login.action.ts` - Login flow
- `src/pages/register/_actions/register.action.ts` - Registration flow
- `src/utils/resend.ts` - Email service integration
- `db/config.ts` - Database schema (User, Session, EmailConfirmation tables)

**Registration Flow:**
1. User submits registration form
2. System validates email availability
3. User account created (unconfirmed)
4. Confirmation email sent via Resend
5. User clicks email link to confirm
6. Account activated for login

### Form Handling Pattern

**Astro Actions + React Hook Form:**
- Server actions defined in `src/actions/` with Zod validation
- React forms use React Hook Form with Zod resolvers
- Error handling via `src/utils/actions.utils.ts`
- Type-safe form responses with proper error states

**Example Pattern:**
```
pages/feature/
├── _actions/feature.action.ts    # Server action
├── _components/feature-form.tsx  # React form component
├── _schemas/feature.schema.ts    # Zod validation
└── index.astro                   # Page component
```

### Content Management

**Astro Content Collections:**
- Learning resources stored as markdown in `src/data/resources/`
- Schema validation in `src/content.config.ts`
- Collections: podcasts, tvShows, movies
- Associated images in `src/images/resources/`

### State Management

**Mixed Approach:**
- **Nanostores** - Global state (`src/components/nanostore.ts`)
- **Component state** - React Hook Form for forms
- **Dashboard state** - Dedicated store (`src/components/dashboard/dashboard-store.ts`)

### Component Architecture

**Framework Usage:**
- **Astro** - Static components, layouts, pages
- **React** - Interactive forms, UI components with Radix UI
- **Vue** - Carousels, mobile navigation, dashboard components

**UI System:**
- Base components in `src/components/ui/`
- Radix UI primitives for accessibility
- Tailwind CSS with utility classes
- Toast notifications via Sonner

### API Layer

**Structure:**
- Database queries in `_queries/` folders
- Validation functions in `_validations/` folders
- Utility functions for common operations
- Type-safe database operations with Astro DB

### Testing

**Playwright E2E:**
- Tests in `tests/` directory
- Configuration in `playwright.config.ts`
- Global teardown for cleanup
- Browser automation for user flows

### Environment Configuration

**Required Variables:**
```env
PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
GMAIL_APP_EMAIL=
GMAIL_APP_PASSWORD=
BREVO_API_KEY=
RESEND_API_KEY=
SESSION_COOKIE_NAME=english-for-abroad-session
SITE=
MODE=development|production
```

### TypeScript Configuration

**Path Mapping:**
- `@/*` maps to `./src/*`
- `@tests/*` maps to `./tests/*`
- `@db/*` maps to `./db/*`

### Security Considerations

- Password hashing with bcryptjs
- Session-based authentication with secure cookies
- CSRF protection via Astro actions
- Input validation with Zod schemas
- reCAPTCHA integration for form protection

### Development Patterns

**File Organization:**
- Feature-based folder structure for pages
- Co-located actions, components, and schemas
- Shared utilities in dedicated folders
- Type definitions in centralized `types/` folder

**Naming Conventions:**
- Action files: `*.action.ts`
- Query files: `*.query.ts`
- Schema files: `*.schema.ts`
- Validation files: `*.validation.ts`
- Component files: PascalCase for React/Vue, kebab-case for Astro

### Build & Deployment

**Vercel Configuration:**
- Static generation with hybrid rendering
- Server-side rendering for dynamic routes
- Edge functions for API endpoints
- Automatic deployments from Git

**Performance:**
- Image optimization with Sharp
- Code splitting and lazy loading
- Static asset optimization
- CDN delivery via Vercel