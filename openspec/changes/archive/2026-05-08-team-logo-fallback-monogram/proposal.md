## Why

When team logos haven't been uploaded yet, the league detail page shows two identical placeholder images side-by-side in every matchup card, making it impossible to visually distinguish the home team from the away team at a glance. A team-specific colored monogram provides instant visual differentiation without requiring any API changes.

## What Changes

- Add a `TeamMonogram` component that renders a colored circle with 1–2 letter initials derived from the team name.
- Replace the `ImageFetcher` + `DEFAULT_IMAGES.TEAM_LOGO` fallback in `GameExcerpt` with a new `TeamAvatar` component that shows the real logo when available, or the `TeamMonogram` when not.
- The monogram color is derived deterministically from the team name using a small hash against a fixed palette, so the same team always gets the same color across sessions without any backend changes.

## Capabilities

### New Capabilities

- `team-logo-fallback`: Fallback display for team images — renders a colored circle with initials when no `logoUrl` is present, used wherever a team logo is shown.

### Modified Capabilities

<!-- none -->

## Impact

- **Components added**: `components/TeamMonogram.tsx`, `components/TeamAvatar.tsx`
- **Components modified**: `store/leagues/GameExcerpt.tsx` — swap `ImageFetcher` for `TeamAvatar`
- **No API or entity changes required** — color is derived client-side from `TeamResponse.name`
- **No new dependencies** — uses only React Native core primitives (`View`, `Text`)
