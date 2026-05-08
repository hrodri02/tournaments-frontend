## Context

`TeamAvatar` was introduced for matchup cards (`GameExcerpt`). The teams list (`src/app/(app)/teams/index.tsx`) and team detail (`src/app/(app)/teams/[id]/index.tsx`) still render team logos via `ImageFetcher` with `DEFAULT_IMAGES.TEAM_LOGO` as the fallback, producing an inconsistent UI.

## Goals / Non-Goals

**Goals:**
- Replace `ImageFetcher` + `DEFAULT_IMAGES.TEAM_LOGO` with `TeamAvatar` in both screens
- Consistent logo/monogram rendering everywhere a team image appears

**Non-Goals:**
- Changes to `TeamAvatar` or `TeamMonogram` internals
- Updating any other screens outside the teams tab
- Touching the image upload flow

## Decisions

**Use `TeamAvatar` directly, no wrapper** — `TeamAvatar` already accepts `logoUrl`, `name`, and `size` props matching what both screens have available. No adapter or intermediate component is needed.

**Size stays screen-determined** — each screen picks its own avatar size to fit its layout, the same way `GameExcerpt` passes `screenHeight * 0.07`.

## Risks / Trade-offs

No meaningful risks. `TeamAvatar` is already in production use in `GameExcerpt`; this change only broadens its call sites.
