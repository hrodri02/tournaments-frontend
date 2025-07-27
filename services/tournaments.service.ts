import {Platform} from 'react-native'
import {Game, GameStat, League, LeagueStatus} from "@/entities";
import {getStorageItemAsync, TOKEN_KEY} from '@/store/auth/authStorage';

const API_URL = Platform.select({
  android: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // Android emulator
  ios: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // iOS simulator
  default: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // fallback
});

export const postGameStat = async (stat: any): Promise<GameStat> => {
    const url = `${API_URL}/gamestats`
    return httpRequest(url, 'POST', stat)
}

export const getGameStats = async (): Promise<GameStat[]> => {
    const url = `${API_URL}/gamestats`
    return httpRequest<GameStat[]>(url, 'GET')
}

export const getGames = async (): Promise<Game[]> => {
    const url = `${API_URL}/games`
    return httpRequest<Game[]>(url, 'GET')
};

export const getLeagues = async (status: LeagueStatus | undefined = undefined): Promise<League[]> => {
    const url = new URL(`${API_URL}/leagues`);

    if (status) {
        url.searchParams.append('status', status);
    }
    
    return httpRequest<League[]>(url.toString(), 'GET'); 
};

const httpRequest = async<T> (url: string, httpMethod: string, resBody: any | undefined = undefined): Promise<T> => {
    try {
        const jwt = await getStorageItemAsync(TOKEN_KEY)

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }

        const response = await fetch(url, {
            method: httpMethod,
            headers: headers,
            body: resBody ? JSON.stringify(resBody) : undefined
        });

        const data: T = await response.json()
        return data
    }
    catch (error) {
        throw error
    }
}
