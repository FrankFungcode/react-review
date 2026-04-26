import { describe, expect, it } from "vitest";
import { addTodo, selectVisibleTodos, setFilter, todosReducer, toggleTodo } from "./todosSlice";

describe("todosSlice", () => {
  it("adds and filters todos", () => {
    const added = todosReducer(undefined, addTodo("准备 React.memo 追问"));
    const filtered = todosReducer(added, setFilter("active"));

    expect(filtered.todos[0].title).toBe("准备 React.memo 追问");
    expect(selectVisibleTodos({ todos: filtered }).every((todo) => !todo.completed)).toBe(true);
  });

  it("toggles a todo", () => {
    const state = todosReducer(undefined, toggleTodo("redux"));

    expect(state.todos.find((todo) => todo.id === "redux")?.completed).toBe(true);
  });
});
