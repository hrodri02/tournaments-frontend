import { RootState } from "@/store/store";
import { 
    CreateTeamRequest, 
    CreateTeamResponse, 
    Team,
    GetTeamResponse,
    Player
} from "@/entities/index";
import { upsertManyPlayers } from "@/store/players/playersSlice";
import { getTeams, postTeam } from "@/services/tournaments.service";
import {
  createSlice,
  createEntityAdapter,
  EntityState
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/hooks/useStore";

interface TeamsState extends EntityState<Team, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: string | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;
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

export const fetchTeams = createAppAsyncThunk(
    "teams/getTeams",
    async (_, thunkApi): Promise<GetTeamResponse[]> => {
        const teams = await getTeams();
        // put the players from each team into a single player array
        const allPlayers = teams.flatMap(teamResponse => teamResponse.playerDTOs);
        // create a map of id to player that contains the unique players
        const uniquePlayersMap = new Map<number, Player>();
        allPlayers.forEach(player => {
            uniquePlayersMap.set(player.id, player);
        });
        // create an array of the unique players using the map
        const playersToStore: Player[] = Array.from(uniquePlayersMap.values());
        if (playersToStore.length > 0) {
            // store the unique players in the players slice
            thunkApi.dispatch(upsertManyPlayers({ players: playersToStore }));
        }
        return teams;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const teamsFetchStatus = selectTeamsFetchStatus(thunkApi.getState());
            return teamsFetchStatus === "idle";
        },
    }
);

export const createTeam = createAppAsyncThunk(
    "teams/createTeam",
    async (requestBody: CreateTeamRequest): Promise<CreateTeamResponse> => {
        const team = await postTeam(requestBody);
        return team;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const teamsCreateStatus = selectTeamsCreateStatus(thunkApi.getState());
            return teamsCreateStatus === "idle";
        },
    }
);

const teamsSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {
        resetCreateTeamState: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
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
                const teams: CreateTeamResponse[] =
                    action.payload.map(teamResponse => {
                        const { playerDTOs, ...teamData } = teamResponse
                        const playerIds = playerDTOs.map(player => player.id)
                        return { ...teamData, playerIds }
                    });
                teamsAdapter.setAll(state, teams);
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message ?? "Unknown Error";
            })
            .addCase(createTeam.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                const { invitationStatus, ...teamData } = action.payload;
                teamsAdapter.addOne(state, teamData);
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.createStatus = "failed";
                state.createError = action.error.message ?? "Unknown Error";
            })
    }
});

export const { resetCreateTeamState } = teamsSlice.actions
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