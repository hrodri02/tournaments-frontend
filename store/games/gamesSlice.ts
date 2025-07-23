import { getGames } from "@/services/tournaments.service";

import { Game } from "@/entities/index";

import { RootState } from "@/store/store";

import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/hooks/useStore";

// Define the shape of our games state
interface GamesState extends EntityState<Game, number> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Create an entity adapter for normalized games state
const gamesAdapter = createEntityAdapter<Game>();

// Initial state using the adapter
const initialState: GamesState = gamesAdapter.getInitialState({
  status: "idle",
  error: null,
});

// Thunk for async fetching games
export const fetchGames = createAppAsyncThunk(
  "games/fetchGames",
  async () => {
    const games = await getGames();
    return games;
  },
  {
      // Only fetch if the current status is idle
      condition(arg, thunkApi) {
        const gamesStatus = selectGamesStatus(thunkApi.getState());
        return gamesStatus === "idle";
      },
  }
);

// Slice definition
const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        gamesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export default gamesSlice.reducer;

//
// --- Selectors ---
//

// Base state selector
export const selectGamesState = (state: RootState) => state.games;

// Entity adapter selectors
export const {
  selectAll: selectAllGames,
  selectById: selectGameById,
  selectIds: selectGameIds,
} = gamesAdapter.getSelectors(selectGamesState);

// League status and error
export const selectGamesStatus = (state: RootState) =>
  selectGamesState(state).status;

export const selectGamesError = (state: RootState) =>
  selectGamesState(state).error;

// Memoized selector factory to filter games by leagueId
export const makeSelectGamesByLeagueId = (leagueId: number) =>
  createSelector([selectAllGames], (games) =>
    games.filter((game) => game.leagueId === leagueId)
);