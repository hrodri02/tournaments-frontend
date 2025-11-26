import { RootState } from "@/store/store";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/hooks/useStore";
import { Game } from "@/entities/index";
import { getGames } from "@/services/tournaments.service";
import { addGameStats } from "../gamestats/gameStatsSlice";

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
  async (_, thunkApi) => {
    const games = await getGames();
    // store stats associate with this game in gameStatSlice
    const statResponses = games.flatMap(game => game.stats);
    const stats = statResponses.map(statResponse => {
      const { player, ...statData } = statResponse;
      const playerId = player.id;
      return { playerId, ...statData };
    });
    if (stats.length > 0) {
      thunkApi.dispatch(addGameStats({stats: stats}));
    }
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
        // convert GameResponse array to Game array
        const games = action.payload.map(gameResponse => {
          const { homeTeam, awayTeam, stats, ...gameData} = gameResponse;
          const homeTeamId = homeTeam.id;
          const awayTeamId = awayTeam.id;
          const statIds = stats.map(stat => stat.id);
          return {homeTeamId, awayTeamId, statIds, ...gameData};
        });
        gamesAdapter.addMany(state, games);
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