## MODIFIED Requirements

### Requirement: Question cards expose interview-ready content
Question cards SHALL display the prompt, answer content, talking points when available, follow-up prompts when available, and code examples when available.

#### Scenario: Display code-backed question
- **GIVEN** a question contains a code example
- **WHEN** the question card is rendered
- **THEN** the code example is displayed in a horizontally scrollable code block

#### Scenario: Display optional talking points
- **GIVEN** a question contains talking points
- **WHEN** the question card is rendered
- **THEN** the talking points are shown as a list

#### Scenario: Display optional follow-up prompt
- **GIVEN** a question contains a follow-up prompt
- **WHEN** the question card is rendered
- **THEN** the follow-up prompt is shown with the rest of the interview-ready content

### Requirement: Large question banks preserve rendering performance
Large question-bank pages SHALL avoid unnecessary repeated grouping work during render and SHOULD defer expensive offscreen rendering where the platform supports it.

#### Scenario: Render a large question bank
- **GIVEN** a question bank contains many long-form cards
- **WHEN** the page renders
- **THEN** category grouping is prepared outside repeated render loops or otherwise memoized

#### Scenario: Filter grouped question bank
- **GIVEN** a grouped question bank contains rich searchable fields
- **WHEN** the user searches by a field such as category, talking point, follow-up, or code content
- **THEN** filtering reuses prepared groups and returns matching question cards without recomputing category grouping in the render loop
