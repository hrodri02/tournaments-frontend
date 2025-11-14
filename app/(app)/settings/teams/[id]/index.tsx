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
    FlatList
} from 'react-native';
import Modal from 'react-native-modal';
import { PlayerExcerpt }  from '@/components/PlayerExcerpt';
import TeamInvitationForm from '@/components/TeamInvitationForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectTeamById } from '@/store/teams/teamsSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';
import { 
    createTeamInvite,
    selectTeamInvitesCreateStatus,
    selectTeamInvitesCreateError,
    resetCreateTeamInviteStatus,
} from '@/store/team-invites/teamInvitesSlice';
import { CreateTeamInviteRequest } from '@/entities/index';
import { useAuth } from '@/contexts/AuthContext';

export default function TeamDetailPage() {
    const MAX_PLAYERS = 24;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();
    const createStatus = useAppSelector(selectTeamInvitesCreateStatus)
    const createError = useAppSelector(selectTeamInvitesCreateError)
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

    let view: React.JSX.Element = <></>;
    if (createStatus === 'idle' || createStatus === 'succeeded')
    {
        view = <View style={styles.container}>
            <FlatList
                ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                ListHeaderComponent={<View><Text style={styles.sectionHeader}>Players</Text></View>}
                data={playersInTeam}
                renderItem={({item}) => <PlayerExcerpt style={styles.item} player={item}/>}
                keyExtractor={item => String(item.id)}
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
    else if (createStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{createError}</Text>
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
    itemSeparator: {
        borderWidth: 0.1,
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