import { RootState } from "@/store/store";
import { 
    CreateTeamRequest, 
    TeamResponse,
    Team,
    Player,
    TeamInvite
} from "@/entities/index";
import { ErrorDetails, HttpError } from "@/entities/error";
import { upsertManyPlayers } from "@/store/players/playersSlice";
import { upsertManyTeamInvites } from "@/store/team-invites/teamInvitesSlice";
import { getTeams, postTeam, putTeam } from "@/services/tournaments.service";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector,
  PayloadAction
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/hooks/useStore";

interface TeamsState extends EntityState<Team, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: ErrorDetails | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: ErrorDetails | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: ErrorDetails | null;
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const teamsAdapter = createEntityAdapter<Team>();

const initialState: TeamsState = teamsAdapter.getInitialState({
    fetchStatus: "idle",
    fetchError: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null
});

interface UpdateTeamPayload {
    teamId: number;
    updatedTeam: CreateTeamRequest;
}

export const fetchTeams = createAppAsyncThunk(
    "teams/getTeams",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await getTeams();
            const teams = response.teams.concat(response.teamsInvitedTo);
            const playersToStore = getAllPlayersOfTeams(teams);
            if (playersToStore.length > 0) {
                // store the unique players in the players slice
                dispatch(upsertManyPlayers({ players: playersToStore }));
            }
            const invitesToStore = getAllTeamInvitesOfTeams(teams);
            if (invitesToStore.length > 0) {
                dispatch(upsertManyTeamInvites({ invites: invitesToStore }))
            }
            return response;
        }
        catch (err) {
            if (err instanceof HttpError) {
                // Here, we reject the promise with the structured error details
                // The Redux slice will store this payload under the 'rejected' action
                return rejectWithValue(err.details); 
            }
            // Handle unexpected errors (e.g., network down)
            return rejectWithValue({ errorKey: "NETWORK_UNAVAILABLE" });
        }
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const teamsFetchStatus = selectTeamsFetchStatus(thunkApi.getState());
            return teamsFetchStatus === "idle";
        },
    }
);

const getAllPlayersOfTeams = (teams: TeamResponse[]): Player[] => {
    // put the players from each team into a single player array
    let allPlayers = teams.flatMap(teamResponse => teamResponse.playerDTOs);
    const invitedPlayers = teams.flatMap(teamResponse => teamResponse.invitees || []);
    if (invitedPlayers && invitedPlayers.length > 0) {
        allPlayers = allPlayers.concat(invitedPlayers);
    }
    // create a map of id to player that contains the unique players
    const uniquePlayersMap = new Map<number, Player>();
    allPlayers.forEach(player => {
        uniquePlayersMap.set(player.id, player);
    });
    // create an array of the unique players using the map
    const playersToStore: Player[] = Array.from(uniquePlayersMap.values());
    return playersToStore;
}

const getAllTeamInvitesOfTeams = (teams: TeamResponse[]): TeamInvite[] => {
    const inviteResponses = teams.flatMap(teamResponse => teamResponse.invites || []);
    const invitesToStore = inviteResponses.map(inviteResponse => {
        const {player, ...inviteData} = inviteResponse
        const playerId = player.id
        return {playerId, ...inviteData}
    });
    return invitesToStore;
} 

export const createTeam = createAppAsyncThunk(
    "teams/createTeam",
    async (requestBody: CreateTeamRequest, { dispatch, rejectWithValue}) => {
        try {
            const team = await postTeam(requestBody);
            const inviteResponses = team.invites;
            const invitesToStore = inviteResponses.map(inviteResponse => {
                const {player, ...inviteData} = inviteResponse
                const playerId = player.id
                return {playerId, ...inviteData}
            })
            if (invitesToStore.length > 0) {
                dispatch(upsertManyTeamInvites({ invites: invitesToStore }))
            }
            return team;
        } catch (err) {
            if (err instanceof HttpError) {
                // Here, we reject the promise with the structured error details
                // The Redux slice will store this payload under the 'rejected' action
                return rejectWithValue(err.details); 
            }
            // Handle unexpected errors (e.g., network down)
            return rejectWithValue({ errorKey: "NETWORK_UNAVAILABLE" });
        }
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const teamsCreateStatus = selectTeamsCreateStatus(thunkApi.getState());
            return teamsCreateStatus === "idle";
        },
    }
);

export const updateTeamRequest = createAppAsyncThunk(
    "teams/updateTeam",
    async (payload: UpdateTeamPayload, { dispatch, rejectWithValue}) => {
        try {
            const team = await putTeam(payload.teamId, payload.updatedTeam);
            const inviteResponses = team.invites ?? [];
            const invitesToStore = inviteResponses.map(inviteResponse => {
                const {player, ...inviteData} = inviteResponse
                const playerId = player.id
                return {playerId, ...inviteData}
            })
            if (invitesToStore.length > 0) {
                dispatch(upsertManyTeamInvites({ invites: invitesToStore }))
            }
            return team;
        } catch (err) {
            console.log(err);
            if (err instanceof HttpError) {
                // Here, we reject the promise with the structured error details
                // The Redux slice will store this payload under the 'rejected' action
                return rejectWithValue(err.details); 
            }
            // Handle unexpected errors (e.g., network down)
            return rejectWithValue({ errorKey: "NETWORK_UNAVAILABLE" });
        }
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const teamUpdateStatus = selectTeamsUpdateStatus(thunkApi.getState());
            return teamUpdateStatus === "idle";
        },
    }
);

