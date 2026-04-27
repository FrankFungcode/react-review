## 1. Specification Setup

- [x] 1.1 Review existing `question-bank` spec and the `question-search` delta.
- [x] 1.2 Confirm search applies to React/Next question banks and long-form feature question pages.

## 2. Search State and Filtering

- [x] 2.1 Add a reusable URL-backed query helper or hook for reading and writing `q`.
- [x] 2.2 Add a shared search predicate for question-like content fields.
- [x] 2.3 Derive filtered category groups without repeated full-array filtering inside render loops.

## 3. UI Integration

- [x] 3.1 Add accessible search input controls to question-bank pages.
- [x] 3.2 Show empty-state feedback when no questions match.
- [x] 3.3 Preserve long-list rendering safeguards for large question banks.

## 4. Validation

- [x] 4.1 Add or update tests for search matching and URL restoration.
- [x] 4.2 Run `npm run check`.
- [x] 4.3 Run `npm run test`.
- [x] 4.4 Run `npm run build`.
- [x] 4.5 Run `openspec validate --all --strict`.
