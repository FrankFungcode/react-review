## Purpose

Define the validation commands and quality gates required for code, workflow, and OpenSpec changes.

## Requirements

### Requirement: Static checks are required for code changes
Code changes SHALL pass the project static check command before being considered complete.

#### Scenario: Validate formatting and linting
- **GIVEN** code or markdown files changed
- **WHEN** the change is ready for verification
- **THEN** `npm run check` passes

### Requirement: Tests are required for behavior changes
Behavior or logic changes SHALL run the Vitest suite before being considered complete.

#### Scenario: Validate behavior
- **GIVEN** logic, state, utility, or component behavior changed
- **WHEN** the change is ready for verification
- **THEN** `npm run test` passes

### Requirement: Builds are required for page or bundle changes
Page, routing, dependency, or bundle-affecting changes SHALL pass the production build before being considered complete.

#### Scenario: Validate production build
- **GIVEN** a change affects pages, routing, lazy loading, dependencies, or build configuration
- **WHEN** the change is ready for verification
- **THEN** `npm run build` passes

### Requirement: OpenSpec artifacts are validated
OpenSpec changes and specs SHALL be validated when OpenSpec artifacts are added or modified.

#### Scenario: Validate specs and changes
- **GIVEN** files under `openspec/` changed
- **WHEN** the OpenSpec work is ready for review
- **THEN** `openspec validate --all --strict` passes
