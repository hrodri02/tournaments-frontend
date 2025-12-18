import { getLeagues, postLeague, putLeague } from "@/services/tournaments.service";
import { 
  CreateLeagueRequest,
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
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: ErrorDetails | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: ErrorDetails | null;
}

// Create an entity adapter for normalized league state
const leaguesAdapter = createEntityAdapter<League>();

// Initial state using the adapter
const initialState: LeaguesState = leaguesAdapter.getInitialState({
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null
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

export const createLeague = createAppAsyncThunk(
  "leagues/createLeague",
  async (requestBody: CreateLeagueRequest, { rejectWithValue } ) => {
    try {
      const league = await postLeague(requestBody);
      return league;
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
    condition(arg, thunkApi) {
      const createStatus = selectLeaguesCreateStatus(thunkApi.getState());
      return createStatus === "idle";
    },
  }
);

interface UpdateLeaguePayload {
  leagueId: number;
  requestBody: CreateLeagueRequest;
}

export const updateLeagueRequest = createAppAsyncThunk(
  "leagues/updateLeague",
  async (payload: UpdateLeaguePayload, { rejectWithValue } ) => {
    try {
      const league = await putLeague(payload.leagueId, payload.requestBody);
      return league;
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
    condition(arg, thunkApi) {
      const updateStatus = selectLeaguesUpdateStatus(thunkApi.getState());
      return updateStatus === "idle";
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
    },
    resetLeaguesCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetLeaguesUpdateState: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
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
      })
      .addCase(createLeague.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        const leagueResponse = action.payload;
        const { teams, ...leagueData } = leagueResponse;
        const teamIds = teams.map(team => team.id);
        const league = { teamIds, ...leagueData};
        leaguesAdapter.addOne(state, league);
      })
      .addCase(createLeague.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload as ErrorDetails;
      })
      .addCase(updateLeagueRequest.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateLeagueRequest.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const leagueResponse = action.payload;
        const { teams, ...leagueData } = leagueResponse;
        const teamIds = teams.map(team => team.id);
        const league = { teamIds, ...leagueData};
        leaguesAdapter.updateOne(state, {id: league.id, changes: league});
      })
      .addCase(updateLeagueRequest.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as ErrorDetails;
      });
  },
});

export const { 
  resetLeaguesState, 
  updateLeague, 
  resetLeaguesCreateState,
  resetLeaguesUpdateState
} = leaguesSlice.actions;
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

export const selectLeaguesCreateStatus = (state: RootState) =>
  selectLeaguesState(state).createStatus;

export const selectLeaguesCreateError = (state: RootState) =>
  selectLeaguesState(state).createError;

export const selectLeaguesUpdateStatus = (state: RootState) =>
  selectLeaguesState(state).updateStatus;

export const selectLeaguesUpdateError = (state: RootState) =>
  selectLeaguesState(state).updateError;

// Memoized selector factory to filter leagues by status
export const makeSelectLeaguesByStatus = (status: LeagueStatus) =>
  createSelector([selectAllLeagues], (leagues) =>
    leagues.filter((league) => league.status === status)
);
