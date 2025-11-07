import React, 
{ 
    useState, 
    useMemo,
    useCallback
} from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { 
    StyleSheet, 
    View, 
    Text, 
    Pressable, 
    ActivityIndicator,
    ListRenderItemInfo
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView, RowMap, SwipeRow } from 'react-native-swipe-list-view';
import { Team } from '@/entities/index';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    fetchTeams, 
    selectTeamsFetchError, 
    selectTeamsFetchStatus,
    makeSelectTeamsByIds,
    makeSelectTeamsByPlayerId,
    resetFetchState
} from '@/store/teams/teamsSlice';
import { 
    makeSelectInviteByPlayerIdOrTeamId,
    acceptTeamInvite,
    declineTeamInvite,
    selectTeamInvitesUpdateStatus,
    selectTeamInvitesUpdateError
} from '@/store/team-invites/teamInvitesSlice';
import { useAuth } from '@/contexts/AuthContext';

interface TeamIdToInviteIdMap {
    [teamId: number] : number;
}

interface TeamsSection {
    title: string | null;
    isSectionHeader: boolean;
    isSwipeable: boolean;
    sectionIndex: number | null;
    data: Team[];
}

type ItemProps = {
    item: Team;
    backgroundColor: string;
    textColor: string;
};

type TeamsFlattenedSection = Omit<TeamsSection, 'data'> & { team: Team | null, key: string; };

const Item = ({item, backgroundColor, textColor}: ItemProps) => (
    <View style={styles.item}>
        <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
    </View>
);

