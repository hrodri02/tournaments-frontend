import { createAppAsyncThunk } from "@/hooks/useStore";
import { updateTeam } from "@/store/teams/teamsSlice"; 
import { acceptTeamInvite } from "@/store/team-invites/teamInvitesSlice";
import { TeamResponse, AcceptInviteResponse } from "@/entities/index";

export const handleAcceptTeamInvite = createAppAsyncThunk(
    "team/handleAcceptTeamInvite",
    async (inviteId: number, thunkApi) => {
        const acceptInviteResult = await thunkApi.dispatch(acceptTeamInvite(inviteId));
        
        if (acceptInviteResult.meta.requestStatus === 'fulfilled') {
            const response: AcceptInviteResponse = acceptInviteResult.payload as AcceptInviteResponse;
            const teamResponse: TeamResponse = response.updatedTeam;

            const { playerDTOs, invites, ...teamData } = teamResponse;
            const playerIds = playerDTOs.map(player => player.id);
            const inviteeIds = invites.map(invite => invite.player.id);
            const team = { ...teamData, playerIds, inviteeIds };
            thunkApi.dispatch(updateTeam({ team: team }));
        }

        return acceptInviteResult;
    }
);