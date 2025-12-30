export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    categoryId: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface TodoState {
    todos: Todo[];
    categories: Category[];
    tags: Tag[];
}

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'personal', name: 'Personal', icon: 'User', color: '#6366f1' },
    { id: 'work', name: 'Work', icon: 'Briefcase', color: '#f59e0b' },
    { id: 'study', name: 'Study', icon: 'BookOpen', color: '#10b981' },
    { id: 'health', name: 'Health', icon: 'Heart', color: '#ef4444' },
];

export const DEFAULT_TAGS: Tag[] = [
    { id: 'urgent', name: 'Urgent', color: '#ef4444' },
    { id: 'important', name: 'Important', color: '#f59e0b' },
    { id: 'later', name: 'Later', color: '#6b7280' },
    { id: 'idea', name: 'Idea', color: '#8b5cf6' }];