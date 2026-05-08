## Context

`GameExcerpt` renders each matchup card with two `ImageFetcher` instances, both falling back to the same static `DEFAULT_IMAGES.TEAM_LOGO` when a team has no `logoUrl`. The result is two indistinguishable placeholder images in every card where logos haven't been uploaded. `TeamResponse` has no color field, so any color must be derived client-side.

## Goals / Non-Goals

**Goals:**
- Provide distinct visual identity for logo-less teams in `GameExcerpt`
- Derive a stable, deterministic color from the team name (no backend changes)
- Keep the real logo path intact — show the actual logo when `logoUrl` is present

**Non-Goals:**
- Adding a `color` field to the API or team entity
- Applying the monogram fallback outside `GameExcerpt` (e.g., team detail headers, game detail page) — those can be follow-on work
- Letting users choose their team color

## Decisions

**1. Two focused components: `TeamMonogram` + `TeamAvatar`**

`TeamMonogram` is a pure presentational component: colored circle + initials text. It takes `name` and an optional `size`. `TeamAvatar` wraps both paths — if `logoUrl` is truthy, render `ImageFetcher`; otherwise render `TeamMonogram`. `GameExcerpt` calls `TeamAvatar` instead of `ImageFetcher` directly.

Alternatives considered:
- Extending `ImageFetcher` with an `fallbackElement` prop — would complicate a component that is already used in many places without this concern.
- A single merged component — conflates image-fetching concerns with fallback rendering; harder to test each piece.

**2. Hash-based color from team name**

A simple djb2-style hash over the team name characters, modulo a small curated palette (8–10 visually distinct, accessible colors). Same name → same color every time, no storage needed.

```
function hashColor(name: string, palette: string[]): string {
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = (h * 33) ^ name.charCodeAt(i);
  return palette[Math.abs(h) % palette.length];
}
```

Alternatives considered:
- Using `team.id % palette.length` — simpler, but IDs are server-assigned and may not be available in all contexts; name is always present.
- Random color on mount — not stable across re-renders or sessions.

**3. Initials extraction: first letter of each word, capped at 2**

`"River Plate" → "RP"`, `"Boca" → "B"`. Split on whitespace, take the first character of the first two segments. Uppercase.

## Risks / Trade-offs

- **Color collisions** — Two teams in the same game could hash to the same color from the palette. The palette should be large enough (≥8 colors) to make same-game collisions rare. Accepted: monogram text still differentiates them even if colors match.
- **Very long team names** — Initials are always 1–2 chars, so layout is stable regardless of name length.
- **Font rendering on Android** — Bold text in a `View` circle renders consistently on both platforms with RN core components; no third-party font dependency needed.

## Migration Plan

1. Add `components/TeamMonogram.tsx` and `components/TeamAvatar.tsx`.
2. Update `store/leagues/GameExcerpt.tsx` to import and use `TeamAvatar`.
3. No data migrations, no feature flags, no API changes.
4. Rollback: revert the three file changes.
