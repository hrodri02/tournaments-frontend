export type GameStatus = 'upcoming' | 'live' | 'past';

export function getGameStatus(gameDateTime: string, durationInMinutes: number): GameStatus {
  const start = new Date(gameDateTime).getTime();
  const end = start + durationInMinutes * 60_000;
  const now = Date.now();
  if (now < start) return 'upcoming';
  if (now < end) return 'live';
  return 'past';
}
