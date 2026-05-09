# Spec: League Logo Fallback

## Requirement: League avatar shows logo when available
When a league has a `logoUrl`, league list rows and the join-league screen SHALL display that image.

### Scenario: Logo URL is present in league list
- **WHEN** an `Avatar` is rendered for a league with a non-empty `logoUrl`
- **THEN** the component displays the league's logo image via `ImageFetcher`

## Requirement: League avatar shows monogram when no logo is available
When a league has no `logoUrl`, league list rows SHALL display a colored circle containing the league's initials instead of a static placeholder image.

### Scenario: Logo URL is absent in league list
- **WHEN** an `Avatar` is rendered for a league with an undefined or empty `logoUrl`
- **THEN** the component displays a `Monogram` (colored circle with initials derived from the league name)

### Scenario: Two logo-less leagues in the same list
- **WHEN** multiple leagues with no `logoUrl` appear in the same list
- **THEN** each league displays a visually distinct monogram so they are distinguishable from one another

## Requirement: League detail header shows monogram when no logo is available
The navigation header for the league detail and upcoming-league screens SHALL display a `Monogram` fallback when the league has no `logoUrl`.

### Scenario: League detail header with no logo
- **WHEN** the league detail screen loads for a league with no `logoUrl`
- **THEN** `CustomHeader` renders a `Monogram` using the league name in place of the image

### Scenario: League detail header with a logo
- **WHEN** the league detail screen loads for a league with a non-empty `logoUrl`
- **THEN** `CustomHeader` renders the league logo image (unchanged behavior)

## Requirement: CustomHeader accepts an optional name for monogram fallback
`CustomHeader` SHALL accept an optional `name` prop. When `imageUrl` is absent and `name` is provided, it SHALL render a `Monogram` rather than the static default image.

### Scenario: name provided, no imageUrl
- **WHEN** `CustomHeader` is rendered with `name` set and `imageUrl` undefined
- **THEN** a `Monogram` is displayed using the provided name

### Scenario: name not provided, no imageUrl
- **WHEN** `CustomHeader` is rendered without `name` and without `imageUrl`
- **THEN** the static `defaultSource` image is displayed (backward-compatible behavior)
