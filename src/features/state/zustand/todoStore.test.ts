import { beforeEach, describe, expect, it } from "vitest";
import { seedTodos } from "../types";
import { useZustandTodoStore } from "./todoStore";

describe("useZustandTodoStore", () => {
  beforeEach(() => {
    useZustandTodoStore.setState({ todos: seedTodos, filter: "all" });
  });

  it("adds and filters todos", () => {
    useZustandTodoStore.getState().addTodo("复习 Zustand selector");
    useZustandTodoStore.getState().setFilter("active");

    expect(useZustandTodoStore.getState().todos[0].title).toBe("复习 Zustand selector");
    expect(
      useZustandTodoStore
        .getState()
        .visibleTodos()
        .every((todo) => !todo.completed),
    ).toBe(true);
  });
});
