import { RootState } from "@/store/store";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector,
  PayloadAction
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/hooks/useStore";
import { 
  GameStat, 
  GameStatUpdateFailure,
  Player 
} from "@/entities/index";
import { ErrorDetails, HttpError } from "@/entities/error";
import { 
  getGameStats, 
  postGameStat, 
  batchUpdateGameStats, 
  deleteGameStat 
} from "@/services/tournaments.service";
import { selectPlayerIdToPlayerMap } from "@/store/players/playersSlice";

// Define the shape of our game stats state
interface GameStatsState extends EntityState<GameStat, number> {
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: ErrorDetails | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: ErrorDetails | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: ErrorDetails | null;
  batchUpdateSuccesses: GameStat[];
  batchUpdateFailures: GameStatUpdateFailure[] | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: ErrorDetails | null;
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
  async (_, { rejectWithValue }) => {
    try {
      const gameStats = await getGameStats();
      return gameStats;
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
        const gameStatsStatus = selectGameStatsFetchStatus(thunkApi.getState());
        return gameStatsStatus === "idle";
      },
  }
);

// Thunk for async creating game stats
export const createGameStat = createAppAsyncThunk(
  "gameStats/createGameStat",
  async (stat: any, { rejectWithValue }) => {
    try {
      const gameStat = await postGameStat(stat);
      return gameStat;
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
        const gameStatsCreateStatus = selectGameStatsCreateStatus(thunkApi.getState());
        return gameStatsCreateStatus === "idle";
      },
  }
);

// Thunk for async updating game stats
export const updateGameStats = createAppAsyncThunk(
  "gameStats/updateGameStats",
  async (stats: GameStat[], { rejectWithValue }) => {
    try {
      const response = await batchUpdateGameStats(stats);
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
        const updateStatus = selectGameStatsUpdateStatus(thunkApi.getState());
        return updateStatus === "idle";
      },
  }
);

// Thunk for async deleting game stats
export const deleteGameStatFromStore = createAppAsyncThunk(
  "gameStats/deleteGameStat",
  async (statId: number, { rejectWithValue }) => {
    try {
      const gameStat = await deleteGameStat(statId);
      return gameStat;
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
        const deleteStatus = selectGameStatsDeleteStatus(thunkApi.getState());
        return deleteStatus === "idle";
      },
  }
);

interface AddGameStatsAction {
  stats: GameStat[];
}

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
    },
    addGameStats: (state, action: PayloadAction<AddGameStatsAction>) => {
      gameStatsAdapter.addMany(state, action.payload.stats);
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
        state.fetchError = action.payload as ErrorDetails;
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
        state.createError = action.payload as ErrorDetails;
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
        state.updateError = action.payload as ErrorDetails;
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
        state.deleteError = action.payload as ErrorDetails;
      });
  },
});

export const { 
  resetCreateGameStatStatus, 
  resetDeleteGameStatStatus, 
  resetUpdateGameStatStatus,
  addGameStats 
} = gameStatsSlice.actions
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

export const makeSelectDenormalizedStats = (gameId: number) =>
  createSelector(
    makeSelectGameStatsByGameId(gameId),
    selectPlayerIdToPlayerMap,
    (normalizedStats: GameStat[], playerMap: Record<number, Player>) => {
      return normalizedStats.map(normalizedStat => {
        const { playerId, ...statData} = normalizedStat;
        const player = playerMap[playerId];
        return { player, ...statData};
      });
    }
  );

export const selectStatIdToStatMap = createSelector(
  [selectAllGameStats], // Input: array of all teams
  (stats: GameStat[]) => {
    // Output: a Record<number, Team> map
    const statMap: Record<number, GameStat> = {};
    stats.forEach(stat => {
      statMap[stat.id] = stat;
    });
    return statMap;
  }
);