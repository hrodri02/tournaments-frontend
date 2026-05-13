## Why

The league schedule currently shows all games in identical cards — a matchup and a date — with no indication of whether a game has already been played, is in progress, or is yet to come. Users cannot tell at a glance which games have results without tapping into each one. Surfacing the score directly on the card for finished and live games makes the schedule useful as a standings-at-a-glance, while keeping upcoming game cards clean and uncluttered.

## What Changes

- Add a `getGameStatus` utility that classifies a `GameResponse` as `'upcoming'`, `'live'`, or `'past'` using `gameDateTime` and `durationInMinutes`.
- Update `GameExcerpt` to compute the home and away goal counts from `game.stats` and render a score row for `'live'` and `'past'` games; render nothing in that slot for `'upcoming'` games.
- Add a `LIVE` badge on the score row for in-progress games to make the live state visually distinct.
- Replace the static `"vs"` separator with a score display (`homeGoals – awayGoals`) for non-upcoming games, keeping `"vs"` only for upcoming ones.

## Capabilities

### New Capabilities

- `game-score-on-card`: Past and live games display the current/final score (`homeGoals – awayGoals`) directly on the schedule card. Upcoming games show no score.
- `live-game-indicator`: A `LIVE` badge appears on in-progress game cards.

### Modified Capabilities

- `game-excerpt-card`: The center section of the card now conditionally shows either a `"vs"` label (upcoming) or a score (live/past). No layout changes to the team-side columns.

## Impact

- **Utility added**: `utils/gameStatus.ts`
- **Component changed**: `store/leagues/GameExcerpt.tsx`
- **No API, store, or routing changes** — purely display logic
