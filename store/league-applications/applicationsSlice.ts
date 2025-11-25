import { RootState } from "@/store/store";
import { createAppAsyncThunk } from "@/hooks/useStore";
import {
    createSlice,
    createEntityAdapter,
    EntityState,
    createSelector
} from "@reduxjs/toolkit";
import { 
    Application,
    CreateApplicationRequest, 
    UpdateApplicationRequest,
} from "@/entities/index";
import { 
    getApplications, 
    postApplyToLeague, 
    putApplication 
} from "@/services/tournaments.service";
import { updateLeague } from "../leagues/leaguesSlice";
import { addTeams } from "../teams/teamsSlice";

interface ApplicationsState extends EntityState<Application, number> {
    fetchLeaugeApplicationsStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchLeaugeApplicationsError: string | null;
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
    fetchLeaugeApplicationsStatus: "idle",
    fetchLeaugeApplicationsError: null,
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

interface UpdateApplicationPayload {
    applicationId: number;
    requestBody: UpdateApplicationRequest;
}

export const fetchTeamApplications = createAppAsyncThunk(
    "applications/fetchTeamApplications",
    async (teamId: number) => {
        const applications = await getApplications(teamId);
        return applications;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const fetchStatus = selectApplicationsFetchStatus(thunkApi.getState());
            return fetchStatus === "idle";
        },
    }
);

export const fetchLeagueApplications = createAppAsyncThunk(
    "applications/fetchLeagueApplications",
    async (leagueId: number, thunkApi) => {
        const applications = await getApplications(undefined, leagueId);
        const teams = applications.map(app => {
            const teamResponse = app.team;
            const { playerDTOs, invites, invitees, ...teamData } = teamResponse;
            const playerIds = playerDTOs? playerDTOs.map(player => player.id) : [];
            const inviteeIds = invitees? invitees.map(invitee => invitee.id) : [];
            return {playerIds, inviteeIds, ...teamData};
        });
        if (teams && teams.length > 0) {
            thunkApi.dispatch(addTeams({teams: teams}));
        }
        return applications;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const fetchLeaugeApplicationsStatus = selectLeagueApplicationsFetchStatus(thunkApi.getState());
            return fetchLeaugeApplicationsStatus === "idle";
        },
    }
);

export const createApplication = createAppAsyncThunk(
    "applications/createApplication",
    async (payload: CreateApplicationPayload) => {
        const { leagueId, requestBody } = payload;
        const application = await postApplyToLeague(leagueId, requestBody);
        return application;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const createStatus = selectApplicationsCreateStatus(thunkApi.getState());
            return createStatus === "idle";
        },
    }
);

export const updateApplication = createAppAsyncThunk(
    "applications/updateApplication",
    async (payload: UpdateApplicationPayload, thunkApi) => {
        const { applicationId, requestBody } = payload;
        const application = await putApplication(applicationId, requestBody);
        if (application.status === 'ACCEPTED') {
            const { league } = application;
            const { teams, ...leagueData } = league;
            const teamIds = teams.map(team => team.id);
            const leagueToStore = {teamIds, ...leagueData};
            thunkApi.dispatch(updateLeague({league: leagueToStore}));
        }
        return application;
    },
    {
        // Only fetch if the current status is idle
        condition(arg, thunkApi) {
            const updateStatus = selectApplicationsUpdateStatus(thunkApi.getState());
            return updateStatus === "idle";
        },
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
        resetLeagueApplicationsFetchState: (state) => {
            state.fetchLeaugeApplicationsStatus = 'idle'
            state.fetchLeaugeApplicationsError = null
        },
        resetApplicationsCreateState: (state) => {
            state.createStatus = 'idle'
            state.createError = null
        },
        resetApplicationsUpdatetate: (state) => {
            state.updateStatus = 'idle'
            state.updateError = null
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
            .addCase(fetchLeagueApplications.pending, (state) => {
                state.fetchLeaugeApplicationsStatus = "loading";
                state.fetchLeaugeApplicationsError = null;
            })
            .addCase(fetchLeagueApplications.fulfilled, (state, action) => {
                state.fetchLeaugeApplicationsStatus = "succeeded";
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
            .addCase(fetchLeagueApplications.rejected, (state, action) => {
                state.fetchLeaugeApplicationsStatus = "failed";
                state.fetchLeaugeApplicationsError = action.error.message ?? "Unknown Error";
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
            .addCase(updateApplication.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(updateApplication.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const applicationResponse = action.payload;
                const {team, league, ...applicationData} = applicationResponse;
                const teamId = team.id;
                const leagueId = league.id;
                const applicationToStore = { teamId, leagueId, ...applicationData };
                applicationsAdapter.updateOne(state, {id: applicationToStore.id, changes: applicationToStore});
            })
            .addCase(updateApplication.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.error.message ?? "Unknown Error";
            })
    },
});

export const { 
    resetApplicationsFetchState,
    resetLeagueApplicationsFetchState, 
    resetApplicationsCreateState,
    resetApplicationsUpdatetate
} = applicationsSlice.actions
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

export const selectLeagueApplicationsFetchStatus = (state: RootState) =>
    selectApplicationsState(state).fetchLeaugeApplicationsStatus;

export const selectLeagueApplicationsFetchError = (state: RootState) =>
    selectApplicationsState(state).fetchLeaugeApplicationsError;

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

export const makeSelectPendingApplicationsByLeagueId = (leagueId: number) =>
  createSelector([selectAllApplications], (applications) =>
    applications.filter((application) => application.leagueId === leagueId && application.status === 'PENDING')
);