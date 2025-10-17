import { 
    Player,
} from "@/entities/index";
import { RootState } from "@/store/store";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
  createSelector
} from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/hooks/useStore";

interface PlayersState extends EntityState<Player, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: string | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const playersAdapter = createEntityAdapter<Player>();

const initialState: PlayersState = playersAdapter.getInitialState({
    fetchStatus: "idle",
    fetchError: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null
});

interface UpsertManyPlayersAction {
    players: Player[];
}

const playersSlice = createSlice({
    name: "players",
    initialState,
    reducers: {
        // action to handle players data from other thunks/slices
        upsertManyPlayers: (state, action: PayloadAction<UpsertManyPlayersAction>) => {
            playersAdapter.upsertMany(state, action.payload.players);
        },
    },
    extraReducers: (builder) => {

    }
});

// Export the actions
export const { upsertManyPlayers } = playersSlice.actions;

export default playersSlice.reducer;

export const selectPlayersState = (state: RootState) => state.players

export const {
  selectAll: selectAllPlayers,
  selectById: selectPlayerById,
  selectIds: selectPlayerIds,
} = playersAdapter.getSelectors(selectPlayersState);

export const selectPlayersFetchStatus = (state: RootState) =>
    selectPlayersState(state).fetchStatus;

export const selectPlayersFetchError = (state: RootState) =>
    selectPlayersState(state).fetchError;

export const selectPlayersCreateStatus = (state: RootState) =>
    selectPlayersState(state).createStatus;

export const selectPlayersCreateError = (state: RootState) =>
    selectPlayersState(state).createError;

export const selectPlayersUpdateStatus = (state: RootState) =>
    selectPlayersState(state).updateStatus;

export const selectPlayersUpdateError = (state: RootState) =>
    selectPlayersState(state).updateError;

export const selectPlayersDeleteStatus = (state: RootState) =>
    selectPlayersState(state).deleteStatus;

export const selectPlayersDeleteError = (state: RootState) =>
    selectPlayersState(state).deleteError;

export const makeSelectPlayersByIds = (ids: number[]) =>
  createSelector([selectAllPlayers], (players) =>
    players.filter((player) => ids.includes(player.id))
);