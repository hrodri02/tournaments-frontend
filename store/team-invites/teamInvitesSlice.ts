import { RootState } from "@/store/store";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction
} from "@reduxjs/toolkit";

import { 
    TeamInvite, 
    TeamInviteResponse, 
} from "@/entities/index";

interface TeamInvitesState extends EntityState<TeamInvite, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: string | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const teamInvitesAdapter = createEntityAdapter<TeamInvite>();

const initialState: TeamInvitesState = teamInvitesAdapter.getInitialState({
    fetchStatus: "idle",
    fetchError: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null
});

interface UpsertManyTeamInvitesAction {
    invites: TeamInvite[];
}

const teamInvitesSlice = createSlice({
    name: "teamInvites",
    initialState,
    reducers: {
        UpsertManyTeamInvitesAction: (state, action: PayloadAction<UpsertManyTeamInvitesAction>) => {
            teamInvitesAdapter.upsertMany(state, action.payload.invites);
        },
    },
    extraReducers: (builder) => {
    }
});

export const { UpsertManyTeamInvitesAction } = teamInvitesSlice.actions;

export default teamInvitesSlice.reducer;

export const selectTeamInvitesState = (state: RootState) => state.teamInvites

export const {
  selectAll: selectAllTeamInvites,
  selectById: selectTeamInviteById,
  selectIds: selectTeamInviteIds,
} = teamInvitesAdapter.getSelectors(selectTeamInvitesState);

export const selectTeamsFetchStatus = (state: RootState) =>
    selectTeamInvitesState(state).fetchStatus;

export const selectTeamsFetchError = (state: RootState) =>
    selectTeamInvitesState(state).fetchError;

export const selectTeamsCreateStatus = (state: RootState) =>
    selectTeamInvitesState(state).createStatus;

export const selectTeamsCreateError = (state: RootState) =>
    selectTeamInvitesState(state).createError;

export const selectTeamsUpdateStatus = (state: RootState) =>
    selectTeamInvitesState(state).updateStatus;

export const selectTeamsUpdateError = (state: RootState) =>
    selectTeamInvitesState(state).updateError;

export const selectTeamsDeleteStatus = (state: RootState) =>
    selectTeamInvitesState(state).deleteStatus;

export const selectTeamsDeleteError = (state: RootState) =>
    selectTeamInvitesState(state).deleteError;