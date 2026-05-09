## MODIFIED Requirements

### Requirement: Team avatar shows logo when available
When a team has a `logoUrl`, the matchup card SHALL display that image using the existing fetch-and-display path.

#### Scenario: Logo URL is present
- **WHEN** an `Avatar` is rendered with a non-empty `logoUrl`
- **THEN** the component displays the team's logo image via `ImageFetcher`

### Requirement: Team avatar shows monogram when no logo is available
When a team has no `logoUrl`, the matchup card SHALL display a colored circle containing the team's initials instead of a generic placeholder image.

#### Scenario: Logo URL is absent
- **WHEN** an `Avatar` is rendered with an undefined or empty `logoUrl`
- **THEN** the component displays a `Monogram` (colored circle with initials)

#### Scenario: Two logo-less teams in the same card
- **WHEN** both `homeTeam` and `awayTeam` have no `logoUrl`
- **THEN** each team displays a visually distinct monogram (different colors and/or different initials) so the two sides are distinguishable

### Requirement: Teams list displays Avatar for each team
The teams list screen SHALL render an `Avatar` for each team row, showing the logo when available and a monogram when not.

#### Scenario: Team with logo in list
- **WHEN** a team in the list has a non-empty `logoUrl`
- **THEN** the row displays the team's logo image via `Avatar`

#### Scenario: Team without logo in list
- **WHEN** a team in the list has no `logoUrl`
- **THEN** the row displays a `Monogram` with the team's initials and deterministic color

### Requirement: Team detail screen displays Avatar
The team detail screen SHALL render an `Avatar` for the viewed team, showing the logo when available and a monogram when not.

#### Scenario: Team with logo on detail screen
- **WHEN** the detail screen loads for a team with a non-empty `logoUrl`
- **THEN** the screen displays the team's logo image via `Avatar`

#### Scenario: Team without logo on detail screen
- **WHEN** the detail screen loads for a team with no `logoUrl`
- **THEN** the screen displays a `Monogram` with the team's initials and deterministic color

### Requirement: Game detail screen displays Avatar for each team
The game detail screen SHALL render an `Avatar` for both the home team and the away team, showing the logo when available and a monogram when not.

#### Scenario: Team with logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has a non-empty `logoUrl`
- **THEN** the screen displays that team's logo image via `Avatar`

#### Scenario: Team without logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has no `logoUrl`
- **THEN** the screen displays a `Monogram` with the team's initials and deterministic color
