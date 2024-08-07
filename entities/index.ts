import {User} from "@/entities/auth.types";

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
    goal: number;
    player: Player;
    time: Date;
}

export interface Game {
    id: number;
    homeTeam: Team;
    awayTeam: Team;
    address: string;
    date: Date;
    stats: GameStat[];
}

export interface League {
    id: number;
    name: string;
    // This property might be better as an enum with values (open, closed, ongoing, ended)
    status: number;
    teams: Team[];
    games: Game[];
}

