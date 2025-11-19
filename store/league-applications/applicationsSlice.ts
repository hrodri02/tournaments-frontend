import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/hooks/useStore";
import {
    createSlice,
    createEntityAdapter,
    EntityState,
    createSelector
} from "@reduxjs/toolkit";
import { Application, CreateApplicationRequest } from "@/entities/index";
import { getTeamApplications, postApplyToLeague } from "@/services/tournaments.service";

interface ApplicationsState extends EntityState<Application, number> {
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    createStatus: "idle" | "loading" | "succeeded" | "failed";
    createError: string | null;
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const applicationsAdapter = createEntityAdapter<Application>();

const initialState: ApplicationsState = applicationsAdapter.getInitialState({
    fetchStatus: "idle",
    fetchError: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null
});

interface CreateApplicationPayload {
    leagueId: number;
    requestBody: CreateApplicationRequest;
}

export const fetchTeamApplications = createAppAsyncThunk(
    "applications/fetchTeamApplications",
    async (teamId: number) => {
        const applications = await getTeamApplications(teamId);
        return applications;
    }
);

export const createApplication = createAppAsyncThunk(
    "applications/createApplication",
    async (payload: CreateApplicationPayload) => {
        const { leagueId, requestBody } = payload;
        const application = await postApplyToLeague(leagueId, requestBody);
        return application;
    }
);

const applicationsSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        resetApplicationsFetchState: (state) => {
            state.fetchStatus = 'idle'
            state.fetchError = null
        },
        resetApplicationsCreateState: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTeamApplications.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchTeamApplications.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                const applicationResponses = action.payload;
                const applicationsToStore: Application[] = applicationResponses.map(applicationResponse => {
                    const {team, league, ...applicationData} = applicationResponse;
                    const teamId = team.id;
                    const leagueId = league.id;
                    const applicationToStore = { teamId, leagueId, ...applicationData };
                    return applicationToStore;
                })
                applicationsAdapter.addMany(state, applicationsToStore);
            })
            .addCase(fetchTeamApplications.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message ?? "Unknown Error";
            })
            .addCase(createApplication.pending, (state) => {
                state.createStatus = "loading";
                state.createError = null;
            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                const applicationResponse = action.payload;
                const {team, league, ...applicationData} = applicationResponse;
                const teamId = team.id;
                const leagueId = league.id;
                const applicationToStore = { teamId, leagueId, ...applicationData };
                applicationsAdapter.addOne(state, applicationToStore);
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.createStatus = "failed";
                state.createError = action.error.message ?? "Unknown Error";
            })
    },
});

export const { resetApplicationsFetchState, resetApplicationsCreateState } = applicationsSlice.actions
export default applicationsSlice.reducer;

export const selectApplicationsState = (state: RootState) => state.applications

export const {
    selectAll: selectAllApplications,
    selectById: selectApplicationById,
    selectIds: selectApplicationIds,
} = applicationsAdapter.getSelectors(selectApplicationsState);

export const selectApplicationsFetchStatus = (state: RootState) =>
    selectApplicationsState(state).fetchStatus;

export const selectApplicationsFetchError = (state: RootState) =>
    selectApplicationsState(state).fetchError;

export const selectApplicationsCreateStatus = (state: RootState) =>
    selectApplicationsState(state).createStatus;

export const selectApplicationsCreateError = (state: RootState) =>
    selectApplicationsState(state).createError;

export const selectApplicationsUpdateStatus = (state: RootState) =>
    selectApplicationsState(state).updateStatus;

export const selectApplicationsUpdateError = (state: RootState) =>
    selectApplicationsState(state).updateError;

export const selectApplicationsDeleteStatus = (state: RootState) =>
    selectApplicationsState(state).deleteStatus;

export const selectApplicationsDeleteError = (state: RootState) =>
    selectApplicationsState(state).deleteError;

// Memoized selector factory to filter applications by teamId
export const makeSelectApplicationsByTeamId = (teamId: number) =>
  createSelector([selectAllApplications], (applications) =>
    applications.filter((application) => application.teamId === teamId)
);