## ADDED Requirements

### Requirement: Teams list displays TeamAvatar for each team
The teams list screen SHALL render a `TeamAvatar` for each team row, showing the logo when available and a monogram when not.

#### Scenario: Team with logo in list
- **WHEN** a team in the list has a non-empty `logoUrl`
- **THEN** the row displays the team's logo image via `TeamAvatar`

#### Scenario: Team without logo in list
- **WHEN** a team in the list has no `logoUrl`
- **THEN** the row displays a `TeamMonogram` with the team's initials and deterministic color

### Requirement: Team detail screen displays TeamAvatar
The team detail screen SHALL render a `TeamAvatar` for the viewed team, showing the logo when available and a monogram when not.

#### Scenario: Team with logo on detail screen
- **WHEN** the detail screen loads for a team with a non-empty `logoUrl`
- **THEN** the screen displays the team's logo image via `TeamAvatar`

#### Scenario: Team without logo on detail screen
- **WHEN** the detail screen loads for a team with no `logoUrl`
- **THEN** the screen displays a `TeamMonogram` with the team's initials and deterministic color
