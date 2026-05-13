## Context

`GameExcerpt` (`store/leagues/GameExcerpt.tsx`) renders one card per game in the league schedule. It currently shows the home team avatar/name, a static `"vs"` label, the away team avatar/name, and the formatted game date. It receives a `GameResponse` which includes `gameDateTime: string`, `durationInMinutes: number`, and `stats: GameStatResponse[]`. Goal counts are not stored directly — they are derived by counting `GameStatResponse` entries of type `GameStatType.goal` per team.

The game detail screen (`[gameId].tsx`) already derives scores this way: it filters `game.stats` by type and team, then uses `.length` as the goal count. The same pattern applies here.

## Goals / Non-Goals

**Goals:**
- Classify each game as `upcoming`, `live`, or `past` at render time using wall-clock comparison against `gameDateTime` and `durationInMinutes`.
- Show the score (`homeGoals – awayGoals`) in the center of the card for `live` and `past` games.
- Show a `LIVE` badge for in-progress games.
- Show `"vs"` in the center for `upcoming` games (no change from today).

**Non-Goals:**
- Real-time polling or live score updates — the score reflects whatever stats are in the Redux store at render time.
- Sorting or grouping games by status in the schedule list.
- Changing any card layout outside the center section.
- Server-side game state — classification is purely client-side.

## Decisions

### Single utility function `getGameStatus`
Encapsulate the classification logic in `utils/gameStatus.ts` rather than inlining it in `GameExcerpt`. This keeps the component readable and makes the logic independently testable.

```ts
type GameStatus = 'upcoming' | 'live' | 'past';

function getGameStatus(gameDateTime: string, durationInMinutes: number): GameStatus {
  const start = new Date(gameDateTime).getTime();
  const end = start + durationInMinutes * 60_000;
  const now = Date.now();
  if (now < start) return 'upcoming';
  if (now < end)   return 'live';
  return 'past';
}
```

*Alternative considered*: Inline in `GameExcerpt`. Rejected — harder to test and clutters the component.

### Score derived from `game.stats` in the component
Filter `game.stats` for `GameStatType.goal` entries matching `homeTeamId` / `awayTeamId` and use `.length`. This mirrors the existing pattern in `[gameId].tsx` and requires no store changes.

*Alternative considered*: Add a `score` selector to the games slice. Rejected — over-engineering for display-only data already available on the `GameResponse`.

### Replace `"vs"` with score in the center column
For non-upcoming games, render `homeGoals – awayGoals` where `"vs"` currently sits. This keeps the card layout stable (same three columns) while naturally conveying the result. The `LIVE` badge sits below the score on live games.

*Alternative considered*: Add a separate score row below the matchup row. Rejected — uses more vertical space and makes the card taller only for some games.

### No style changes to team-side columns
The team name and avatar layout is unchanged. Only the center section changes.

## Risks / Trade-offs

- **Stats not yet loaded**: If `game.stats` is empty for a past game (e.g., no stats were entered), the score shows `0 – 0`. This is acceptable — it accurately reflects what's in the store.
- **Clock skew / timezone**: Classification uses `Date.now()` vs `new Date(gameDateTime)`. The server stores `gameDateTime` as an ISO string; JavaScript's `Date` handles this correctly as long as the string includes a timezone offset. If the API returns naive timestamps, games near the boundary may be misclassified by a few hours. This is a pre-existing data concern, not introduced by this change.