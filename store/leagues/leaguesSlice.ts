import { getLeagues } from '@/services/tournaments.service'
import { League, LeagueStatus } from '@/entities/index'
import { createSlice, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import { createAppAsyncThunk } from '@/hooks/useStore'

interface LeaguesState extends EntityState<League, number> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

const leaguesAdapter = createEntityAdapter<League>();

const initialState: LeaguesState = leaguesAdapter.getInitialState({
  status: 'idle',
  error: null
})

export const fetchLeagues = createAppAsyncThunk(
  'leagues/fetchLeagues',
  async () => {
    const leagues = await getLeagues()
    return leagues
  },
  {
    condition(arg, thunkApi) {
      const leaguesStatus = selectLeaguesStatus(thunkApi.getState())
      if (leaguesStatus !== 'idle') {
        return false
      }
    }
  }
)

const leaguesSlice = createSlice({
    name: 'leagues',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchLeagues.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(fetchLeagues.fulfilled, (state, action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          leaguesAdapter.setAll(state, action.payload)
        })
        .addCase(fetchLeagues.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message ?? 'Unknown Error'
        })
    }
})

// Export the auto-generated action creator with the same name
// export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

// Export the generated reducer function
export default leaguesSlice.reducer

// Export selectors to read data from
export const {
  selectAll: selectAllLeagues,
  selectById: selectLeaguesById,
  selectIds: selectLeagueIds
  // Pass in a selector that returns the leagues slice of state
} = leaguesAdapter.getSelectors((state: RootState) => state.leagues)

export const selectLeaguesByStatus = createSelector(
  [
    selectAllLeagues,
    (state: RootState, status: LeagueStatus) => status      
  ],
  (leagues, status) => leagues.filter(league => league.status === status)
)
export const selectLeaguesStatus = (state: RootState) => state.leagues.status
export const selectLeaguesError = (state: RootState) => state.leagues.error
export const selectGamesByLeagueId = (state: RootState, leagueId: number) => 	selectLeaguesById(state, leagueId).games