import { configureStore } from "@reduxjs/toolkit";
import { todosReducer } from "./todosSlice";

export const reduxStore = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
