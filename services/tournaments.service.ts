import {Platform} from 'react-native'
import {
    Game, 
    GameStat, 
    GameStatUpdatePayload, 
    League, 
    LeagueStatus, 
    GameStatBatchUpdateResponse,
    CreateTeamRequest,
    TeamResponse,
    CreateTeamInviteRequest,
    TeamInviteResponse,
    GetTeamsResponse,
    AcceptInviteResponse,
    ApplicationResponse,
    CreateApplicationRequest
} from "@/entities";
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

export const batchUpdateGameStats = async (stats: GameStatUpdatePayload[]): Promise<GameStatBatchUpdateResponse> => {
    const url = `${API_URL}/gamestats/batchUpdate`
    return httpRequest<GameStatBatchUpdateResponse>(url, 'PUT', stats)
}

export const deleteGameStat = async (id: number): Promise<GameStat> => {
    const url = `${API_URL}/gamestats/${id}`
    return httpRequest<GameStat>(url, 'DELETE')
}

export const getGames = async (): Promise<Game[]> => {
    const url = `${API_URL}/games`
    return httpRequest<Game[]>(url, 'GET')
};

export const getTeams = async (): Promise<GetTeamsResponse> => {
    const url = `${API_URL}/teams`
    return httpRequest<GetTeamsResponse>(url, 'GET')
}

export const postTeam = async (requestBody: CreateTeamRequest): Promise<TeamResponse> => {
    const url = `${API_URL}/teams`
    return httpRequest<TeamResponse>(url, 'POST', requestBody)
}

export const postTeamInvite = async (teamId: number, requestBody: CreateTeamInviteRequest): Promise<TeamInviteResponse> => {
    const url = `${API_URL}/teams/${teamId}/invites`
    return httpRequest<TeamInviteResponse>(url, 'POST', requestBody)
}

export const postRevokeTeamInvite = async (inviteId: number): Promise<TeamInviteResponse> => {
    const url = `${API_URL}/team-invites/${inviteId}/revoke`
    return httpRequest<TeamInviteResponse>(url, 'POST')
}

export const postAcceptTeamInvite = async (inviteId: number): Promise<AcceptInviteResponse> => {
    const url = `${API_URL}/team-invites/${inviteId}/accept`
    return httpRequest<AcceptInviteResponse>(url, 'POST')
}

export const postDeclineTeamInvite = async (inviteId: number): Promise<TeamInviteResponse> => {
    const url = `${API_URL}/team-invites/${inviteId}/decline`
    return httpRequest<TeamInviteResponse>(url, 'POST')
}

export const getLeagues = async (status: LeagueStatus | undefined = undefined): Promise<League[]> => {
    const url = new URL(`${API_URL}/leagues`);

    if (status) {
        url.searchParams.append('status', status);
    }
    
    return httpRequest<League[]>(url.toString(), 'GET'); 
};

export const postApplyToLeague = async (leagueId: number, requestBody: CreateApplicationRequest): Promise<ApplicationResponse> => {
    const url = `${API_URL}/leagues/${leagueId}/applications`;
    return httpRequest<ApplicationResponse>(url, 'POST', requestBody);
}

const httpRequest = async<T> (url: string, httpMethod: string, reqBody: any | undefined = undefined): Promise<T> => {
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
            body: reqBody ? JSON.stringify(reqBody) : undefined
        });

        const data: T = await response.json()
        return data
    }
    catch (error) {
        throw error
    }
}
