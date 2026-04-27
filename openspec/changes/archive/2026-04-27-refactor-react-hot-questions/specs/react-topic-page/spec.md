## ADDED Requirements

### Requirement: React page prioritizes high-frequency questions
The React topic page SHALL present a grouped high-frequency React interview question bank before auxiliary demos.

#### Scenario: Open React topic page
- **GIVEN** a user opens the React topic page
- **WHEN** the page renders
- **THEN** grouped React interview question sections are shown before the practice demos

### Requirement: React page exposes current interview topics
The React topic page SHALL include questions covering React fundamentals, Hooks, rendering internals, performance, React 18/19 APIs, state/data flow, and engineering practice.

#### Scenario: Review current React topics
- **GIVEN** a user scans the React topic page
- **WHEN** they inspect the category summaries
- **THEN** the page shows categories for fundamentals, Hooks, rendering, performance, new APIs, state/data flow, and engineering practice

### Requirement: React 19 content is runtime-aware
React 19 interview content SHALL clarify that the project runtime remains React 18.3.1 when describing APIs or behavior not used by the app.

#### Scenario: Read React 19 question
- **GIVEN** a user reads a React 19 question card
- **WHEN** the answer references React 19 APIs
- **THEN** the answer distinguishes ecosystem interview knowledge from the app runtime

### Requirement: React demos remain available
The React topic page SHALL keep existing interactive demos available as a secondary practice area.

#### Scenario: Use React demos after questions
- **GIVEN** a user has reviewed the question bank
- **WHEN** they continue down the React topic page
- **THEN** controlled input, key behavior, and memoization demos are still available
