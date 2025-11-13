import React, { 
    useState, 
    useEffect, 
    useLayoutEffect, 
    useMemo, 
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { 
    StyleSheet,
    View,
    Text,
    Pressable,
    ActivityIndicator,
    ListRenderItemInfo
} from 'react-native';
import { SwipeListView, RowMap, SwipeRow } from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import { PlayerExcerpt }  from '@/components/PlayerExcerpt';
import { InviteeExcerpt }  from '@/components/InviteeExcerpt';
import TeamInvitationForm from '@/components/TeamInvitationForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectTeamById } from '@/store/teams/teamsSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';
import { 
    makeSelectInviteByPlayerIdOrTeamId, 
    createTeamInvite,
    selectTeamInvitesCreateStatus,
    selectTeamInvitesCreateError,
    resetCreateTeamInviteStatus,
    revokeTeamInvite,
    selectTeamInvitesUpdateStatus,
    selectTeamInvitesUpdateError,
    resetUpdateTeamInivteStatus
} from '@/store/team-invites/teamInvitesSlice';
import { CreateTeamInviteRequest, Player } from '@/entities/index';
import { useAuth } from '@/contexts/AuthContext';

interface TeamDetailSection {
    title: string | null;
    isSectionHeader: boolean;
    isSwipeable: boolean;
    sectionIndex: number | null;
    data: Player[];
}

interface PlayerIdToInviteIdMap {
    [playerId: number] : number;
}

type TeamDetailFlattenedSection = Omit<TeamDetailSection, 'data'> & { player: Player | null, key: string; };

export default function TeamDetailPage() {
    const MAX_PLAYERS = 24;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();
    const createStatus = useAppSelector(selectTeamInvitesCreateStatus)
    const createError = useAppSelector(selectTeamInvitesCreateError)
    const updateStatus = useAppSelector(selectTeamInvitesUpdateStatus)
    const updateError = useAppSelector(selectTeamInvitesUpdateError)
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const team = useAppSelector(state => selectTeamById(state, teamId));
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const navigation = useNavigation();
    const selectPlayersInTeam = useMemo(
        () => makeSelectPlayersByIds(team.playerIds),
        []
    );
    const playersInTeam = useAppSelector(selectPlayersInTeam)
    const selectInvitesForTeam = useMemo(
        () => makeSelectInviteByPlayerIdOrTeamId(team.id, undefined, 'PENDING'),
        []
    );
    const teamInvites = useAppSelector(selectInvitesForTeam)
    const inviteeIds = teamInvites.map(invite => invite.playerId)
    const selectInvitees = useMemo(
        () => makeSelectPlayersByIds(inviteeIds),
        [inviteeIds]
    );
    const invitees = useAppSelector(selectInvitees)
    const playerIdToInviteId: PlayerIdToInviteIdMap = {}
    teamInvites.forEach(invite => playerIdToInviteId[invite.playerId] = invite.id);
    const sectionsWithIndex: TeamDetailSection[] = [
        { title: 'Players', data: playersInTeam, isSectionHeader: true, isSwipeable: false },
        { title: 'Invited Players', data: invitees, isSectionHeader: true, isSwipeable: false },
    ].map((section, index) => ({
        ...section,
        sectionIndex: index,
    }));
    const dataList = flattenSections(sectionsWithIndex);

    useLayoutEffect(() => {
        if (team?.name) {
            navigation.setOptions({ title: team.name });
        }
    }, [navigation, team?.name]);

    function showInviteFriendModal() {
        const count = team.playerIds.length
        if (count < MAX_PLAYERS) {
            setInviteModalVisible(true)
        }
        else {
            alert('You can have up to ' + MAX_PLAYERS + ' players in your team.');
        }
    }

    const handleMenuButtonPressed = () => {
        const options = ['Send Invite', 'Pending Invites', 'Cancel'];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0: 
                        showInviteFriendModal();
                        break;
                    case 1:
                        router.push(`./${teamId}/pending-invites`);
                        break;
                    case 2:
                        break;
                }
            }
        );
    };

    useLayoutEffect(() => {
        if (user && !isLoading) {
            if (user.id === team.ownerId) {
                navigation.setOptions({
                headerRight: () => (
                    <Pressable style={styles.topRightNavButton} onPress={handleMenuButtonPressed}>
                        <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
                    </Pressable>
                )
            });
            } else {
                navigation.setOptions({
                    headerRight: undefined
                });
            }
        }
    }, [navigation, user, isLoading, teamId, handleMenuButtonPressed]);

    const sendInvite = (email: string) => {
        const now: Date = new Date();
        const isoString: string = now.toISOString();
        const requestBody: CreateTeamInviteRequest = {
            email: email,
            createdAt: isoString
        }
        setInviteModalVisible(false)
        dispatch(createTeamInvite({teamId, requestBody}))
    };

    useEffect(() => {
        if (createStatus === 'succeeded' || createStatus === 'failed') {
            const timer = setTimeout(() => {
                dispatch(resetCreateTeamInviteStatus())
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [createStatus]);

    function flattenSections(sections: TeamDetailSection[]): TeamDetailFlattenedSection[] {
        let flatList: TeamDetailFlattenedSection[] = [];
        sections.forEach((section) => {
            flatList.push({
                key: `header-${section.title}`,
                title: section.title,
                isSectionHeader: section.isSectionHeader,
                isSwipeable: section.isSwipeable,
                sectionIndex: section.sectionIndex,
                player: null
            });
            const players = section.data
            flatList.push(...players.map(player => (
                {
                    key: `item-${player.email}`,
                    title: null,
                    isSectionHeader: false,
                    isSwipeable: section.sectionIndex === 1 && (user? user.id === team.ownerId : false),
                    sectionIndex: section.sectionIndex,
                    player: player
                }
            )));
        });
        return flatList;
    }

    const closeRow = (rowMap: RowMap<TeamDetailFlattenedSection>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap: RowMap<TeamDetailFlattenedSection>, rowKey: string) => {
        closeRow(rowMap, rowKey);
        const index = dataList.findIndex(item => item.key === rowKey);
        if (index > -1) {
            const item = dataList[index];
            const playerId = item.player?.id;
            if (playerId) {
                const inviteId = playerIdToInviteId[playerId];
                dispatch(revokeTeamInvite(inviteId))
            }
        }
    };

    useEffect(() => {
        if (updateStatus === 'succeeded' || updateStatus === 'failed') {
            const timer = setTimeout(() => {
                dispatch(resetUpdateTeamInivteStatus())
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [updateStatus]);

    const renderItem = ({ item, index }: ListRenderItemInfo<TeamDetailFlattenedSection>, rowMap: RowMap<TeamDetailFlattenedSection>) => {
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

        return (
            <SwipeRow
                // Disable swiping for non-swipeable items (though headers are already filtered out)
                disableLeftSwipe={!item.isSwipeable} 
                rightOpenValue={-75}
            >
                {renderHiddenRevoke(rowMap, item.key)}
                <View style={styles.rowFront}>
                    {index <= playersInTeam.length? (
                        <PlayerExcerpt style={styles.item} player={item.player!}/>
                    ) : (
                        <InviteeExcerpt 
                            style={styles.item} 
                            invite={teamInvites.find(invite => invite.playerId === item.player?.id)!} 
                            player={item.player!}
                        />
                    )
                    }
                </View>
            </SwipeRow>
        );
    };

    const renderHiddenRevoke = (rowMap: RowMap<TeamDetailFlattenedSection>, rowKey: string) => (
        <View style={styles.rowBack}>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, rowKey)} 
            >
                <Text style={styles.backTextWhite}>Revoke</Text>
            </Pressable>
        </View>
    );

    let view: React.JSX.Element = <></>;
    if ((createStatus === 'idle' || createStatus === 'succeeded') && 
        (updateStatus === 'idle' || updateStatus === 'succeeded'))
    {
        view = <View style={styles.container}>
            <SwipeListView
                style={styles.sectionList}
                data={dataList}
                renderItem={renderItem}
            />

            <Modal
                isVisible={inviteModalVisible}
                onSwipeComplete={() => { 
                    setInviteModalVisible(!inviteModalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <TeamInvitationForm onInvite={sendInvite} onClose={() => {}}/>
            </Modal>
        </View>
    }
    else if (createStatus === 'loading' || updateStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (createStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{createError}</Text>
        </View>
    }
    else if (updateStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{updateError}</Text>
        </View>
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topRightNavButton: {
        marginHorizontal: 20
    },
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
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
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
        backgroundColor: 'blue',
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