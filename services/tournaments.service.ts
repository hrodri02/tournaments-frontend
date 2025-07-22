import {Platform} from 'react-native'
import {faker} from '@faker-js/faker';
import {Game, GameStat, GameStatType, League, LeagueStatus, Player, Team} from "@/entities";
import {getStorageItemAsync, TOKEN_KEY} from '@/store/auth/authStorage';

const API_URL = Platform.select({
  android: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // Android emulator
  ios: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // iOS simulator
  default: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // fallback
});

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

export const getLeagues = async (status: LeagueStatus | undefined = undefined): Promise<League[]> => {
    try {
        const jwt = await getStorageItemAsync(TOKEN_KEY)
        const url = (status) ? `${API_URL}/leagues?status=${status}` : `${API_URL}/leagues`
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        const data = await response.json()
        return data
    }
    catch (error) {
        throw error
    }
};