export default function TeamsPage() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<number>(-1);
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const fetchStatus = useAppSelector(selectTeamsFetchStatus)
    const fetchError = useAppSelector(selectTeamsFetchError)
    const teamInvitesUpdateStatus = useAppSelector(selectTeamInvitesUpdateStatus)
    const teamInvitesUpdateError = useAppSelector(selectTeamInvitesUpdateError)
    const selectTeamsPlayerIsPartOf = useMemo(
        () => makeSelectTeamsByPlayerId(user!.id),
        []
    );
    const teams = useAppSelector(selectTeamsPlayerIsPartOf);
    const selectInvitesForPlayer = useMemo(
        () => makeSelectInviteByPlayerIdOrTeamId(undefined, user? user.id : undefined, 'PENDING'),
        []
    );
    const teamIdToInviteId: TeamIdToInviteIdMap = {}
    const invites = useAppSelector(selectInvitesForPlayer);
    invites.map(invite => teamIdToInviteId[invite.teamId] = invite.id)
    const inviteIds = invites.map(invite => invite.id);
    const selectTeamsFromInviteIds = useMemo(
        () => makeSelectTeamsByIds(inviteIds),
        [inviteIds]
    );
    const teamsInvitedTo = useAppSelector(selectTeamsFromInviteIds);
    const sectionsWithIndex: TeamsSection[] = [
        { title: 'Teams', data: teams, isSectionHeader: true, isSwipeable: false },
        { title: 'Invites', data: teamsInvitedTo, isSectionHeader: true, isSwipeable: false },
    ].map((section, index) => ({
        ...section,
        sectionIndex: index,
    }));
    const dataList = flattenSections(sectionsWithIndex);

    function flattenSections(sections: TeamsSection[]): TeamsFlattenedSection[] {
        let flatList: TeamsFlattenedSection[] = [];
        sections.forEach((section) => {
            flatList.push({
                key: `header-${section.title}`,
                title: section.title,
                isSectionHeader: section.isSectionHeader,
                isSwipeable: section.isSwipeable,
                sectionIndex: section.sectionIndex,
                team: null
            });
            const teams = section.data
            flatList.push(...teams.map(team => (
                {
                    key: `item-${team.id}`,
                    title: null,
                    isSectionHeader: false,
                    isSwipeable: section.sectionIndex === 1,
                    sectionIndex: section.sectionIndex,
                    team: team
                }
            )));
        });
        return flatList;
    }

    useFocusEffect(
        useCallback(() => {
            if (fetchStatus === 'idle') {
                dispatch(fetchTeams());
            }

            return () => {
                dispatch(resetFetchState());
            };
        }, [dispatch])
    );

    const renderItem = ({ item, index }: ListRenderItemInfo<TeamsFlattenedSection>, rowMap: RowMap<TeamsFlattenedSection>) => {
        const team = item.team!
        if (item.isSectionHeader) {
            return (
                <SwipeRow
                    disableLeftSwipe={!item.isSwipeable}
                >
                    <View />
                    <View>
                        <Text style={styles.sectionHeader}>{item.title}</Text>
                    </View>
                </SwipeRow>
            );
        }
        else if (item.sectionIndex === 0) {
            const backgroundColor = team.id === selectedId ? '#424242' : '#E0E0E0';
            const color = team.id === selectedId ? 'white' : 'black';

            const handlePress = () => {
                // Highlight the row when pressed
                setSelectedId(team.id); 
                
                // Navigate
                router.push({
                    pathname: '/(app)/settings/teams/[id]',
                    params: {id: team.id}
                });
            }        

            return (
                <SwipeRow
                    disableLeftSwipe={!item.isSwipeable} 
                    rightOpenValue={-150}
                >
                    
                    <View/>
                    <View style={styles.rowFront}>
                        <Pressable onPress={handlePress}>
                            <Item
                                item={team}
                                backgroundColor={backgroundColor}
                                textColor={color}
                            />
                        </Pressable>
                    </View>
                </SwipeRow>
            );
        }
        
        return (
            <SwipeRow
                disableLeftSwipe={!item.isSwipeable} 
                rightOpenValue={-150}
            >
                {renderHiddenItems(rowMap, item.key)}
                <View style={styles.rowFront}>
                    <Item
                        item={team}
                        backgroundColor={'#E0E0E0'}
                        textColor={'black'}
                    />
                </View>
            </SwipeRow>
        );
    };

    const renderHiddenItems = (rowMap: RowMap<TeamsFlattenedSection>, rowKey: string) => (
        <View style={styles.rowBack}>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, rowKey)} 
            >
                <Text style={styles.backTextWhite}>Decline</Text>
            </Pressable>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => acceptRow(rowMap, rowKey)} 
            >
                <Text style={styles.backTextWhite}>Accept</Text>
            </Pressable>
        </View>
    );

    const closeRow = (rowMap: RowMap<TeamsFlattenedSection>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap: RowMap<TeamsFlattenedSection>, rowKey: string) => {
        closeRow(rowMap, rowKey);
        const index = dataList.findIndex(item => item.key === rowKey);
        if (index > -1) {
            const item = dataList[index];
            const teamId = item.team?.id;
            if (teamId) {
                const inviteId = teamIdToInviteId[teamId];
                dispatch(declineTeamInvite(inviteId));
            }
        }
    };

    const acceptRow = (rowMap: RowMap<TeamsFlattenedSection>, rowKey: string) => {
        closeRow(rowMap, rowKey);
        const index = dataList.findIndex(item => item.key === rowKey);
        if (index > -1) {
            const item = dataList[index];
            const teamId = item.team?.id;
            if (teamId) {
                const inviteId = teamIdToInviteId[teamId];
                dispatch(acceptTeamInvite(inviteId));
            }
        }
    };

    let view: React.JSX.Element = <></>;
    if ((fetchStatus === 'idle' || fetchStatus === 'succeeded') &&
    (teamInvitesUpdateStatus === 'idle' || teamInvitesUpdateStatus === 'succeeded')) {
        view = <SwipeListView
            style={styles.sectionList}
            data={dataList}
            renderItem={renderItem}
        />
    }
    else if (fetchStatus === 'loading' || teamInvitesUpdateStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (fetchStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{fetchError}</Text>
        </View>
    }
    else if (teamInvitesUpdateStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{teamInvitesUpdateError}</Text>
        </View>
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {view}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 10,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionList: {
        flex: 1,
        paddingTop: 22,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 20,
    },
    title: {
        fontSize: 16
    },
    rowFront: {
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
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