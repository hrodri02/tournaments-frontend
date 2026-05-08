## Why

The game detail screen (`[gameId].tsx`) is the last remaining screen that uses `ImageFetcher` + `DEFAULT_IMAGES.TEAM_LOGO` for team logos, inconsistent with the matchup card and teams tab which already use `TeamAvatar`. Completing this update also allows the `TEAM_LOGO` constant to be deleted from `constants/Assets.ts`.

## What Changes

- Replace both `ImageFetcher` usages (home team and away team) with `TeamAvatar` in `src/app/(app)/home/leagues/[id]/games/[gameId].tsx`
- Remove `DEFAULT_IMAGES` import from that file (no longer needed for team logos; `FIELD_BG` and `SOCCER_BALL` are used via `DEFAULT_IMAGES` directly, so only `TEAM_LOGO` reference is dropped)
- Remove `TEAM_LOGO` entry from `constants/Assets.ts`

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `team-logo-fallback`: Extend coverage to include the game detail screen. The existing requirements apply unchanged; the scope statement needs to reflect this final render site.

## Impact

- `src/app/(app)/home/leagues/[id]/games/[gameId].tsx` — swap two `ImageFetcher` usages, remove `TEAM_LOGO` from `DEFAULT_IMAGES` import
- `constants/Assets.ts` — delete the `TEAM_LOGO` entry
- No API, dependency, or data-model changes required
