## 1. Add `getGameStatus` utility

- [x] 1.1 Create `utils/gameStatus.ts` exporting:
  - `type GameStatus = 'upcoming' | 'live' | 'past'`
  - `function getGameStatus(gameDateTime: string, durationInMinutes: number): GameStatus` — returns `'upcoming'` if `now < start`, `'live'` if `start <= now < end`, `'past'` otherwise

## 2. Update `GameExcerpt`

- [x] 2.1 Import `getGameStatus` from `@/utils/gameStatus` and `GameStatType` from `@/entities/index`
- [x] 2.2 Inside `GameExcerpt`, derive `status` by calling `getGameStatus(game.gameDateTime, game.durationInMinutes)`
- [x] 2.3 Compute `homeGoals` and `awayGoals` by filtering `game.stats` for `type === GameStatType.goal` and matching `player`'s team — use `game.homeTeam.id` and `game.awayTeam.id` to attribute goals
- [x] 2.4 Replace the static `<Text style={styles.vs}>vs</Text>` with a conditional:
  - `upcoming` → render `<Text style={styles.vs}>vs</Text>` (unchanged)
  - `live` or `past` → render a `<View>` containing `<Text style={styles.score}>{homeGoals} – {awayGoals}</Text>` and, for `live` only, a `<Text style={styles.liveBadge}>LIVE</Text>` below it
- [x] 2.5 Add `score` and `liveBadge` entries to `StyleSheet.create`:
  - `score`: `{ fontSize: 20, fontWeight: 'bold', color: '#111', textAlign: 'center' }`
  - `liveBadge`: `{ fontSize: 11, fontWeight: '700', color: '#fff', backgroundColor: '#e53e3e', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden', marginTop: 4, alignSelf: 'center' }`
