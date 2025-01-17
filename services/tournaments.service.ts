import {faker} from '@faker-js/faker';
import {Game, GameStat, GameStatType, League, Player, Team} from "@/entities";

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
        time: faker.date.past()
    }));
};

const generateMockGames = (teams: Team[], count: number): Game[] => {
    const homeTeam = teams[faker.number.int({min: 0, max: teams.length - 1})];
    const awayTeam = teams[faker.number.int({min: 0, max: teams.length - 1})];
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        address: faker.location.streetAddress(),
        date: faker.date.future(),
        stats: generateMockGameStats(homeTeam.players.concat(awayTeam.players), 5)
    }));
};

const generateMockLeagues = (count: number, teamsPerLeague: number, gamesPerLeague: number): League[] => {
    return Array.from({length: count}, (_, id) => ({
        id: id + 1,
        name: faker.company.name(),
        status: faker.number.int({min: 0, max: 3}), // 0 = open, 1 = closed, 2 = ongoing, 3 = ended, these are just some ideas
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
    return mockLeagues;
};
