import React, {
    useEffect,
    useMemo
} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { 
    View, 
    Text,
    Pressable,
    StyleSheet, 
    ListRenderItemInfo,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
    Application,
    ApplicationStatus,
    UpdateApplicationRequest,
    Team
} from '@/entities';
import {
    selectLeagueApplicationsFetchStatus,
    selectLeagueApplicationsFetchError,
    fetchLeagueApplications,
    makeSelectPendingApplicationsByLeagueId,
    updateApplication,
    selectApplicationsUpdateStatus,
    selectApplicationsUpdateError,
    resetApplicationsUpdatetate
} from '@/store/league-applications/applicationsSlice';
import {
    makeSelectTeamsByIds
} from '@/store/teams/teamsSlice';
import { useTranslation } from 'react-i18next';

export default function ApplicationsPage() {
    const { t } = useTranslation(['home', 'errors']);
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);
    const fetchStatus = useAppSelector(selectLeagueApplicationsFetchStatus);
    const fetchError = useAppSelector(selectLeagueApplicationsFetchError);
    const updateStatus = useAppSelector(selectApplicationsUpdateStatus);
    const updateError = useAppSelector(selectApplicationsUpdateError);
    const selectPendingLeagueApplications = useMemo(
        () => makeSelectPendingApplicationsByLeagueId(leagueId),
        []
    );
    const applications = useAppSelector(selectPendingLeagueApplications);
    const teamIds = applications.map(app => app.teamId);
    const selectTeams = useMemo(
        () => makeSelectTeamsByIds(teamIds),
        [teamIds]
    );
    const teams = useAppSelector(selectTeams);
    const teamIdToTeam: Record<number, Team> = {};
    teams.forEach(team => teamIdToTeam[team.id] = team);

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchLeagueApplications(leagueId));
        }
    }, [fetchStatus, dispatch]);

    const renderItem = ({ item, index }: ListRenderItemInfo<Application>, rowMap: RowMap<Application>) => {
        const team = teamIdToTeam[item.teamId];
        return (
            <View style={styles.rowFront}>
                <Text>{team? team.name : ""}</Text>
            </View>
        );
    }

    const renderHiddenItems = (data: ListRenderItemInfo<Application>, rowMap: RowMap<Application>) => (
        <View style={styles.rowBack}>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => 
                    updateRow(rowMap, String(data.item.id), 'REJECTED')
                }
            >
                <Text style={styles.backTextWhite}>{t('applications.reject_button')}</Text>
            </Pressable>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => 
                    updateRow(rowMap, String(data.item.id), 'ACCEPTED')
                }
            >
                <Text style={styles.backTextWhite}>{t('applications.accept_button')}</Text>
            </Pressable>
        </View>
    );

    const updateRow = (rowMap: RowMap<Application>, rowKey: string, status: ApplicationStatus) => {
        closeRow(rowMap, rowKey);
        const index = applications.findIndex(item => String(item.id) === rowKey);
        if (index > -1) {
            const item = applications[index];
            const applicationId = item.id;
            const requestBody: UpdateApplicationRequest = {
                status: status,
            }
            if (applicationId) {
                dispatch(updateApplication({applicationId, requestBody}))
            }
        }
    };

    const closeRow = (rowMap: RowMap<Application>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    useEffect(() => {
        if (updateStatus === 'succeeded') {
            // slight delay to show success:
            const timer = setTimeout(() => {
                dispatch(resetApplicationsUpdatetate())
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [updateStatus]);

    const getFetchLeagueApplicationsErrorMessage = (): string => {
        const error = fetchError!
        const message = t(`errors:${error.errorKey}`);
        return message
    }

    const getUpdateTeamApplicationsErrorMessage = (): string => {
        const error = updateError!
        const message = t(`errors:${error.errorKey}`);
        return message
    }

    let view: React.JSX.Element = <></>;
    if ((fetchStatus === 'idle' || fetchStatus === 'succeeded') &&
        updateStatus === 'idle') {
        view = <SwipeListView
                    style={styles.sectionList}
                    data={applications}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItems}
                    keyExtractor={(item, index) => String(item.id)}
                    rightOpenValue={-150}
                />
    }
    else if (updateStatus === 'succeeded') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{t('applications.success_message')}</Text>
            <Ionicons name="checkmark-circle" size={32} color="green" />
        </View>
    }
    else if (fetchStatus === 'loading' || updateStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (fetchStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{getFetchLeagueApplicationsErrorMessage()}</Text>
        </View>
    }
    else if (updateStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{getUpdateTeamApplicationsErrorMessage()}</Text>
        </View>
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1
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
    backRightBtnLeft: {
        backgroundColor: 'green',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
});