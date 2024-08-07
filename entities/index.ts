export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Player extends User {
    position: number;
}

export interface Team {
    name: string;
    players: Player[];
}

export interface GameStat {
    goal: number;
    player: Player;
    time: Date;
}

export interface Game {
    homeTeam: Team;
    awayTeam: Team;
    address: string;
    date: Date;
    stats: GameStat[];
}

export interface League {
    name: string;
    // This property might be better as an enum with values (open, closed, ongoing, ended)
    status: number;
    teams: Team[];
    games: Game[];
}

