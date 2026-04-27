import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { InterviewSection } from "../../content/interviewData";
import {
  QuestionSearchEmptyState,
  QuestionSearchPanel,
} from "../question-search/QuestionSearchPanel";
import { questionMatchesSearch, useQuestionSearchQuery } from "../question-search/search";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  addTodo,
  loadMockTodo,
  selectVisibleTodos,
  setFilter,
  toggleTodo,
} from "./redux/todosSlice";
import type { TodoFilter } from "./types";
import { useZustandTodoStore } from "./zustand/todoStore";

const filters: TodoFilter[] = ["all", "active", "completed"];
const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const inputClass =
  "min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-900 transition hover:bg-slate-300";
const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 font-extrabold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70";

export function StatePage({ section }: { section?: InterviewSection }) {
  const [query, setQuery] = useQuestionSearchQuery();
  const questions = section?.questions ?? [];
  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) =>
        questionMatchesSearch(
          [question.question, question.shortAnswer, question.detail, question.followUp],
          query,
        ),
      ),
    [query, questions],
  );

  return (
    <section className="py-3 sm:py-6">
      <div className="mb-5 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          state management
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          {section?.title}
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">{section?.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReduxTodoDemo />
        <ZustandTodoDemo />
      </div>

      <article className={`${cardClass} mt-5 p-4 sm:p-5`}>
        <h2 className="text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
          Redux Toolkit vs Zustand 面试对比
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <span className="rounded-lg bg-slate-100 p-3 leading-7 text-slate-700">
            学习成本：Redux 概念更多，Zustand API 更少。
          </span>
          <span className="rounded-lg bg-slate-100 p-3 leading-7 text-slate-700">
            样板代码：Redux Toolkit 已大幅减少，Zustand 仍更轻。
          </span>
          <span className="rounded-lg bg-slate-100 p-3 leading-7 text-slate-700">
            生态调试：Redux DevTools、middleware、规范更成熟。
          </span>
          <span className="rounded-lg bg-slate-100 p-3 leading-7 text-slate-700">
            适用场景：复杂团队协作偏 Redux，中小型状态偏 Zustand。
          </span>
        </div>
      </article>

      <div className="mt-5 grid gap-4">
        <QuestionSearchPanel
          query={query}
          onQueryChange={setQuery}
          resultCount={filteredQuestions.length}
          totalCount={questions.length}
        />
        {filteredQuestions.map((question) => (
          <article className={`${cardClass} p-4 sm:p-5`} key={question.question}>
            <h2 className="text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
              {question.question}
            </h2>
            <p className="mt-3 border-l-4 border-sky-500 pl-3 font-bold leading-7 text-slate-800">
              {question.shortAnswer}
            </p>
            <p className="mt-3 leading-7 text-slate-600">{question.detail}</p>
            <div className="mt-4 grid gap-1 border-t border-slate-200 pt-4 text-slate-600">
              <strong className="text-slate-800">常见追问</strong>
              <span className="leading-7">{question.followUp}</span>
            </div>
          </article>
        ))}
        {query.trim() && filteredQuestions.length === 0 && (
          <QuestionSearchEmptyState query={query} />
        )}
      </div>
    </section>
  );
}

function ReduxTodoDemo() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectVisibleTodos);
  const filter = useAppSelector((state) => state.todos.filter);
  const status = useAppSelector((state) => state.todos.status);
  const [title, setTitle] = useState("");

  function submitTodo() {
    if (!title.trim()) {
      return;
    }
    dispatch(addTodo(title.trim()));
    setTitle("");
  }

  return (
    <article className={`${cardClass} grid content-start gap-3 p-4 sm:p-5`}>
      <h2 className="text-lg font-extrabold text-slate-900">Redux Toolkit Todo</h2>
      <TodoComposer title={title} onTitleChange={setTitle} onSubmit={submitTodo} />
      <FilterTabs active={filter} onChange={(nextFilter) => dispatch(setFilter(nextFilter))} />
      <button
        className={secondaryButtonClass}
        disabled={status === "loading"}
        onClick={() => dispatch(loadMockTodo())}
        type="button"
      >
        {status === "loading" && <Loader2 aria-hidden="true" className="animate-spin" size={16} />}
        加载异步 Todo
      </button>
      <TodoList todos={todos} onToggle={(id) => dispatch(toggleTodo(id))} />
    </article>
  );
}

function ZustandTodoDemo() {
  const todos = useZustandTodoStore((state) => state.visibleTodos());
  const filter = useZustandTodoStore((state) => state.filter);
  const addTodoToStore = useZustandTodoStore((state) => state.addTodo);
  const toggleTodoInStore = useZustandTodoStore((state) => state.toggleTodo);
  const setFilterInStore = useZustandTodoStore((state) => state.setFilter);
  const [title, setTitle] = useState("");

  function submitTodo() {
    if (!title.trim()) {
      return;
    }
    addTodoToStore(title.trim());
    setTitle("");
  }

  return (
    <article className={`${cardClass} grid content-start gap-3 p-4 sm:p-5`}>
      <h2 className="text-lg font-extrabold text-slate-900">Zustand Todo</h2>
      <TodoComposer title={title} onTitleChange={setTitle} onSubmit={submitTodo} />
      <FilterTabs active={filter} onChange={setFilterInStore} />
      <TodoList todos={todos} onToggle={toggleTodoInStore} />
    </article>
  );
}

function TodoComposer({
  title,
  onTitleChange,
  onSubmit,
}: {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_40px]">
      <input
        aria-label="todo 标题"
        className={inputClass}
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
        placeholder="添加复习任务"
      />
      <button className={iconButtonClass} onClick={onSubmit} title="添加" type="button">
        <Plus aria-hidden="true" size={18} />
      </button>
    </div>
  );
}

function FilterTabs({
  active,
  onChange,
}: {
  active: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}) {
  return (
    <div className="grid grid-cols-3 rounded-lg bg-slate-200 p-1" role="tablist">
      {filters.map((filter) => (
        <button
          aria-selected={active === filter}
          className={`min-h-9 rounded-md px-2 text-sm font-extrabold transition ${
            active === filter
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
          }`}
          key={filter}
          onClick={() => onChange(filter)}
          role="tab"
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function TodoList({
  todos,
  onToggle,
}: {
  todos: Array<{ id: string; title: string; completed: boolean }>;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="grid gap-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <label className="grid min-h-11 grid-cols-[20px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-slate-200 p-3 font-semibold text-slate-700">
            <input
              className="h-4 w-4 accent-emerald-700"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              type="checkbox"
            />
            <span className="min-w-0 break-words">{todo.title}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
