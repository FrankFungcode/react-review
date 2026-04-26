export type TodoFilter = "all" | "active" | "completed";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export const seedTodos: Todo[] = [
  { id: "redux", title: "讲清 Redux Toolkit 数据流", completed: false },
  { id: "zustand", title: "对比 Zustand selector", completed: true },
  { id: "context", title: "准备 Context 追问", completed: false },
];

export function visibleTodos(todos: Todo[], filter: TodoFilter) {
  if (filter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (filter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}
