## ADDED Requirements

### Requirement: Game detail screen displays TeamAvatar for each team
The game detail screen SHALL render a `TeamAvatar` for both the home team and the away team, showing the logo when available and a monogram when not.

#### Scenario: Team with logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has a non-empty `logoUrl`
- **THEN** the screen displays that team's logo image via `TeamAvatar`

#### Scenario: Team without logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has no `logoUrl`
- **THEN** the screen displays a `TeamMonogram` with the team's initials and deterministic color
