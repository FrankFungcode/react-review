## Context

The app already uses URL query state for top-level page selection and renders question banks from static TypeScript content. Large pages are grouped by category, and some pages use browser rendering hints to reduce the cost of long content.

## Goals / Non-Goals

**Goals:**

- Let users filter visible question cards with a keyword query.
- Preserve search state in the URL.
- Keep category headings and counts coherent after filtering.
- Avoid reintroducing repeated full-array filtering in every render branch.

**Non-Goals:**

- Full-text indexing, fuzzy search, highlighting, or cross-page global search.
- Changing the question content schema.
- Adding a router library or external search dependency.

## Decisions

- Use a simple case-insensitive substring match across question prompt, category, answer fields, talking points, and code explanation fields when available.
- Use a reusable hook or helper for reading and writing search query params so future question-bank pages can share the behavior.
- Keep filtered results derived with `useMemo` from stable grouped data and the normalized search query.
- Use the query param name `q` on question-bank pages.

## Risks / Trade-offs

- URL state without a router keeps dependencies small but requires careful `history.pushState` or `replaceState` handling.
- Plain substring search is predictable and fast enough for this app, but it will not handle typos or semantic matches.
- Filtering very large long-form content can still be expensive if done on every keystroke; derived data should be memoized and input updates may be debounced later if needed.
