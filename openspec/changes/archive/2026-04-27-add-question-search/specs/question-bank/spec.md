## MODIFIED Requirements

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
