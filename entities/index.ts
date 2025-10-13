import {User} from "@/entities/auth";

export interface Player extends User {
    position: number;
}

export interface CreateTeamRequest {
  name: string;
  logoUrl?: string;
  createdAt: string;
  playersToInvite: string[];
}

export interface Team {
    id: number;
    name: string;
    logoUrl?: string;
    ownerId: number;
    playerIds: number[];
}

export interface CreateTeamResponse extends Team {
    invitationStatus: string;
}

export interface GameStat {
    id: number;
    gameId: number;
    type: GameStatType;
    player: Player;
    time: string;
}

export type GameStatUpdatePayload = Omit<GameStat, 'player'> & { playerId: number };

export interface GameStatPayload extends GameStat {
    leagueId: number;
    gameId: number;
}

export interface GameStatBatchUpdateResponse {
    successfulUpdates: GameStat[];
    failures: GameStatUpdateFailure[];
}

export interface GameStatUpdateFailure {
    gameStatId: number;
    message: string;
}

export enum GameStatType {
    goal = 'GOAL',
    yellowCard = 'YELLOW_CARD',
    redCard = 'RED_CARD'
}

export interface Game {
    id: number;
    leagueId: number;
    homeTeam: Team;
    awayTeam: Team;
    address: string;
    gameDateTime: string;
    durationInMinutes: number;
    stats: GameStat[];
}

export enum LeagueStatus {
    notStarted = 'NOT_STARTED',
    inProgress = 'IN_PROGRESS',
    ended = 'ENDED'
}

export interface League {
    id: number;
    startDate: string;
    durationInWeeks: number;
    name: string;
    status: LeagueStatus;
}

// TODO: rethink how whether to store players as part of team as or
// if I should store a list of player ids and add a players slice
export function filterStats(stats: GameStat[], type: GameStatType, team: Team | undefined = undefined): GameStat[] {
    return stats.filter((stat) => {
        const isPlayerInTeam = team && team.playerIds.some(playerId => playerId === stat.player.id);
        return stat.type === type && (!team || isPlayerInTeam);
    })
}

export function getGoalScorersForTeam(goalStats: GameStat[]): string {
    const playerNameToNumGoals: { [key: string]:number } = {}
    goalStats.forEach((stat) => {
        const name = `${stat.player.firstName} ${stat.player.lastName}`
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
        const isPlayerInTeam = team.playerIds.some(playerId => playerId === stat.player.id)
        if (stat.type === type && isPlayerInTeam)
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

export function isGameActive(game: Game): boolean {
    const currentTime = new Date()
    const gameStartDate = new Date(game.gameDateTime)
    const gameEndDate = new Date()
    gameEndDate.setMinutes(gameStartDate.getMinutes() + game.durationInMinutes)
    return gameStartDate <= currentTime && currentTime <= gameEndDate
}
