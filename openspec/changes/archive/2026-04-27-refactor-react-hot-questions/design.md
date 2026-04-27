## Context

The app already has URL-addressable navigation and a shared `QuestionSearchPanel` backed by the `q` query parameter. The current React page renders three demos before a small question list from `interviewData.ts`, while longer question-bank pages such as Carbon already use grouped content and richer card fields.

## Goals / Non-Goals

**Goals:**

- Make the React page primarily a grouped high-frequency interview question bank.
- Cover current React interview hotspots: Hooks, Fiber, concurrent rendering, Suspense, React 18/19 APIs, Server Components, state boundaries, and React Compiler.
- Reuse the existing search helpers and URL behavior.
- Retain existing React demos as compact auxiliary practice.

**Non-Goals:**

- Upgrade the app runtime from React 18.3.1.
- Add new dependencies or a new router.
- Rewrite unrelated topic pages.

## Decisions

- Create `src/content/reactQuestions.ts` instead of expanding `interviewData.ts`.
  - Rationale: React questions need categories, talking points, follow-up prompts, and optional code examples, which is closer to the Carbon content model than the overview model.
  - Alternative considered: Keep using `InterviewSection.questions`; rejected because the shape is too narrow for richer topic cards.
- Precompute category groups outside render and filter derived groups with existing search helpers.
  - Rationale: This preserves the large question-bank performance pattern already required by the specs.
  - Alternative considered: Filter categories inline during JSX rendering; rejected because it repeats full-array work.
- Keep demos after the question bank.
  - Rationale: The selected page shape is “题库优先”, but the demos are still useful for explaining controlled inputs, key behavior, and memoization.
- Treat React 19 topics as ecosystem interview content.
  - Rationale: They are current interview topics, but answers must mention that this project is still on React 18.3.1.

## Risks / Trade-offs

- React 19 wording could imply the app uses React 19 -> Mitigation: add explicit copy in React 19 cards about project runtime.
- A larger page could feel dense -> Mitigation: group questions by category and add compact category summary cards.
- Search could miss important fields -> Mitigation: include category, prompt, short answer, detail, talking points, follow-up, and code in search fields.
