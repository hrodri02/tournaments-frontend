import { getGameStats } from "@/services/tournaments.service";

import { GameStat } from "@/entities/index";

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
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const gameStatsAdapter = createEntityAdapter<GameStat>();

// Initial state using the adapter
const initialState: GameStatsState = gameStatsAdapter.getInitialState({
  status: "idle",
  error: null,
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
        const gameStatsStatus = selectGameStatsStatus(thunkApi.getState());
        return gameStatsStatus === "idle";
      },
  }
);

// Slice definition
const gameStatsSlice = createSlice({
  name: "gameStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        gameStatsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

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
export const selectGameStatsStatus = (state: RootState) =>
  selectGameStatsState(state).status;

export const selectGameStatsError = (state: RootState) =>
  selectGameStatsState(state).error;

// Memoized selector factory to filter games by leagueId
export const makeSelectGameStatsByGameId = (gameId: number) =>
  createSelector([selectAllGameStats], (games) =>
    games.filter((game) => game.gameId === gameId)
);