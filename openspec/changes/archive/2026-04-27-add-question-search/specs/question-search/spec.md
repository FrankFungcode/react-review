## ADDED Requirements

### Requirement: Search filters visible questions
Question-bank pages SHALL provide a keyword search control that filters visible question cards.

#### Scenario: Matching questions remain visible
- **GIVEN** a question-bank page contains multiple question cards
- **WHEN** the user enters a keyword that matches one or more question fields
- **THEN** only matching question cards are shown

#### Scenario: Empty query restores all questions
- **GIVEN** a question-bank page is filtered by a keyword
- **WHEN** the user clears the search query
- **THEN** all questions for the current page are shown again

### Requirement: Search state is URL-backed
Question search state SHALL be represented by the `q` URL query parameter.

#### Scenario: Restore search from URL
- **GIVEN** a user opens a question-bank URL containing `q`
- **WHEN** the page initializes
- **THEN** the search input and visible questions reflect the query parameter

#### Scenario: Update URL from search input
- **GIVEN** a user is viewing a question-bank page
- **WHEN** the user changes the search input
- **THEN** the URL query parameter is updated without a full page reload

### Requirement: Search remains accessible
The search control SHALL have an accessible label and SHALL be operable with a keyboard.

#### Scenario: Use search with keyboard
- **GIVEN** focus is on the search input
- **WHEN** the user types a query
- **THEN** filtered results update without requiring pointer interaction
