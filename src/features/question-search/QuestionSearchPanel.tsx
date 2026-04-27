import { Search, X } from "lucide-react";

const panelClass = "rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60";
const inputClass =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export function QuestionSearchPanel({
  query,
  onQueryChange,
  resultCount,
  totalCount,
  placeholder = "Search questions",
}: {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  placeholder?: string;
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className={`${panelClass} mb-5 grid gap-2`}>
      <label className="text-sm font-extrabold text-slate-800" htmlFor="question-search">
        Search questions
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        />
        <input
          className={inputClass}
          id="question-search"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={query}
        />
        {hasQuery && (
          <button
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none"
            onClick={() => onQueryChange("")}
            title="Clear search"
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-sm leading-6 text-slate-600">
        {hasQuery ? `${resultCount} of ${totalCount} questions match` : `${totalCount} questions`}
      </p>
    </div>
  );
}

export function QuestionSearchEmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm shadow-slate-200/60">
      <p className="font-extrabold text-slate-900">No matching questions</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Try a different keyword for "{query.trim()}".
      </p>
    </div>
  );
}
