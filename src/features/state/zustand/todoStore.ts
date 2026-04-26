import { create } from "zustand";
import { type Todo, type TodoFilter, seedTodos, visibleTodos } from "../types";

type ZustandTodoState = {
  todos: Todo[];
  filter: TodoFilter;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: TodoFilter) => void;
  visibleTodos: () => Todo[];
};

export const useZustandTodoStore = create<ZustandTodoState>((set, get) => ({
  todos: seedTodos,
  filter: "all",
  addTodo: (title) =>
    set((state) => ({
      todos: [
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
        },
        ...state.todos,
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
  setFilter: (filter) => set({ filter }),
  visibleTodos: () => visibleTodos(get().todos, get().filter),
}));

export const createZustandTestStore = () => useZustandTodoStore.getState();
