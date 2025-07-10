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
    time: Date;
}

export enum GameStatType {
    goal = 'goal',
    yellowCard = 'yellow card',
    redCard = 'red card'
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
    return goalStats.reduce((goalScorers, stat) => {
        return (goalScorers === '')? stat.player.name : goalScorers + ', ' + stat.player.name
    }, '')
}

export function countStatsForTeam(stats: GameStat[], type: GameStatType, team: Team): number {
    return stats.reduce((count, stat) => {
        if (stat.type === type && team.players.includes(stat.player))
            return count += 1
        return count
    }, 0)
}