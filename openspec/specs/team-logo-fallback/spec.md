# Spec: Team Logo Fallback

## Requirement: Team avatar shows logo when available
When a team has a `logoUrl`, the matchup card SHALL display that image using the existing fetch-and-display path.

### Scenario: Logo URL is present
- **WHEN** a `TeamAvatar` is rendered with a non-empty `logoUrl`
- **THEN** the component displays the team's logo image via `ImageFetcher`

## Requirement: Team avatar shows monogram when no logo is available
When a team has no `logoUrl`, the matchup card SHALL display a colored circle containing the team's initials instead of a generic placeholder image.

### Scenario: Logo URL is absent
- **WHEN** a `TeamAvatar` is rendered with an undefined or empty `logoUrl`
- **THEN** the component displays a `TeamMonogram` (colored circle with initials)

### Scenario: Two logo-less teams in the same card
- **WHEN** both `homeTeam` and `awayTeam` have no `logoUrl`
- **THEN** each team displays a visually distinct monogram (different colors and/or different initials) so the two sides are distinguishable

## Requirement: Monogram initials derived from team name
The `TeamMonogram` component SHALL extract 1–2 uppercase letters from the team name: the first letter of the first word, plus the first letter of the second word if one exists.

### Scenario: Single-word team name
- **WHEN** the team name is a single word (e.g., "Boca")
- **THEN** the monogram displays one uppercase letter ("B")

### Scenario: Multi-word team name
- **WHEN** the team name contains multiple words (e.g., "River Plate")
- **THEN** the monogram displays two uppercase letters ("RP")

## Requirement: Monogram color is deterministic and stable
The background color of the monogram circle SHALL be derived from the team name using a hash function against a fixed palette, so the same team name always produces the same color.

### Scenario: Same team name always gets the same color
- **WHEN** a `TeamMonogram` is rendered for a team name
- **THEN** the background color is identical across all re-renders and app sessions

### Scenario: Different team names get different colors
- **WHEN** two teams have different names
- **THEN** the hash function SHALL produce different palette indices for a large majority of name pairs (collision rate < 1 in palette size)

## Requirement: Teams list displays TeamAvatar for each team
The teams list screen SHALL render a `TeamAvatar` for each team row, showing the logo when available and a monogram when not.

### Scenario: Team with logo in list
- **WHEN** a team in the list has a non-empty `logoUrl`
- **THEN** the row displays the team's logo image via `TeamAvatar`

### Scenario: Team without logo in list
- **WHEN** a team in the list has no `logoUrl`
- **THEN** the row displays a `TeamMonogram` with the team's initials and deterministic color

## Requirement: Team detail screen displays TeamAvatar
The team detail screen SHALL render a `TeamAvatar` for the viewed team, showing the logo when available and a monogram when not.

### Scenario: Team with logo on detail screen
- **WHEN** the detail screen loads for a team with a non-empty `logoUrl`
- **THEN** the screen displays the team's logo image via `TeamAvatar`

### Scenario: Team without logo on detail screen
- **WHEN** the detail screen loads for a team with no `logoUrl`
- **THEN** the screen displays a `TeamMonogram` with the team's initials and deterministic color

## Requirement: Game detail screen displays TeamAvatar for each team
The game detail screen SHALL render a `TeamAvatar` for both the home team and the away team, showing the logo when available and a monogram when not.

### Scenario: Team with logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has a non-empty `logoUrl`
- **THEN** the screen displays that team's logo image via `TeamAvatar`

### Scenario: Team without logo on game detail screen
- **WHEN** the game detail screen loads for a game where a team has no `logoUrl`
- **THEN** the screen displays a `TeamMonogram` with the team's initials and deterministic color
