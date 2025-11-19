import { getLeagues } from "@/services/tournaments.service";
import { 
  League, 
  LeagueStatus, 
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

// Define the shape of our leagues state
interface LeaguesState extends EntityState<League, number> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
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
  async (status: LeagueStatus | undefined) => {
    const leagues = await getLeagues(status);
    return leagues;
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
    updateLeague: (state, action: PayloadAction<UpdateLeagueAction>) {
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
        leaguesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
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
