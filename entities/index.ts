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

