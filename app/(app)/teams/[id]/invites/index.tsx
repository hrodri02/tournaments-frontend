import React, { 
    useState, 
    useMemo, 
    useEffect,
    useLayoutEffect
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    View, 
    Text, 
    StyleSheet, 
    ListRenderItemInfo,
    Pressable,
    ActivityIndicator
} from 'react-native';
import TeamInvitationForm from '@/components/TeamInvitationForm';
import { InviteeExcerpt } from '@/components/InviteeExcerpt';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Player, CreateTeamInviteRequest } from '@/entities/index';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
    makeSelectInviteByPlayerIdOrTeamId, 
    revokeTeamInvite,
    selectTeamInvitesCreateStatus,
    selectTeamInvitesCreateError,
    selectTeamInvitesUpdateStatus,
    selectTeamInvitesUpdateError,
    resetUpdateTeamInivteStatus,
    createTeamInvite,
    resetCreateTeamInviteStatus
} from '@/store/team-invites/teamInvitesSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';
import { selectTeamById } from '@/store/teams/teamsSlice';

interface PlayerIdToInviteIdMap {
    [playerId: number] : number;
}

export default function Invites() {
    const MAX_PLAYERS = 24;
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const team = useAppSelector(state => selectTeamById(state, teamId))
    const createStatus = useAppSelector(selectTeamInvitesCreateStatus);
    const createError = useAppSelector(selectTeamInvitesCreateError);
    const updateStatus = useAppSelector(selectTeamInvitesUpdateStatus);
    const updateError = useAppSelector(selectTeamInvitesUpdateError);
    const selectInvitesForTeam = useMemo(
        () => makeSelectInviteByPlayerIdOrTeamId(teamId, undefined, 'PENDING'),
        []
    );
    const teamInvites = useAppSelector(selectInvitesForTeam);
    const playerIdToInviteId: PlayerIdToInviteIdMap = {};
    teamInvites.forEach(invite => playerIdToInviteId[invite.playerId] = invite.id);
    const inviteeIds = teamInvites.map(invite => invite.playerId);
    const selectInvitees = useMemo(
        () => makeSelectPlayersByIds(inviteeIds),
        [inviteeIds]
    );
    const players = useAppSelector(selectInvitees);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={styles.topRightNavButton} onPress={showInviteFriendModal}>
                    <FontAwesome6 name="user-plus" size={16} color="black" />
                </Pressable>
            )
        });
    }, [navigation, showInviteFriendModal]);

    const renderItem = ({ item, index }: ListRenderItemInfo<Player>, rowMap: RowMap<Player>) => {
        const invite = teamInvites.find(invite => invite.playerId === item.id)!
        return (
            <View style={styles.rowFront}>
                <InviteeExcerpt 
                    style={styles.item} 
                    invite={invite} 
                    player={item}
                />
            </View>
        );
    }

    const renderHiddenRevoke = (data: ListRenderItemInfo<Player>, rowMap: RowMap<Player>) => (
        <View style={styles.rowBack}>
            <Pressable
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => 
                    deleteRow(rowMap, String(data.item.id))
                }
            >
                <Text style={styles.backTextWhite}>Revoke</Text>
            </Pressable>
        </View>
    );

    const closeRow = (rowMap: RowMap<Player>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap: RowMap<Player>, rowKey: string) => {
        closeRow(rowMap, rowKey);
        const index = players.findIndex(item => String(item.id) === rowKey);
        if (index > -1) {
            const item = players[index];
            const playerId = item.id;
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

    function showInviteFriendModal() {
        const count = team.playerIds.length
        if (count < MAX_PLAYERS) {
            setInviteModalVisible(true)
        }
        else {
            alert('You can have up to ' + MAX_PLAYERS + ' players in your team.');
        }
    }

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

    let view: React.JSX.Element = <></>;
    if ((updateStatus === 'idle' || updateStatus === 'succeeded') &&
        (createStatus === 'idle' || createStatus === 'succeeded')) 
    {
        view = <View style={styles.container}>
            <SwipeListView
                style={styles.sectionList}
                data={players}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenRevoke}
                keyExtractor={(item, index) => String(item.id)}
                rightOpenValue={-75}
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
    else if (updateStatus === 'loading' || createStatus == 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (updateStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{updateError}</Text>
        </View>
    }
    else if (createStatus === 'failed') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{createError}</Text>
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topRightNavButton: {
        marginHorizontal: 10
    },
    container: {
        flex: 1,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    sectionList: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        flex: 1
    },
    rowFront: {
        padding: 10,
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
    title: {
        fontSize: 16
    }
});