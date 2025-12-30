# Tasks - Task Manager

A simple and elegant task manager inspired by Notion, built with modern web technologies.

## Features

- ✅ **Task Management** - Create, edit, complete, and delete tasks
- 🏷️ **Categories** - Organize tasks by categories (Personal, Work, Study, Health)
- 🔖 **Tags** - Add multiple tags to tasks (Urgent, Important, Later, Idea)
- 🎨 **Notion-like UI** - Clean and minimal design inspired by Notion
- 🔄 **Drag & Drop** - Reorder tasks with intuitive drag and drop
- 💾 **Local Storage** - Automatic persistence (ready for API integration)
- 📱 **Responsive** - Works seamlessly on all devices

## Tech Stack

- **[Next.js 16.1.1](https://nextjs.org)** - React framework with App Router
- **[React 19.2.3](https://react.dev)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling
- **[Lucide React](https://lucide.dev)** - Beautiful icons
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classNames utility

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/
│   ├── todo/              # Todo-specific components
│   │   ├── TodoInput.tsx  # Task creation form
│   │   ├── TodoItem.tsx   # Individual task item
│   │   ├── TodoList.tsx   # Task list container
│   │   └── TodoSidebar.tsx # Sidebar with categories and tags
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Checkbox.tsx
│       ├── Input.tsx
│       ├── TagBadge.tsx
│       └── CategoryBadge.tsx
├── hooks/
│   ├── useTodos.ts        # Main state management hook
│   └── useLocalStorage.ts # localStorage persistence hook
├── types/
│   ├── todo.ts            # TypeScript interfaces
│   └── css.d.ts           # CSS module declarations
└── lib/
    └── utils.ts           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tasks-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

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

## Customization

### Adding Categories/Tags

- Click the "+" button next to Categories or Tags in the sidebar
- Enter a name and optional color
- Custom categories and tags are saved to localStorage

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Fonts: Inter (sans-serif) and Noto Serif (headings)

## Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Recurring tasks
- [ ] Due date reminders
- [ ] Dark mode
- [ ] Export/Import tasks

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT
