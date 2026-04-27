## Purpose

Define how repository-local agent skills and OpenSpec artifacts work together to guide AI-assisted development.

## Requirements

### Requirement: Project skills are stored with the repository
The repository SHALL store project-specific agent skills in `.agents/skills` and Codex-discoverable skills in `.codex/skills`.

#### Scenario: Agent skill discovery
- **GIVEN** an agent opens this repository
- **WHEN** it needs React, composition, or UI review guidance
- **THEN** it can find the relevant skill files inside the repository

### Requirement: Skill mirrors remain aligned
Skills that exist in both `.agents/skills` and `.codex/skills` SHALL describe the same guidance and rule set.

#### Scenario: Update a mirrored skill
- **GIVEN** a skill exists in both skill directories
- **WHEN** the skill guidance is updated
- **THEN** the equivalent project and Codex skill copies are updated together

### Requirement: OpenSpec governs product intent
OpenSpec SHALL be the source of truth for product capabilities and change intent, while skills provide implementation and review guidance.

#### Scenario: Start non-trivial work
- **GIVEN** a requested change affects behavior, structure, or workflow
- **WHEN** an agent begins planning the change
- **THEN** it checks `openspec/specs` and creates or updates an OpenSpec change before implementation
