import React, { 
    useState, 
    useEffect, 
    useLayoutEffect, 
    useMemo, 
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { 
    StyleSheet,
    View,
    Text, 
    SectionList,
    Pressable,
    ActivityIndicator
} from 'react-native';
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
    resetCreateTeamInviteStatus
} from '@/store/team-invites/teamInvitesSlice';
import { CreateTeamInviteRequest } from '@/entities/index';
import { useAuth } from '@/contexts/AuthContext';

export default function TeamDetailPage() {
    const MAX_PLAYERS = 24;
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAuth();
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
    const selectInvitesForTeam = useMemo(
        () => makeSelectInviteByPlayerIdOrTeamId(team.id),
        []
    );
    const teamInvites = useAppSelector(selectInvitesForTeam)
    const inviteeIds = teamInvites.map(invite => invite.playerId)
    const selectInvitees = useMemo(
        () => makeSelectPlayersByIds(inviteeIds),
        [inviteeIds]
    );
    const invitees = useAppSelector(selectInvitees)
    const sectionsWithIndex = [
        { title: 'Players', data: playersInTeam },
        { title: 'Invited Players', data: invitees },
    ].map((section, index) => ({
        ...section,
        sectionIndex: index,
    }));

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

    useLayoutEffect(() => {
        if (user && !isLoading) {
            if (user.id === team.ownerId) {
                navigation.setOptions({
                headerRight: () => (
                    <Pressable style={styles.topNavigationButton} onPress={showInviteFriendModal}>
                        <FontAwesome6 name="user-plus" size={16} color="black" /> 
                    </Pressable>
                )
            });
            } else {
                navigation.setOptions({
                    headerRight: undefined
                });
            }
        }
    }, [navigation, user, isLoading, teamId, showInviteFriendModal]);

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
    if (createStatus === 'idle' || createStatus === 'succeeded') {
        view = <View style={styles.container}>
            <SectionList
                style={styles.sectionList}
                sections={sectionsWithIndex}
                renderItem={({ item, section }) => {
                    if (section.sectionIndex < playersInTeam.length) {
                        return (
                            <PlayerExcerpt style={styles.item} player={item}/>
                        );
                    }
                    return (
                        <InviteeExcerpt 
                            style={styles.item} 
                            invite={teamInvites.find(invite => invite.playerId === item.id)!} 
                            player={item}
                        />
                    );
                }}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
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
    topNavigationButton: {
        padding: 20
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
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
    },
    title: {
        fontSize: 16
    }
});