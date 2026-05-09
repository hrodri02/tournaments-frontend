## Context

The app already has a `TeamMonogram` (colored-circle initials) and `TeamAvatar` (logo-or-monogram wrapper) used across team screens. League screens currently fall back to a static `default_league_logo.png` via `ImageFetcher`. The goal is to reuse the monogram pattern for leagues while eliminating the "Team"-specific naming that prevented reuse.

`CustomHeader` is used as the navigation header title for league detail and upcoming-league screens. It renders either an image or a static default image — it has no monogram fallback path today.

## Goals / Non-Goals

**Goals:**
- Rename `TeamMonogram` → `Monogram` and `TeamAvatar` → `Avatar` to make both components entity-agnostic.
- Update `LeagueExcerpt` to use `Avatar` (with monogram fallback) instead of `ImageFetcher` + static default.
- Update `CustomHeader` to render a `Monogram` fallback when `imageUrl` is absent and a `name` prop is provided.
- Update league detail screens to pass `name` to `CustomHeader`.
- Update all existing `TeamAvatar` / `TeamMonogram` import sites to the new names.

**Non-Goals:**
- Changing the monogram color palette, hash algorithm, or initials logic.
- Adding animated transitions or skeleton loaders.
- Changing team-related behavior — only the component names change for teams.

## Decisions

### Rename rather than alias
Rename `TeamMonogram.tsx` → `Monogram.tsx` and `TeamAvatar.tsx` → `Avatar.tsx` (exporting `Monogram` and `Avatar` respectively) rather than keeping the old files and re-exporting. A clean rename avoids two source-of-truth files and makes the intent clear.

*Alternative considered*: Keep `TeamMonogram` / `TeamAvatar` and create separate `Monogram` / `Avatar` that delegate to them. Rejected — creates unnecessary indirection and two files to maintain per component.

### No separate `LeagueAvatar` wrapper
Use `Avatar` directly in `LeagueExcerpt` and other league contexts rather than creating a `LeagueAvatar` re-export. `Avatar` is already fully generic (`logoUrl`, `name`, `size`); an extra wrapper would add a file with zero new logic.

*Alternative considered*: Create `LeagueAvatar.tsx` mirroring the old `TeamAvatar` pattern. Rejected — pure boilerplate with no added capability.

### Extend `CustomHeader` with optional `name` prop
Add `name?: string` to `CustomHeader`. When `imageUrl` is falsy and `name` is provided, render `Monogram` at the same 40×40 size. When `imageUrl` is falsy and `name` is absent, keep the existing `defaultSource` static image fallback. This is backward-compatible — callers that don't pass `name` see no change.

*Alternative considered*: Replace `defaultSource` entirely with a required `name` prop. Rejected — breaks existing callers and removes the ability to use a static image fallback where desired.

### `LeagueExcerpt` image size consistency
`LeagueExcerpt` currently hard-codes 36×36 for the league image. `Avatar` will receive the same value via the existing `imageSideLength` prop (defaulting to 36), keeping visual parity.

## Risks / Trade-offs

- **Import churn**: Every file that imports `TeamAvatar` or `TeamMonogram` must be updated. Low risk (small, contained set of files), but easy to miss one. → Mitigation: grep for all usages before opening PRs.
- **`CustomHeader` backward compatibility**: Passing `name` is optional; existing callers that omit it are unaffected. → No mitigation needed beyond keeping the prop optional.
