import { getGameStats, postGameStat, batchUpdateGameStats, deleteGameStat } from "@/services/tournaments.service";
import { GameStat, GameStatUpdatePayload, GameStatUpdateFailure } from "@/entities/index";
import { RootState } from "@/store/store";

import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector
} from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/hooks/useStore";

// Define the shape of our game stats state
interface GameStatsState extends EntityState<GameStat, number> {
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  batchUpdateSuccesses: GameStat[];
  batchUpdateFailures: GameStatUpdateFailure[] | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const gameStatsAdapter = createEntityAdapter<GameStat>();

// Initial state using the adapter
const initialState: GameStatsState = gameStatsAdapter.getInitialState({
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  batchUpdateSuccesses: [],
  batchUpdateFailures: null,
  deleteStatus: "idle",
  deleteError: null
});

// Thunk for async fetching game stats
export const fetchGameStats = createAppAsyncThunk(
  "gameStats/fetchGameStats",
  async () => {
    const gameStats = await getGameStats();
    return gameStats;
  },
  {
      // Only fetch if the current status is idle
      condition(arg, thunkApi) {
        const gameStatsStatus = selectGameStatsFetchStatus(thunkApi.getState());
        return gameStatsStatus === "idle";
      },
  }
);

// Thunk for async creating game stats
export const createGameStat = createAppAsyncThunk(
  "gameStats/createGameStat",
  async (stat: any) => {
    const gameStat = await postGameStat(stat);
    return gameStat;
  },
  {
      // Only fetch if the current status is idle
      condition(arg, thunkApi) {
        const gameStatsCreateStatus = selectGameStatsCreateStatus(thunkApi.getState());
        return gameStatsCreateStatus === "idle";
      },
  }
);

// Thunk for async updating game stats
export const updateGameStats = createAppAsyncThunk(
  "gameStats/updateGameStats",
  async (stats: GameStatUpdatePayload[]) => {
    const response = await batchUpdateGameStats(stats);
    return response;
  },
  {
      // Only fetch if the current status is idle
      condition(arg, thunkApi) {
        const updateStatus = selectGameStatsUpdateStatus(thunkApi.getState());
        return updateStatus === "idle";
      },
  }
);

// Thunk for async deleting game stats
export const deleteGameStatFromStore = createAppAsyncThunk(
  "gameStats/deleteGameStat",
  async (statId: number) => {
    const gameStat = await deleteGameStat(statId);
    return gameStat;
  },
  {
      // Only fetch if the current status is idle
      condition(arg, thunkApi) {
        const deleteStatus = selectGameStatsDeleteStatus(thunkApi.getState());
        return deleteStatus === "idle";
      },
  }
);

// Slice definition
const gameStatsSlice = createSlice({
  name: "gameStats",
  initialState,
  reducers: {
    resetCreateGameStatStatus: (state) => {
      state.createStatus = 'idle'
      state.createError = null
    },
    resetDeleteGameStatStatus: (state) => {
      state.deleteStatus = 'idle'
      state.deleteError = null
    },
    resetUpdateGameStatStatus: (state) => {
      state.updateStatus = 'idle'
      state.updateError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameStats.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        gameStatsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.error.message ?? "Unknown Error";
      })
      .addCase(createGameStat.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createGameStat.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        gameStatsAdapter.addOne(state, action.payload);
      })
      .addCase(createGameStat.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.error.message ?? "Unknown Error";
      })
      .addCase(updateGameStats.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateGameStats.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const { successfulUpdates, failures } = action.payload;
        state.batchUpdateFailures = failures

        const updates = successfulUpdates.map(stat => ({
            id: stat.id,
            changes: stat // 'changes' property contains the full object
        }));
        gameStatsAdapter.updateMany(state, updates)
      })
      .addCase(updateGameStats.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.error.message ?? "Unknown Error";
        state.batchUpdateFailures = null;
      })
      .addCase(deleteGameStatFromStore.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteGameStatFromStore.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        gameStatsAdapter.removeOne(state, action.payload.id);
      })
      .addCase(deleteGameStatFromStore.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.error.message ?? "Unknown Error";
      });
  },
});

export const { resetCreateGameStatStatus, resetDeleteGameStatStatus, resetUpdateGameStatStatus } = gameStatsSlice.actions
export default gameStatsSlice.reducer;

//
// --- Selectors ---
//

// Base state selector
export const selectGameStatsState = (state: RootState) => state.gameStats

// Entity adapter selectors
export const {
  selectAll: selectAllGameStats,
  selectById: selectGameStatsById,
  selectIds: selectGameStatsIds,
} = gameStatsAdapter.getSelectors(selectGameStatsState);

// game stats status and error
export const selectGameStatsFetchStatus = (state: RootState) =>
  selectGameStatsState(state).fetchStatus;

export const selectGameStatsFetchError = (state: RootState) =>
  selectGameStatsState(state).fetchError;

// game stat create status and error
export const selectGameStatsCreateStatus = (state: RootState) =>
  selectGameStatsState(state).createStatus

export const selectGameStatsCreateError = (state: RootState) =>
  selectGameStatsState(state).createError

// game stat update status and error 
export const selectGameStatsUpdateStatus = (state: RootState) =>
  selectGameStatsState(state).updateStatus

export const selectGameStatsUpdateError = (state: RootState) =>
  selectGameStatsState(state).updateError

export const selectBatchUpdateFailures = (state: RootState) =>
  selectGameStatsState(state).batchUpdateFailures;

// game stat state delete status and error
export const selectGameStatsDeleteStatus = (state: RootState) =>
  selectGameStatsState(state).deleteStatus

export const selectGameStatsDeleteError = (state: RootState) =>
  selectGameStatsState(state).deleteError

// Memoized selector factory to filter games by leagueId
export const makeSelectGameStatsByGameId = (gameId: number) =>
  createSelector([selectAllGameStats], (games) =>
    games.filter((game) => game.gameId === gameId)
);