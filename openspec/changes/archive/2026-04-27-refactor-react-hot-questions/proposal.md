## Why

The React topic page currently mixes a few demos with a small set of older questions, which makes it less useful as a mid/senior interview review surface. React interview focus has also shifted toward concurrent rendering, Server Components, React 19 Actions, optimistic UI, and React Compiler, so the page should present a current, searchable high-frequency question bank.

## What Changes

- Refactor the React topic page into a question-bank-first experience.
- Add a dedicated React question dataset grouped by interview topic category.
- Preserve URL-backed keyword search for React questions.
- Keep the existing React demos as a secondary practice section below the question bank.
- Include React 19 and React Compiler topics while clarifying that this project still runs React 18.3.1.

## Capabilities

### New Capabilities

- `react-topic-page`: React-specific study page structure, topic grouping, and demo placement.

### Modified Capabilities

- `question-bank`: Question-bank content gains richer React-specific category metadata and searchable fields beyond the base prompt/answer/follow-up shape.

## Impact

- Affected areas: React topic page, React question content, question search integration, tests, and OpenSpec documentation.
- No new runtime dependencies are expected.
- Navigation, existing URL page selection, and non-React topic pages remain compatible.
