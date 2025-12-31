'use client';

import { useState, useMemo } from 'react';
import { useTodos } from '@/hooks';
import { TodoInput, TodoList, TodoSidebar } from '@/components/todo';
import { CheckCircle2, Loader2, Menu } from 'lucide-react';

export default function Home() {
  const {
    todos,
    categories,
    tags,
    isLoaded,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    addCategory,
    deleteCategory,
    addTag,
    deleteTag,
  } = useTodos();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter todos based on selection
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    if (selectedCategory) {
      filtered = filtered.filter((todo) => todo.categoryId === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter((todo) => todo.tags.includes(selectedTag));
    }

    return filtered;
  }, [todos, selectedCategory, selectedTag]);

  // Count todos by category and tag
  const todoCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    todos.forEach((todo) => {
      if (todo.categoryId) {
        counts[todo.categoryId] = (counts[todo.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [todos]);

  const todoCountByTag = useMemo(() => {
    const counts: Record<string, number> = {};
    todos.forEach((todo) => {
      todo.tags.forEach((tagId) => {
        counts[tagId] = (counts[tagId] || 0) + 1;
      });
    });
    return counts;
  }, [todos]);

  // Get title based on selection
  const getTitle = () => {
    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      return category?.name || 'Tarefas';
    }
    if (selectedTag) {
      const tag = tags.find((t) => t.id === selectedTag);
      return tag?.name || 'Tarefas';
    }
    return 'All Tasks';
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <TodoSidebar
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onSelectCategory={setSelectedCategory}
        onSelectTag={setSelectedTag}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onAddTag={addTag}
        onDeleteTag={deleteTag}
        todoCountByCategory={todoCountByCategory}
        todoCountByTag={todoCountByTag}
        totalTodos={todos.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-8 py-12 pt-16 md:pt-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-sky-400 to-sky-500 text-white shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-4xl font-semibold text-gray-900">
                {getTitle()}
              </h1>
            </div>
            <p className="text-gray-500 ml-13 pl-0.5">
              {filteredTodos.filter((t) => !t.completed).length} pending tasks
            </p>
          </header>

          {/* Todo Input */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <TodoInput
              categories={categories}
              tags={tags}
              defaultCategoryId={selectedCategory}
              onAdd={(title, categoryId, tagIds) => {
                addTodo(title, categoryId ?? selectedCategory, tagIds);
              }}
            />
          </div>

          {/* Todo List */}
          <TodoList
            todos={filteredTodos}
            categories={categories}
            tags={tags}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            onReorder={reorderTodos}
          />
        </div>
      </main>
    </div>
  );
}
