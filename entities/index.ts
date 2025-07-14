import {User} from "@/entities/auth";

export interface Player extends User {
    position: number;
}

export interface Team {
    id: number;
    name: string;
    players: Player[];
}

export interface GameStat {
    id: number;
    type: GameStatType;
    player: Player;
    time: string;
}

export interface GameStatPayload extends GameStat {
    leagueId: number;
    gameId: number;
}

export enum GameStatType {
    goal = 'Goal',
    yellowCard = 'Yellow card',
    redCard = 'Red card'
}

export interface Game {
    id: number;
    homeTeam: Team;
    awayTeam: Team;
    address: string;
    date: string;
    stats: GameStat[];
}

export enum LeagueStatus {
    notStarted = 'not started',
    inProgress = 'in progress',
    ended = 'ended'
}

export interface League {
    id: number;
    date: string;
    name: string;
    status: LeagueStatus;
    teams: Team[];
    games: Game[];
}

export function filterStatsForTeam(stats: GameStat[], type: GameStatType, team: Team): GameStat[] {
    return stats.filter((stat) => stat.type === type && team.players.includes(stat.player) )
}

export function getGoalScorersForTeam(goalStats: GameStat[]): string {
    const playerNameToNumGoals: { [key: string]:number } = {}
    goalStats.forEach((stat) => {
        const name = stat.player.name
        if (name in playerNameToNumGoals) {
            playerNameToNumGoals[name] += 1
        }
        else {
            playerNameToNumGoals[name] = 1
        }
    })
    const playerNames: string[] = Object.keys(playerNameToNumGoals)
    let res = ''
    playerNames.forEach((name) => {
        const goals = playerNameToNumGoals[name]
        if (goals > 1) {
            res += `${name} (${goals})\n`
        }
        else {
            res += `${name}\n`
        }
    })
    return res
}

export function countStatsForTeam(stats: GameStat[], type: GameStatType, team: Team): number {
    return stats.reduce((count, stat) => {
        if (stat.type === type && team.players.includes(stat.player))
            return count += 1
        return count
    }, 0)
}

export function stringToGameStatType(typeString: string): GameStatType | undefined {
  if (typeof typeString !== 'string') {
    return undefined;
  }

  // Iterate over the values of the enum
  for (const enumValue of Object.values(GameStatType)) {
    if (enumValue === typeString) {
      return enumValue as GameStatType; // Cast back to the enum type
    }
  }
  return undefined; // Not found
}
