import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/hooks/useStore";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
  createSelector
} from "@reduxjs/toolkit";
import { 
    TeamInvite,
    CreateTeamInviteRequest, 
    TeamInviteStatus, 
} from "@/entities/index";
import { ErrorDetails, HttpError } from "@/entities/error";
import { 
    postTeamInvite, 
    postRevokeTeamInvite, 
    postAcceptTeamInvite,
    postDeclineTeamInvite
} from "@/services/tournaments.service"
import { addPlayer } from '@/store/players/playersSlice';

interface TeamInvitesState extends EntityState<TeamInvite, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: ErrorDetails | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: ErrorDetails | null;
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

interface CreateTeamInvitePayload {
    teamId: number;
    requestBody: CreateTeamInviteRequest;
}

export const createTeamInvite = createAppAsyncThunk(
    "teamInvites/createTeamInvite",
    async (payload: CreateTeamInvitePayload, { dispatch, rejectWithValue }) => {
        try {
            const { teamId, requestBody } = payload;
            const teamInvite = await postTeamInvite(teamId, requestBody);
            const { player } = teamInvite
            dispatch(addPlayer({player: player}))
            return teamInvite;
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
            const teamInvitesCreateStatus = selectTeamInvitesCreateStatus(thunkApi.getState());
            return teamInvitesCreateStatus === "idle";
        },
    }
);

export const revokeTeamInvite = createAppAsyncThunk(
    "teamInvites/revokeTeamInvite",
    async (inviteId: number, { rejectWithValue }) => {
        try {
            const teamInvite = await postRevokeTeamInvite(inviteId);
            return teamInvite;
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
            const teamInvitesUpdateStatus = selectTeamInvitesUpdateStatus(thunkApi.getState());
            return teamInvitesUpdateStatus === "idle";
        },
    }
);

export const acceptTeamInvite = createAppAsyncThunk(
    "teamInvites/acceptTeamInvite",
    async (inviteId: number, { rejectWithValue }) => {
        try {
            const response = await postAcceptTeamInvite(inviteId);
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
            const teamInvitesUpdateStatus = selectTeamInvitesUpdateStatus(thunkApi.getState());
            return teamInvitesUpdateStatus === "idle";
        },
    }
);

export const declineTeamInvite = createAppAsyncThunk(
    "teamInvites/declineTeamInvite",
    async (inviteId: number, { rejectWithValue }) => {
        try {
            const teamInvite = await postDeclineTeamInvite(inviteId);
            return teamInvite;
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
            const teamInvitesUpdateStatus = selectTeamInvitesUpdateStatus(thunkApi.getState());
            return teamInvitesUpdateStatus === "idle";
        },
    }
);

const teamInvitesSlice = createSlice({
    name: "teamInvites",
    initialState,
    reducers: {
        resetCreateTeamInviteStatus: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
        upsertManyTeamInvites: (state, action: PayloadAction<UpsertManyTeamInvitesAction>) => {
            teamInvitesAdapter.upsertMany(state, action.payload.invites);
        },
        resetUpdateTeamInivteStatus: (state) => {
            state.updateStatus = 'idle',
            state.updateError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTeamInvite.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createTeamInvite.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                const teamInviteResponse = action.payload
                const {player, ...teamInviteData} = teamInviteResponse
                const playerId = player.id
                const inviteToStore = { playerId, ...teamInviteData }
                teamInvitesAdapter.addOne(state, inviteToStore);
            })
            .addCase(createTeamInvite.rejected, (state, action) => {
                state.createStatus = "failed";
                state.createError = action.payload as ErrorDetails;
            })
            .addCase(revokeTeamInvite.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(revokeTeamInvite.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const teamInviteResponse = action.payload
                teamInvitesAdapter.removeOne(state, teamInviteResponse.id)
            })
            .addCase(revokeTeamInvite.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload as ErrorDetails;
            })
            .addCase(acceptTeamInvite.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(acceptTeamInvite.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const response = action.payload;
                const teamInviteResponse = response.teamInvite
                const {player, ...teamIniviteData} = teamInviteResponse;
                const playerId = player.id;
                const teamInvite = {playerId, ...teamIniviteData};
                teamInvitesAdapter.updateOne(state, {id: teamInvite.id, changes: teamInvite});
            })
            .addCase(acceptTeamInvite.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload as ErrorDetails;
            })
            .addCase(declineTeamInvite.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(declineTeamInvite.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const teamInviteResponse = action.payload
                teamInvitesAdapter.removeOne(state, teamInviteResponse.id)
            })
            .addCase(declineTeamInvite.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload as ErrorDetails;
            })
    }
});

export const { 
    resetCreateTeamInviteStatus, 
    upsertManyTeamInvites, 
    resetUpdateTeamInivteStatus 
} = teamInvitesSlice.actions;

export default teamInvitesSlice.reducer;

export const selectTeamInvitesState = (state: RootState) => state.teamInvites

export const {
  selectAll: selectAllTeamInvites,
  selectById: selectTeamInviteById,
  selectIds: selectTeamInviteIds,
} = teamInvitesAdapter.getSelectors(selectTeamInvitesState);

export const selectTeamInvitesFetchStatus = (state: RootState) =>
    selectTeamInvitesState(state).fetchStatus;

export const selectTeamInvitesFetchError = (state: RootState) =>
    selectTeamInvitesState(state).fetchError;

export const selectTeamInvitesCreateStatus = (state: RootState) =>
    selectTeamInvitesState(state).createStatus;

export const selectTeamInvitesCreateError = (state: RootState) =>
    selectTeamInvitesState(state).createError;

export const selectTeamInvitesUpdateStatus = (state: RootState) =>
    selectTeamInvitesState(state).updateStatus;

export const selectTeamInvitesUpdateError = (state: RootState) =>
    selectTeamInvitesState(state).updateError;

export const selectTeamInvitesDeleteStatus = (state: RootState) =>
    selectTeamInvitesState(state).deleteStatus;

export const selectTeamInvitesDeleteError = (state: RootState) =>
    selectTeamInvitesState(state).deleteError;

export const makeSelectInviteByPlayerIdOrTeamId = 
    (teamId: number | undefined = undefined, 
    playerId: number | undefined = undefined,
    status: TeamInviteStatus) =>
    createSelector([selectAllTeamInvites], (invites) => invites.filter((invite) =>
        (!teamId || invite.teamId === teamId) &&
        (!playerId || invite.playerId === playerId) &&
        status === invite.status
    )
);