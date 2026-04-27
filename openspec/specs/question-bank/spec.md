## Purpose

Define how interview question banks organize, render, and preserve user-facing study content.
## Requirements
### Requirement: Question banks are grouped by category
The application SHALL organize question-bank content by category and display each category with its associated questions.

#### Scenario: Display categorized questions
- **GIVEN** a question bank contains categories and questions
- **WHEN** the user opens that question bank page
- **THEN** each category section shows only questions that belong to that category

### Requirement: Question cards expose interview-ready content
Question cards SHALL display the prompt, answer content, talking points when available, and code examples when available.

#### Scenario: Display code-backed question
- **GIVEN** a question contains a code example
- **WHEN** the question card is rendered
- **THEN** the code example is displayed in a horizontally scrollable code block

#### Scenario: Display optional talking points
- **GIVEN** a question contains talking points
- **WHEN** the question card is rendered
- **THEN** the talking points are shown as a list

### Requirement: Large question banks preserve rendering performance
Large question-bank pages SHALL avoid unnecessary repeated grouping work during render and SHOULD defer expensive offscreen rendering where the platform supports it.

#### Scenario: Render a large question bank
- **GIVEN** a question bank contains many long-form cards
- **WHEN** the page renders
- **THEN** category grouping is prepared outside repeated render loops or otherwise memoized

### Requirement: Question bank state is shareable when interactive controls are added
Interactive question-bank controls that affect visible results SHALL be represented in the URL when the state is useful to share or restore.

#### Scenario: Restore filtered question bank
- **GIVEN** a user opens a URL containing supported question-bank filter state
- **WHEN** the question-bank page initializes
- **THEN** the visible results reflect that URL state

#### Scenario: Preserve page selection with filters
- **GIVEN** a user is viewing a specific study module with question-bank filter state
- **WHEN** the URL is shared or refreshed
- **THEN** both the selected module and supported filter state are restored

