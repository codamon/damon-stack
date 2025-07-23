# Damon Stack

A modern, full-stack monorepo solution built with **Next.js 15**, **tRPC**, **Prisma**, and **Mantine 8**. This project demonstrates enterprise-grade architecture with S-level quality rating, following "decoupled data flow" principles.

## 🚀 Features

- **🏗️ Monorepo Architecture** - Turborepo-powered workspace with optimal build performance
- **🎨 Modern UI Framework** - Mantine 8 with React 19 support
- **🔒 Type-Safe APIs** - End-to-end type safety with tRPC
- **📊 Database Management** - Prisma ORM with PostgreSQL
- **🔐 Authentication** - NextAuth.js v5 with role-based access control
- **📝 Content Management** - Full-featured CMS with rich text editing
- **🔍 Search Functionality** - Advanced search with filtering and suggestions
- **📱 Responsive Design** - Mobile-first approach with multiple themes
- **⚡ Performance Optimized** - SSR, code splitting, and caching strategies

## 🏗️ Architecture

### Project Structure

```
damon-stack/
├── apps/                    # Frontend Applications
│   ├── admin-dashboard/     # 🎛️ Admin Management System
│   ├── website/             # 🌐 Main Website
│   └── blog/                # 📝 Blog Application
├── packages/                # Shared Packages
│   ├── ui/                  # 🎨 Shared UI Components
│   ├── db/                  # 📊 Database Layer (Prisma)
│   ├── shared/              # 🔧 Shared Utilities & Types
│   ├── config/              # ⚙️ Configuration Files
│   └── trpc/                # 🌐 tRPC Configuration
├── features/                # Business Logic Modules
│   ├── cms/                 # 📄 Content Management
│   └── user-management/     # 👥 User Management
└── docs/                    # 📚 Documentation
```

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- Mantine 8.1.2
- TypeScript
- PostCSS

**Backend:**
- tRPC (Type-safe APIs)
- Prisma ORM
- PostgreSQL
- NextAuth.js v5

**Development:**
- Turborepo
- pnpm Workspaces
- TSUP (Build tool)
- ESLint

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codamon/damon-stack.git
   cd damon-stack
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env.local
   
   # Configure your database URL and other environment variables
   ```

4. **Database setup**
   ```bash
   # Push database schema
   pnpm db:push
   
   # (Optional) Open Prisma Studio
   pnpm db:studio
   ```

5. **Start development servers**
   ```bash
   # Start all applications
   pnpm dev
   
   # Or start individual apps
   pnpm dev:admin     # Admin Dashboard (localhost:3000)
   pnpm dev:website   # Main Website (localhost:3001)
   pnpm dev:blog      # Blog (localhost:3002)
   ```

## 📱 Applications

### 🎛️ Admin Dashboard
**Port:** 3000  
**Features:**
- Content Management System (CMS)
- User & Role Management
- Analytics Dashboard
- Rich Text Editor
- File Upload Management

### 🌐 Main Website
**Port:** 3001  
**Features:**
- Corporate Homepage
- Product Showcase
- Contact Forms
- SEO Optimization
- Multi-theme Support

### 📝 Blog Application
**Port:** 3002  
**Features:**
- Article Listing & Detail Pages
- Category & Tag Management
- Search & Filtering
- Social Sharing
- Comment System

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev:admin        # Start admin dashboard only
pnpm dev:website      # Start website only
pnpm dev:blog         # Start blog only

# Building
pnpm build            # Build all applications
pnpm build:admin      # Build admin dashboard
pnpm build:website    # Build website
pnpm build:blog       # Build blog

# Database
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma client

# Linting & Type Checking
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages
```

### Package Management

This project uses **pnpm workspaces** for efficient dependency management:

```bash
# Install package to specific app
pnpm --filter @damon-stack/admin-dashboard add package-name

# Install package to shared package
pnpm --filter @damon-stack/ui add package-name

# Install dev dependency to root
pnpm add -D package-name -w
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` files in each app directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/damon_stack"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
```

### Database Schema

The project includes comprehensive database models:
- **Authentication** - Users, sessions, accounts
- **CMS** - Posts, categories, tags
- **Frontend Users** - Customer management
- **Search** - Search logs and suggestions

## 🏆 Architecture Quality

This project has been professionally reviewed and rated **S-Level** for:

- ✅ **Decoupled Data Flow** - Unidirectional data flow with tRPC
- ✅ **Modular Design** - High cohesion, low coupling
- ✅ **Type Safety** - End-to-end TypeScript coverage
- ✅ **Scalability** - Ready for enterprise-scale applications
- ✅ **Maintainability** - Clear separation of concerns

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- Architecture decisions and reviews
- Development best practices
- Feature implementation guides
- Troubleshooting guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [Mantine](https://mantine.dev/)
- Type-safe APIs with [tRPC](https://trpc.io/)
- Database management by [Prisma](https://prisma.io/)
- Monorepo tooling by [Turborepo](https://turbo.build/)

---

**Damon Stack** - A modern, scalable, and maintainable full-stack solution for enterprise applications.
