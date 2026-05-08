## Why

The teams list screen and team detail screen still use `ImageFetcher` with a static default image when a team has no logo, creating an inconsistent experience now that `TeamAvatar` (with monogram fallback) exists and is already used in matchup cards.

## What Changes

- Replace `ImageFetcher` + `DEFAULT_IMAGES.TEAM_LOGO` with `TeamAvatar` in the teams list screen (`src/app/(app)/teams/index.tsx`)
- Replace the image rendering with `TeamAvatar` in the team detail screen (`src/app/(app)/teams/[id]/index.tsx`)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `team-logo-fallback`: Extend coverage to include the teams list and team detail screens, not just matchup cards. The existing requirements apply to these new render sites without change; the spec scope statement needs to reflect the broader usage.

## Impact

- `src/app/(app)/teams/index.tsx` — swap `ImageFetcher` import and usage
- `src/app/(app)/teams/[id]/index.tsx` — swap image rendering to `TeamAvatar`
- No API, dependency, or data-model changes required
