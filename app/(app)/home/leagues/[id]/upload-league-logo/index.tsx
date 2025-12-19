import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import UploadImageComponent from '@/components/UploadImageComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    updateLeagueRequest,
    selectLeagueById,
    selectLeaguesUpdateStatus, 
    selectLeaguesUpdateError,
    resetLeaguesUpdateState,
} from '@/store/leagues/leaguesSlice';
import { CreateLeagueRequest } from '@/entities';

export default function UploadLeagueLogoPage() {
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const updateStatus = useAppSelector(selectLeaguesUpdateStatus);
    const updateError = useAppSelector(selectLeaguesUpdateError);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));

    useEffect(() => {
        if (updateStatus === 'succeeded' || updateStatus === 'failed') {
            setIsLoading(false);
            // slight delay to show success:
            const timer = setTimeout(() => {
                dispatch(resetLeaguesUpdateState())
                if (updateStatus === 'succeeded') {
                    router.back();
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateStatus]);

    const onLeagueLogoSuccessfullyUploadedToS3 = (logoUrl: string): void => {
        const updatedLeague: CreateLeagueRequest = {
            name: league.name,
            startDate: league.startDate,
            durationInWeeks: league.durationInWeeks,
            logoUrl: logoUrl,
        };
        dispatch(updateLeagueRequest({leagueId: league.id, requestBody: updatedLeague}));
    }
    
    return (
        <UploadImageComponent
            isLoading={isLoading}
            updateStatus={updateStatus}
            updateError={updateError}
            callback={onLeagueLogoSuccessfullyUploadedToS3}
            logoUrl={league.logoUrl}
            setIsLoading={setIsLoading}
        />
    );
}