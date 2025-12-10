import React, { 
    useEffect,
    useMemo
} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    View, 
    Text,
    Pressable,
    StyleSheet, 
    ListRenderItemInfo,
    ActivityIndicator
} from 'react-native';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import {
    makeSelectLeaguesByStatus 
} from '@/store/leagues/leaguesSlice';
import { LeagueExcerpt } from '@/store/leagues/LeagueExcerpt';
import { League, LeagueStatus, CreateApplicationRequest } from '@/entities';
import {
    selectApplicationsFetchStatus,
    selectApplicationsFetchError,
    fetchTeamApplications,
    selectApplicationsCreateStatus,
    selectApplicationsCreateError,
    createApplication,
    resetApplicationsCreateState,
    makeSelectApplicationsByTeamId
} from '@/store/league-applications/applicationsSlice';
import { useTranslation } from 'react-i18next';

export default function JoinLeague() {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const { t } = useTranslation(['teams', 'errors']);
    const teamId = Number(id);
    const fetchStatus = useAppSelector(selectApplicationsFetchStatus);
    const fetchError = useAppSelector(selectApplicationsFetchError);
    const createStatus = useAppSelector(selectApplicationsCreateStatus);
    const createError = useAppSelector(selectApplicationsCreateError);
    const selectUpcomingLeagues = useMemo(
        () => makeSelectLeaguesByStatus(LeagueStatus.notStarted),
        []
    );
    const upcomingLeagues = useAppSelector(selectUpcomingLeagues);
    const selectApplicationsForTeam = useMemo(
        () => makeSelectApplicationsByTeamId(teamId),
        []
    );
    const applications = useAppSelector(selectApplicationsForTeam);
    const leagueIds = applications.map(application => application.leagueId);
    // filter out leagues the team applied to already
    const leagues = upcomingLeagues.filter(league => !leagueIds.includes(league.id));

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchTeamApplications(teamId));
        }
    }, [fetchStatus, dispatch]);

    const renderItem = ({ item, index }: ListRenderItemInfo<League>, rowMap: RowMap<League>) => {
        return (
            <View style={styles.rowFront}>
                <LeagueExcerpt
                    style={styles.item} 
                    league={item}
                    imageSideLength={40}
                />
            </View>
        );
    }

    const renderHiddenJoin = (data: ListRenderItemInfo<League>, rowMap: RowMap<League>) => (
        <View style={styles.rowBack}>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => 
                    deleteRow(rowMap, String(data.item.id))
                }
            >
                <Text style={styles.backTextWhite}>{t('join_a_league.join_button')}</Text>
            </Pressable>
        </View>
    );

    const closeRow = (rowMap: RowMap<League>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap: RowMap<League>, rowKey: string) => {
        closeRow(rowMap, rowKey);
        const index = leagues.findIndex(item => String(item.id) === rowKey);
        if (index > -1) {
            const item = leagues[index];
            const leagueId = item.id;
            const now: Date = new Date();
            const isoString: string = now.toISOString();
            const requestBody: CreateApplicationRequest = {
                teamId: teamId,
                createdAt: isoString
            }
            if (leagueId) {
                dispatch(createApplication({leagueId, requestBody}))
            }
        }
    };

    useEffect(() => {
        if (createStatus === 'succeeded') {
            // slight delay to show success:
            const timer = setTimeout(() => {
                dispatch(resetApplicationsCreateState())
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [createStatus]);

    const getFetchTeamApplicationsErrorMessage = (): string => {
        const error = fetchError!
        const message = t(`errors:${error.errorKey}`);
        return message
    }

    const getCreateTeamApplicationsErrorMessage = (): string => {
        const error = createError!
        const message = t(`errors:${error.errorKey}`);
        return message
    }

    let view: React.JSX.Element = <></>;
    if ((fetchStatus === 'idle' || fetchStatus === 'succeeded') &&
        createStatus === 'idle') {
        view = <SwipeListView
                    style={styles.sectionList}
                    data={leagues}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenJoin}
                    keyExtractor={(item, index) => String(item.id)}
                    rightOpenValue={-75}
                />
    }
    else if (createStatus === 'succeeded') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{t('join_a_league.success_message')}</Text>
            <Ionicons name="checkmark-circle" size={32} color="green" />
        </View>
    }
    else if (fetchStatus === 'loading' || createStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (fetchStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{getFetchTeamApplicationsErrorMessage()}</Text>
        </View>
    }
    else if (createStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{getCreateTeamApplicationsErrorMessage()}</Text>
        </View>
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionList: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: '0.5em',
        padding: 10,
        marginVertical: 5,
    },
    rowFront: {
        padding: 10,
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: 50
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'green',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
    title: {
        fontSize: 16
    }
});