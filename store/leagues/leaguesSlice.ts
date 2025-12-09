import { getLeagues } from "@/services/tournaments.service";
import { 
  League, 
  LeagueStatus, 
  Player,
} from "@/entities/index";
import {
  createSlice,
  createEntityAdapter,
  EntityState,
  createSelector,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/hooks/useStore";
import { addTeams } from "../teams/teamsSlice";
import { upsertManyPlayers } from "../players/playersSlice";
import { ErrorDetails, HttpError } from "@/entities/error";

// Define the shape of our leagues state
interface LeaguesState extends EntityState<League, number> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: ErrorDetails | null;
}

// Create an entity adapter for normalized league state
const leaguesAdapter = createEntityAdapter<League>();

// Initial state using the adapter
const initialState: LeaguesState = leaguesAdapter.getInitialState({
  status: "idle",
  error: null,
});

// Thunk for async fetching leagues
export const fetchLeagues = createAppAsyncThunk(
  "leagues/fetchLeagues",
  async (status: LeagueStatus | undefined, { dispatch, rejectWithValue } ) => {
    try {
      const leagues = await getLeagues(status);
      const teamResponses = leagues.flatMap(league => league.teams);
      const teams = teamResponses.map(response => {
        const { playerDTOs, invites, invitees, ...teamData } = response;
        const playerIds = playerDTOs? playerDTOs.map(player => player.id): [];
        const inviteeIds = invitees? invitees.map(invitee => invitee.id) : [];
        return { playerIds, inviteeIds, ...teamData};
      });
      if (teams.length > 0) {
        dispatch(addTeams({teams: teams}));
      }
      const allPlayers = teamResponses.flatMap(teamResponse => {
        const playersInTeam = teamResponse.playerDTOs? teamResponse.playerDTOs : [];
        const invitees = teamResponse.invitees? teamResponse.invitees : [];
        return playersInTeam.concat(invitees);
      });
      const uniquePlayersMap = new Map<number, Player>();
      allPlayers.forEach(player => {
        uniquePlayersMap.set(player.id, player);
      });
      // create an array of the unique players using the map
      const playersToStore: Player[] = Array.from(uniquePlayersMap.values());
      if (playersToStore.length > 0) {
        dispatch(upsertManyPlayers({players: playersToStore}));
      }
      return leagues;
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
      const leaguesStatus = selectLeaguesStatus(thunkApi.getState());
      return leaguesStatus === "idle";
    },
  }
);

interface UpdateLeagueAction {
  league: League;
}

// Slice definition
const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    resetLeaguesState: (state) => {
      state.status = "idle";
      state.error = null;
    },
    updateLeague: (state, action: PayloadAction<UpdateLeagueAction>) => {
      const updatedLeague = action.payload.league;
      leaguesAdapter.updateOne(state, {id: updatedLeague.id, changes: updatedLeague});
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.status = "succeeded";
        const leagueResponses = action.payload;
        const leagues = leagueResponses.map(response => {
          const { teams, ...leagueData } = response;
          const teamIds = teams.map(team => team.id);
          return { teamIds, ...leagueData};
        });
        leaguesAdapter.setAll(state, leagues);
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as ErrorDetails;
      });
  },
});

export const { resetLeaguesState, updateLeague } = leaguesSlice.actions;
export default leaguesSlice.reducer;

//
// --- Selectors ---
//

// Base state selector
export const selectLeaguesState = (state: RootState) => state.leagues;

// Entity adapter selectors
export const {
  selectAll: selectAllLeagues,
  selectById: selectLeagueById,
  selectIds: selectLeagueIds,
} = leaguesAdapter.getSelectors(selectLeaguesState);

// League status and error
export const selectLeaguesStatus = (state: RootState) =>
  selectLeaguesState(state).status;

export const selectLeaguesError = (state: RootState) =>
  selectLeaguesState(state).error;

// Memoized selector factory to filter leagues by status
export const makeSelectLeaguesByStatus = (status: LeagueStatus) =>
  createSelector([selectAllLeagues], (leagues) =>
    leagues.filter((league) => league.status === status)
);
