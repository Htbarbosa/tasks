# Tasks - Task Manager

A simple and elegant task manager inspired by Notion, built with modern web technologies.

## Features

- ✅ **Task Management** - Create, edit, complete, and delete tasks
- 🏷️ **Categories** - Organize tasks by categories (Personal, Work, Study, Health)
- 🔖 **Tags** - Add multiple tags to tasks (Urgent, Important, Later, Idea)
- 🎨 **Notion-like UI** - Clean and minimal design inspired by Notion
- 🔄 **Drag & Drop** - Reorder tasks with intuitive drag and drop
- � **Google Authentication** - Secure sign-in with Google OAuth
- ☁️ **Cloud Persistence** - Data synced to Turso database (SQLite on the edge)
- 📱 **Responsive** - Works seamlessly on all devices

## Tech Stack

- **[Next.js 16.1.1](https://nextjs.org)** - React framework with App Router
- **[React 19.2.3](https://react.dev)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling
- **[NextAuth.js 4](https://next-auth.js.org)** - Authentication (Google OAuth)
- **[Turso](https://turso.tech)** - Edge SQLite database
- **[Lucide React](https://lucide.dev)** - Beautiful icons

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth API routes
│   │   ├── data/                # User data & migration endpoint
│   │   ├── todos/               # Todo CRUD API
│   │   ├── categories/          # Category CRUD API
│   │   └── tags/                # Tag CRUD API
│   ├── login/                   # Login page
│   ├── layout.tsx               # Root layout with SessionProvider
│   ├── page.tsx                 # Main page (protected)
│   └── globals.css              # Global styles
├── components/
│   ├── todo/                    # Todo-specific components
│   │   ├── TodoInput.tsx        # Task creation form
│   │   ├── TodoItem.tsx         # Individual task item
│   │   ├── TodoList.tsx         # Task list container
│   │   └── TodoSidebar.tsx      # Sidebar with categories/tags
│   └── ui/                      # Reusable UI components
├── hooks/
│   ├── useApiTodos.ts           # API-based state management
│   ├── useTodos.ts              # Legacy localStorage hook
│   └── useLocalStorage.ts       # localStorage utility
├── lib/
│   ├── db.ts                    # Turso database client & schema
│   ├── dataStore.ts             # Database operations
│   ├── validation.ts            # Input validation & sanitization
│   └── utils.ts                 # Utility functions
├── providers/
│   └── SessionProvider.tsx      # NextAuth session context
├── types/
│   ├── todo.ts                  # TypeScript interfaces
│   ├── next-auth.d.ts           # NextAuth type extensions
│   └── css.d.ts                 # CSS module declarations
└── proxy.ts                     # Route protection (auth middleware)
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- Google Cloud Console account (for OAuth)
- Turso account (for database)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Htbarbosa/tasks-frontend.git
cd tasks-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local`:

```env
# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Turso Database (https://turso.tech)
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Create OAuth 2.0 credentials (Web application)
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### Setting up Turso

1. Install Turso CLI:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Login and create database:

```bash
turso auth login
turso db create tasks-app
turso db show tasks-app --url
turso db tokens create tasks-app
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

### Authentication

- Click "Continue with Google" on the login page
- Your data is automatically synced to the cloud
- Sign out from the user menu in the top right

### Creating Tasks

1. Type your task in the input field
2. Optionally select a category and add tags
3. Press Enter or click the Add button

### Managing Tasks

- **Complete**: Click the checkbox to mark as done
- **Edit**: Click the task text to edit inline
- **Delete**: Click the trash icon to remove
- **Reorder**: Drag tasks by the grip handle (⋮⋮)

### Filtering

- Click categories or tags in the sidebar to filter tasks
- View task counts for each category and tag
- Click "All Tasks" to see everything

## API Routes

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/data`            | Get all user data           |
| POST   | `/api/data`            | Migrate localStorage data   |
| GET    | `/api/todos`           | Get all todos               |
| POST   | `/api/todos`           | Create todo / Reorder todos |
| PUT    | `/api/todos/[id]`      | Update todo                 |
| DELETE | `/api/todos/[id]`      | Delete todo                 |
| GET    | `/api/categories`      | Get all categories          |
| POST   | `/api/categories`      | Create category             |
| DELETE | `/api/categories/[id]` | Delete category             |
| GET    | `/api/tags`            | Get all tags                |
| POST   | `/api/tags`            | Create tag                  |
| DELETE | `/api/tags/[id]`       | Delete tag                  |

## Database Schema

```sql
-- Users (tracks migration status)
users (id, email, name, migrated, created_at, updated_at)

-- Todos with position for ordering
todos (id, user_id, title, completed, category_id, position, created_at, updated_at)

-- Categories per user
categories (id, user_id, name, icon, color, created_at)

-- Tags per user
tags (id, user_id, name, color, created_at)

-- Many-to-many relation
todo_tags (todo_id, tag_id)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build and start:

```bash
npm run build
npm run start
```

## Future Enhancements

- [x] ~~Backend API integration~~
- [x] ~~User authentication~~
- [x] ~~Cloud synchronization~~
- [ ] Recurring tasks
- [ ] Due date reminders
- [ ] Dark mode
- [ ] Export/Import tasks
- [ ] Shared lists / Collaboration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Turso Documentation](https://docs.turso.tech)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT
