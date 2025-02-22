import {faker} from '@faker-js/faker';
import {Game, GameStat, GameStatType, League, LeagueStatus, Player, Team} from "@/entities";

const generateMockPlayers = (count: number): Player[] => {
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        position: faker.number.int({min: 1, max: 11})
    }));
};

const generateMockTeams = (count: number, playersPerTeam: number): Team[] => {
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        name: faker.company.name(),
        players: generateMockPlayers(playersPerTeam)
    }));
};

const generateMockGameStats = (players: Player[], count: number): GameStat[] => {
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        type: faker.helpers.enumValue(GameStatType),
        player: players[faker.number.int({min: 0, max: players.length - 1})],
        time: faker.date.past().toISOString()
    }));
};

const generateMockGames = (teams: Team[], count: number): Game[] => {
    const homeTeam = teams[faker.number.int({min: 0, max: teams.length - 1})];
    const awayTeam = teams[faker.number.int({min: 0, max: teams.length - 1})];
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        date: faker.date.future().toISOString(),
        address: faker.location.streetAddress(),
        stats: generateMockGameStats(homeTeam.players.concat(awayTeam.players), 5)
    }));
};

const generateMockLeagues = (count: number, teamsPerLeague: number, gamesPerLeague: number): League[] => {
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        name: faker.company.name(),
        date: faker.date.future().toISOString(),
        status: faker.helpers.enumValue(LeagueStatus), 
        teams: generateMockTeams(teamsPerLeague, 15),
        games: generateMockGames(generateMockTeams(teamsPerLeague, 15), gamesPerLeague)
    }));
};

const mockPlayers = generateMockPlayers(50);
const mockTeams = generateMockTeams(10, 15);
const mockGames = generateMockGames(mockTeams, 20);
const mockLeagues = generateMockLeagues(5, 10, 20);

export const getPlayers = async (): Promise<Player[]> => {
    return mockPlayers;
};

export const getTeams = async (): Promise<Team[]> => {
    return mockTeams;
};

export const getGames = async (): Promise<Game[]> => {
    return mockGames;
};

export const getLeagues = async (): Promise<League[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(mockLeagues), 2000);
    });
};
