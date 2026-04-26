import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Todo, type TodoFilter, seedTodos, visibleTodos } from "../types";

type TodosState = {
  todos: Todo[];
  filter: TodoFilter;
  status: "idle" | "loading" | "succeeded";
};

const initialState: TodosState = {
  todos: seedTodos,
  filter: "all",
  status: "idle",
};

export const loadMockTodo = createAsyncThunk("todos/loadMockTodo", async () => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return {
    id: `mock-${Date.now()}`,
    title: "异步加载：解释 createAsyncThunk",
    completed: false,
  } satisfies Todo;
});

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      state.todos.unshift({
        id: crypto.randomUUID(),
        title: action.payload,
        completed: false,
      });
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    setFilter(state, action: PayloadAction<TodoFilter>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMockTodo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadMockTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos.unshift(action.payload);
      });
  },
});

export const { addTodo, setFilter, toggleTodo } = todosSlice.actions;
export const todosReducer = todosSlice.reducer;

export function selectVisibleTodos(state: { todos: TodosState }) {
  return visibleTodos(state.todos.todos, state.todos.filter);
}
