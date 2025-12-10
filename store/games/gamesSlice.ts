import { RootState } from "@/store/store";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@/hooks/useStore";
import { 
  Game, 
  Team, 
  Player, 
  GameStat, 
  TeamResponse, 
  TeamInviteResponse,
  GameResponse
} from "@/entities/index";
import { ErrorDetails, HttpError } from "@/entities/error";
import { getGames } from "@/services/tournaments.service";
import { addGameStats, selectStatIdToStatMap } from "../gamestats/gameStatsSlice";
import { selectPlayerIdToPlayerMap } from "@/store/players/playersSlice";
import { selectTeamIdToTeamMap } from "@/store/teams/teamsSlice";

// Define the shape of our games state
interface GamesState extends EntityState<Game, number> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: ErrorDetails | null;
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const games = await getGames();
      // store stats associate with this game in gameStatSlice
      const statResponses = games.flatMap(game => game.stats);
      const stats = statResponses.map(statResponse => {
        const { player, ...statData } = statResponse;
        const playerId = player.id;
        return { playerId, ...statData };
      });
      if (stats.length > 0) {
        dispatch(addGameStats({stats: stats}));
      }
      return games;
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
        state.error = action.payload as ErrorDetails;
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
  selectById: selectGamesById,
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

const selectGameById = (state: RootState, gameId: number) => 
  state.games.entities[gameId];

export const makeSelectDenormalizedGames = (leagueId: number) => 
  createSelector(
    // Input Selectors:
    makeSelectGamesByLeagueId(leagueId), 
    selectTeamIdToTeamMap,             
    selectStatIdToStatMap,
    selectPlayerIdToPlayerMap,
    // Output Function: transforms the inputs
    (games: Game[], teamMap: Record<number, Team>, statMap: Record<number, GameStat>, playerMap: Record<number, Player>) => {
      return games.map(game => {
        return denormalizeGame(game, teamMap, statMap, playerMap);
      });
    }
  );

export const makeSelectDenormalizedGame = (gameId: number) => 
  createSelector(
    // Input Selectors:
    (state: RootState) => selectGameById(state, gameId),
    selectTeamIdToTeamMap,             
    selectStatIdToStatMap,
    selectPlayerIdToPlayerMap,
    // Output Function: transforms the inputs
    (game: Game | undefined, teamMap: Record<number, Team>, statMap: Record<number, GameStat>, playerMap: Record<number, Player>) => {
      if (!game) {
        return undefined;
      }

      return denormalizeGame(game, teamMap, statMap, playerMap);
    }
  );

const denormalizeGame = (game: Game, teamMap: Record<number, Team>, statMap: Record<number, GameStat>, playerMap: Record<number, Player>): GameResponse => {
  const { homeTeamId, awayTeamId, statIds, ...gameData} = game;
  const normalizedHomeTeam = teamMap[homeTeamId];
  const homeTeam = denormalizeTeam(normalizedHomeTeam, playerMap);
  const normalizedAwayTeam = teamMap[awayTeamId];
  const awayTeam = denormalizeTeam(normalizedAwayTeam, playerMap);
  const normalizedStats = game.statIds.map(statId => statMap[statId]);
  const stats = normalizedStats.map(stat => {
      const { playerId, ...statData } = stat;
      const player = playerMap[playerId];
      return { player, ...statData };
  });
  const gameResponse = { homeTeam, awayTeam, stats, ...gameData };
  return gameResponse;
}

const denormalizeTeam = (team: Team, playerMap: Record<number, Player>): TeamResponse => {
  const { playerIds, inviteeIds, ...homeTeamData } = team;
  const playerDTOs = playerIds.map(id => playerMap[id]);
  const invitees = inviteeIds.map(id => playerMap[id]);
  const invites: TeamInviteResponse[] = [];
  return {playerDTOs, invitees, invites, ...homeTeamData};
}