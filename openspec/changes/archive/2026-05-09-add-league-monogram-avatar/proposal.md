## Why

League list and detail screens fall back to a static placeholder image when a league has no logo, which looks generic and inconsistent with the team avatar behavior introduced in the previous change. Applying the same monogram approach to leagues gives the app a consistent visual identity across both entity types.

## What Changes

- Rename `TeamMonogram` → `Monogram`: remove the "Team" prefix so the component is reusable for any named entity.
- Rename `TeamAvatar` → `Avatar`: generalize the logo-or-monogram wrapper so it works for teams and leagues alike.
- Update all existing `TeamAvatar` / `TeamMonogram` import sites to use the new names.
- Create `LeagueAvatar`: a thin wrapper (identical pattern to the old `TeamAvatar`) that uses `Avatar` for league rows and lists.
- Update `LeagueExcerpt` to render `LeagueAvatar` instead of `ImageFetcher` + static fallback.
- Update `CustomHeader` to accept an optional `name` prop; when `imageUrl` is absent and `name` is provided, render a `Monogram` instead of the static default image.
- Update the league detail and upcoming-league screens to pass `name={league.name}` to `CustomHeader` so the header shows a monogram fallback.

## Capabilities

### New Capabilities

- `league-logo-fallback`: League screens display a colored monogram (initials on hashed-color circle) whenever a league has no `logoUrl`, mirroring the existing team-logo-fallback behavior.

### Modified Capabilities

- `team-logo-fallback`: `TeamMonogram` and `TeamAvatar` are renamed to `Monogram` and `Avatar`; existing team screens are updated to import from the new names. No behavioral requirement changes.

## Impact

- **Components changed**: `TeamMonogram.tsx` → `Monogram.tsx`, `TeamAvatar.tsx` → `Avatar.tsx`, `CustomHeader.tsx`
- **Components added**: `LeagueAvatar.tsx`
- **Store components changed**: `store/leagues/LeagueExcerpt.tsx`
- **Screens changed**: `(app)/home/leagues/[id]/index.tsx`, `(app)/home/leagues/[id]/upcoming-league/index.tsx`
- **Screens using LeagueExcerpt** (indirectly affected): `(app)/home/index.tsx`, `(app)/teams/[id]/join-league/index.tsx`
- **No API or dependency changes** — purely UI/component layer
