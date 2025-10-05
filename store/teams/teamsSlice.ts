import { RootState } from "@/store/store";
import { CreateTeamRequest, CreateTeamResponse, Team } from "@/entities/index";
import { postTeam } from "@/services/tournaments.service";

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

    },
    extraReducers: (builder) => {
        builder
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

export default teamsSlice.reducer;

export const selectTeamsState = (state: RootState) => state.teams

export const {
  selectAll: selectAllTeams,
  selectById: selectTeamsById,
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