interface UpdateTeamAction {
    team: Team;
}

interface AddTeamsAction {
    teams: Team[];
}

const teamsSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {
        addTeams: (state, action: PayloadAction<AddTeamsAction>) => {
            teamsAdapter.addMany(state, action.payload.teams);
        },
        resetTeamsFetchState: (state) => {
            state.fetchStatus = 'idle';
            state.fetchError = null
        },
        resetCreateTeamState: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
        resetUpdateTeamState: (state) => {
            state.updateStatus = 'idle'
            state.updateError = null
        },
        updateTeam: (state, action: PayloadAction<UpdateTeamAction>) => {
            const updatedTeam = action.payload.team
            teamsAdapter.updateOne(state, {id: updatedTeam.id, changes: updatedTeam})
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeams.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                // map array of teams to objects that can be stored in Redux
                const response = action.payload;
                const teamResponses = response.teams;
                const teams: Team[] =
                    teamResponses.map(teamResponse => {
                        const { playerDTOs, invites, invitees, ...teamData } = teamResponse
                        const playerIds = playerDTOs.map(player => player.id)
                        const inviteeIds = (invitees)? invitees.map(player => player.id) : [];
                        return { ...teamData, playerIds, inviteeIds };
                    });
                
                const teamsInvitedToResponses = response.teams;
                const teamsInvitedTo: Team[] =
                    teamsInvitedToResponses.map(teamResponse => {
                        const { playerDTOs, invites, invitees, ...teamData } = teamResponse;
                        const playerIds = playerDTOs.map(player => player.id);
                        const inviteeIds = (invitees)? invitees.map(player => player.id) : [];
                        return { ...teamData, playerIds, inviteeIds };
                    });
                const allTeams = teams.concat(teamsInvitedTo);
                teamsAdapter.addMany(state, allTeams);
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.payload as ErrorDetails;
            })
            .addCase(createTeam.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                const { playerDTOs, invites, invitees, ...teamData } = action.payload;
                const playerIds = (playerDTOs && playerDTOs.length > 0)? playerDTOs.map(player => player.id) : []
                const inviteeIds = (invitees && invitees.length > 0)? invitees.map(invitee => invitee.id) : []
                teamsAdapter.addOne(state, {...teamData, playerIds, inviteeIds });
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.createStatus = "failed";
                state.createError = action.payload as ErrorDetails; 
            })
            .addCase(updateTeamRequest.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(updateTeamRequest.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const { playerDTOs, invites, invitees, ...teamData } = action.payload;
                const playerIds = (playerDTOs && playerDTOs.length > 0)? playerDTOs.map(player => player.id) : []
                const inviteeIds = (invitees && invitees.length > 0)? invitees.map(invitee => invitee.id) : []
                teamsAdapter.updateOne(state, {id: teamData.id, changes: {...teamData, playerIds, inviteeIds}});
            })
            .addCase(updateTeamRequest.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload as ErrorDetails; 
            })
    }
});

export const { 
    resetCreateTeamState, 
    resetTeamsFetchState, 
    updateTeam,
    addTeams,
    resetUpdateTeamState
} = teamsSlice.actions
export default teamsSlice.reducer;

export const selectTeamsState = (state: RootState) => state.teams

export const {
  selectAll: selectAllTeams,
  selectById: selectTeamById,
  selectIds: selectTeamIds,
} = teamsAdapter.getSelectors(selectTeamsState);

export const selectTeamsFetchStatus = (state: RootState) =>
    selectTeamsState(state).fetchStatus;

export const selectTeamsFetchError = (state: RootState) =>
    selectTeamsState(state).fetchError;

export const selectTeamsCreateStatus = (state: RootState) =>
    selectTeamsState(state).createStatus;

export const selectTeamsCreateError = (state: RootState) =>
    selectTeamsState(state).createError;

export const selectTeamsUpdateStatus = (state: RootState) =>
    selectTeamsState(state).updateStatus;

export const selectTeamsUpdateError = (state: RootState) =>
    selectTeamsState(state).updateError;

export const selectTeamsDeleteStatus = (state: RootState) =>
    selectTeamsState(state).deleteStatus;

export const selectTeamsDeleteError = (state: RootState) =>
    selectTeamsState(state).deleteError;


export const makeSelectTeamsByPlayerId = (id: number) =>
  createSelector([selectAllTeams], (teams) =>
    teams.filter((team) => team.playerIds.includes(id))
);

export const makeSelectTeamsByIds = (ids: number[]) =>
  createSelector([selectAllTeams], (teams) =>
    teams.filter((team) => ids.includes(team.id))
);

export const selectTeamIdToTeamMap = createSelector(
  [selectAllTeams], // Input: array of all teams
  (teams: Team[]) => {
    // Output: a Record<number, Team> map
    const teamMap: Record<number, Team> = {};
    teams.forEach(team => {
      teamMap[team.id] = team;
    });
    return teamMap;
  }
);