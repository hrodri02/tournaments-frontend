import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import UploadImageComponent from '@/components/UploadImageComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    updateTeamRequest,
    selectTeamById,
    selectTeamsUpdateStatus, 
    selectTeamsUpdateError,
    resetUpdateTeamState
} from '@/store/teams/teamsSlice';
import { CreateTeamRequest } from '@/entities';

export default function UploadTeamLogo() {
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const updateStatus = useAppSelector(selectTeamsUpdateStatus);
    const updateError = useAppSelector(selectTeamsUpdateError);
    const team = useAppSelector(state => selectTeamById(state, teamId));

    useEffect(() => {
        if (updateStatus === 'succeeded') {
            setIsLoading(false);
            // slight delay to show success:
            const timer = setTimeout(() => {
                dispatch(resetUpdateTeamState())
                router.back();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateStatus]);

    const onTeamLogoSuccessfullyUploadedToS3 = (logoUrl: string): void => {
        const now: Date = new Date();
        const isoString: string = now.toISOString();
        const updatedTeam: CreateTeamRequest = {
            name: team.name,
            logoUrl: logoUrl,
            playersToInvite: [],
            createdAt: isoString
        };
        dispatch(updateTeamRequest({teamId: team.id, updatedTeam: updatedTeam}));
    }

    return (
        <UploadImageComponent
            isLoading={isLoading}
            updateStatus={updateStatus}
            updateError={updateError}
            callback={onTeamLogoSuccessfullyUploadedToS3}
            logoUrl={team.logoUrl}
            setIsLoading={setIsLoading}
        />
    );    
}