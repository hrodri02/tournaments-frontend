import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/hooks/useStore";
import {
    createSlice,
    createEntityAdapter,
    EntityState,
} from "@reduxjs/toolkit";
import { Application, CreateApplicationRequest } from "@/entities/index";
import { postApplytoLeague } from "@/services/tournaments.service";

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

export const createApplication = createAppAsyncThunk(
    "applications/createApplication",
    async (payload: CreateApplicationPayload) => {
        const { leagueId, requestBody } = payload;
        const application = await postApplytoLeague(leagueId, requestBody);
        return application;
    }
);

const applicationsSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        resetCreateApplicationStatus: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
    },
    extraReducers(builder) {
        builder
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