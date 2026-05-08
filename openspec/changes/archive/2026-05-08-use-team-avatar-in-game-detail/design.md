## Context

The game detail screen renders team logos for both the home and away teams using `ImageFetcher` with `DEFAULT_IMAGES.TEAM_LOGO` as the fallback. The `TeamAvatar` component (logo + monogram fallback) has been adopted in all other team-image render sites. This is the final screen to migrate.

Additionally, `DEFAULT_IMAGES.TEAM_LOGO` in `constants/Assets.ts` will have zero remaining usages after this change and can be deleted.

## Goals / Non-Goals

**Goals:**
- Replace both `ImageFetcher` team logo usages in `[gameId].tsx` with `TeamAvatar`
- Delete `TEAM_LOGO` from `constants/Assets.ts`

**Non-Goals:**
- Changing the `FIELD_BG` or `SOCCER_BALL` constants (still in use)
- Modifying `TeamAvatar` or `TeamMonogram` internals
- Updating any league logo rendering

## Decisions

**Drop `ImageFetcher` import entirely** — after swapping the two team logo usages, `ImageFetcher` is no longer referenced in this file.

**Size stays `screenHeight * 0.1`** — the game detail shows larger team avatars than other screens; `TeamAvatar` accepts any `size` value so no layout changes are needed.

**Delete `TEAM_LOGO` from `Assets.ts` immediately** — no other file references it after this change, so there is no deprecation period needed.

## Risks / Trade-offs

No meaningful risks. `TeamAvatar` is already proven across multiple screens; this is a mechanical substitution.
