## ADDED Requirements

### Requirement: Team avatar shows logo when available
When a team has a `logoUrl`, the matchup card SHALL display that image using the existing fetch-and-display path.

#### Scenario: Logo URL is present
- **WHEN** a `TeamAvatar` is rendered with a non-empty `logoUrl`
- **THEN** the component displays the team's logo image via `ImageFetcher`

### Requirement: Team avatar shows monogram when no logo is available
When a team has no `logoUrl`, the matchup card SHALL display a colored circle containing the team's initials instead of a generic placeholder image.

#### Scenario: Logo URL is absent
- **WHEN** a `TeamAvatar` is rendered with an undefined or empty `logoUrl`
- **THEN** the component displays a `TeamMonogram` (colored circle with initials)

#### Scenario: Two logo-less teams in the same card
- **WHEN** both `homeTeam` and `awayTeam` have no `logoUrl`
- **THEN** each team displays a visually distinct monogram (different colors and/or different initials) so the two sides are distinguishable

### Requirement: Monogram initials derived from team name
The `TeamMonogram` component SHALL extract 1–2 uppercase letters from the team name: the first letter of the first word, plus the first letter of the second word if one exists.

#### Scenario: Single-word team name
- **WHEN** the team name is a single word (e.g., "Boca")
- **THEN** the monogram displays one uppercase letter ("B")

#### Scenario: Multi-word team name
- **WHEN** the team name contains multiple words (e.g., "River Plate")
- **THEN** the monogram displays two uppercase letters ("RP")

### Requirement: Monogram color is deterministic and stable
The background color of the monogram circle SHALL be derived from the team name using a hash function against a fixed palette, so the same team name always produces the same color.

#### Scenario: Same team name always gets the same color
- **WHEN** a `TeamMonogram` is rendered for a team name
- **THEN** the background color is identical across all re-renders and app sessions

#### Scenario: Different team names get different colors
- **WHEN** two teams have different names
- **THEN** the hash function SHALL produce different palette indices for a large majority of name pairs (collision rate < 1 in palette size)
