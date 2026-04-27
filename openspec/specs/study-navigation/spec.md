## Purpose

Define how users move between study modules, restore the selected module, and use the responsive app navigation.

## Requirements

### Requirement: Page selection is URL-addressable
The application SHALL represent the selected study module in the browser URL so users can refresh, share, and revisit the same module.

#### Scenario: Open a module URL
- **GIVEN** a user opens the app with a supported page query parameter
- **WHEN** the app initializes
- **THEN** the matching study module is shown as the active page

#### Scenario: Navigate between modules
- **GIVEN** a user is viewing any study module
- **WHEN** the user selects another module from the navigation
- **THEN** the URL updates to represent the selected module without a full page reload

### Requirement: Navigation supports responsive layouts
The application SHALL provide usable study navigation on desktop and mobile viewport sizes.

#### Scenario: Desktop navigation
- **GIVEN** a desktop viewport
- **WHEN** the user views the app shell
- **THEN** the sidebar navigation is available and the active module is visually indicated

#### Scenario: Mobile navigation
- **GIVEN** a mobile viewport
- **WHEN** the user views the app shell
- **THEN** navigation remains reachable without horizontal page overflow

### Requirement: Sidebar collapsed state is persistent
The application SHALL persist the desktop sidebar collapsed state across reloads.

#### Scenario: Restore sidebar preference
- **GIVEN** a user previously collapsed or expanded the sidebar
- **WHEN** the app reloads in a browser environment
- **THEN** the sidebar uses the stored preference
