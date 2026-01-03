import { Platform } from 'react-native'
import {
    GameResponse, 
    GameStat, 
    LeagueResponse, 
    LeagueStatus, 
    GameStatBatchUpdateResponse,
    CreateTeamRequest,
    TeamResponse,
    CreateTeamInviteRequest,
    TeamInviteResponse,
    GetTeamsResponse,
    AcceptInviteResponse,
    ApplicationResponse,
    CreateApplicationRequest,
    UpdateApplicationRequest,
    CreateLeagueRequest
} from "@/entities";
import { ErrorDetails, HttpError } from '@/entities/error';
import { ACCESS_TOKEN_KEY, getStorageItemAsync } from '@/store/auth/authStorage';

const API_URL = Platform.select({
  android: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // Android emulator
  ios: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // iOS simulator
  default: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // fallback
});

const API_GATEWAY_ENPOINT = 'https://pn600vb2d8.execute-api.us-east-1.amazonaws.com/test';
const S3_BUCKET_ENDPOINT = 'https://tutor-notes-bucket.s3.amazonaws.com';

export const postGameStat = async (stat: any): Promise<GameStat> => {
    const url = `${API_URL}/gamestats`
    return httpRequest(url, 'POST', stat)
}

export const getGameStats = async (): Promise<GameStat[]> => {
    const url = `${API_URL}/gamestats`
    return httpRequest<GameStat[]>(url, 'GET')
}

export const batchUpdateGameStats = async (stats: GameStat[]): Promise<GameStatBatchUpdateResponse> => {
    const url = `${API_URL}/gamestats/batchUpdate`
    return httpRequest<GameStatBatchUpdateResponse>(url, 'PUT', stats)
}

export const deleteGameStat = async (id: number): Promise<GameStat> => {
    const url = `${API_URL}/gamestats/${id}`
    return httpRequest<GameStat>(url, 'DELETE')
}

export const getGames = async (): Promise<GameResponse[]> => {
    const url = `${API_URL}/games`
    return httpRequest<GameResponse[]>(url, 'GET')
};

export const getTeams = async (): Promise<GetTeamsResponse> => {
    const url = `${API_URL}/teams`
    return httpRequest<GetTeamsResponse>(url, 'GET')
}

export const postTeam = async (requestBody: CreateTeamRequest): Promise<TeamResponse> => {
    const url = `${API_URL}/teams`
    return httpRequest<TeamResponse>(url, 'POST', requestBody)
}

export const putTeam = async (teamId: number, requestBody: CreateTeamRequest): Promise<TeamResponse> => {
    const url = `${API_URL}/teams/${teamId}`
    return httpRequest<TeamResponse>(url, 'PUT', requestBody)
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

export const getLeagues = async (status: LeagueStatus | undefined = undefined): Promise<LeagueResponse[]> => {
    const url = new URL(`${API_URL}/leagues`);

    if (status) {
        url.searchParams.append('status', status);
    }
    
    return httpRequest<LeagueResponse[]>(url.toString(), 'GET'); 
};

export const postLeague = async (requestBody: CreateLeagueRequest): Promise<LeagueResponse> => {
    const url = `${API_URL}/leagues`;
    return httpRequest<LeagueResponse>(url, 'POST', requestBody);
}

export const putLeague = async (leagueId: number, requestBody: CreateLeagueRequest): Promise<LeagueResponse> => {
    const url = `${API_URL}/leagues/${leagueId}`;
    return httpRequest<LeagueResponse>(url, 'PUT', requestBody);
}

export const postApplyToLeague = async (leagueId: number, requestBody: CreateApplicationRequest): Promise<ApplicationResponse> => {
    const url = `${API_URL}/leagues/${leagueId}/applications`;
    return httpRequest<ApplicationResponse>(url, 'POST', requestBody);
}

export const getApplications = async(teamId: number | undefined = undefined, leagueId: number | undefined = undefined): Promise<ApplicationResponse[]> => {
    const url = new URL(`${API_URL}/applications`);
    if (teamId) {
        url.searchParams.append('teamId', String(teamId));
    }
    if (leagueId) {
        url.searchParams.append('leagueId', String(leagueId));
    }
    return httpRequest<ApplicationResponse[]>(url.toString(), 'GET');
}

export const putApplication = async (applicationId: number, requestBody: UpdateApplicationRequest): Promise<ApplicationResponse> => {
    const url = `${API_URL}/applications/${applicationId}`;
    return httpRequest<ApplicationResponse>(url, 'PUT', requestBody);
}

export async function uploadImageToS3(localFileUri: string, currentUrl: string | undefined) {
    let fileExtension = localFileUri.split('.').pop();
    let contentType = `image/${fileExtension}`;

    // --- 1. Get Presigned URL from API Gateway ---
    let signedUrlEndpoint = `${API_GATEWAY_ENPOINT}/signedURL?action=put`;
    if (currentUrl) {
        const keyWithTimestamp = currentUrl.replace(`${S3_BUCKET_ENDPOINT}/`, "");
        const index = keyWithTimestamp.indexOf("?");
        const key = keyWithTimestamp.slice(0, index);
        signedUrlEndpoint += `&key=${key}`;  
    }
    const { uploadURL, key } = await httpRequest<any>(signedUrlEndpoint, 'GET');

    if (!uploadURL) {
        throw new Error("FAILED_TO_GET_SIGNED_URL");
    }

    let blob;
    try {
        // This fetch call uses the local URI to retrieve the file data as a Blob
        const localFetchResponse = await fetch(localFileUri);
        blob = await localFetchResponse.blob();
    } catch (err) {
        throw new Error("FAILED_TO_READ_FILE");
    }

    // --- 2. Perform the PUT Upload to S3 ---
    try {
        const headers: HeadersInit = {
            "Content-Type": contentType,
        };
        const uploadResponse = await fetch(
            uploadURL, // The S3 presigned URL
            {
                method: 'PUT',
                headers: headers,
                body: blob
            }
        );

        if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
            return `${S3_BUCKET_ENDPOINT}/${key}`;
        } else {
            // Log S3 error details if available
            console.error(`Details: ${uploadResponse.body}`);
            throw new Error("S3_UPLOAD_ERROR");
        }
    } catch (error) {
        throw new Error("S3_UPLOAD_ERROR");
    }
}

const httpRequest = async<T> (
    url: string, 
    httpMethod: string,
    reqBody: any | undefined = undefined
): Promise<T> => 
{
    try {
        const jwt = await getStorageItemAsync(ACCESS_TOKEN_KEY);

        const headers: Record<string, string> = {"Content-Type": "application/json"}

        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }

        const response = await fetch(url, {
            method: httpMethod,
            headers: headers,
            body: reqBody ? JSON.stringify(reqBody) : undefined
        });

        if (!response.ok) {
            let errorData: ErrorDetails | null = null;
        
            try {
                // Read the full error body
                errorData = await response.json() as ErrorDetails;
            } catch (e) {
                // If JSON parsing fails (e.g., server returned plain text or HTML for the error)
                errorData = {
                    timestamp: new Date().toISOString(),
                    status: response.status,
                    errorKey: "INVALID_RESPONSE_BODY",
                };
            }
            
            // Throw the custom HttpError, carrying the full structured payload
            throw new HttpError(response.status, errorData);
        }

        const data: T = await response.json()
        return data
    }
    catch (error) {
        throw error
    }
}
