import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    View, 
    Text, 
    StyleSheet, 
    ListRenderItemInfo,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { InviteeExcerpt } from '@/components/InviteeExcerpt';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import { Player } from '@/entities/index';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
    makeSelectInviteByPlayerIdOrTeamId, 
    revokeTeamInvite,
    selectTeamInvitesUpdateStatus,
    selectTeamInvitesUpdateError,
} from '@/store/team-invites/teamInvitesSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';

interface PendingInvitesProps {
    teamId: number;
}

interface PlayerIdToInviteIdMap {
    [playerId: number] : number;
}

export default function PendingInvites({ teamId }: PendingInvitesProps) {
    const dispatch = useAppDispatch();
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

    let view: React.JSX.Element = <></>;
    if (updateStatus === 'idle' || updateStatus === 'succeeded') {
        view = <View style={styles.container}>
            <SwipeListView
                style={styles.sectionList}
                data={players}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenRevoke}
                keyExtractor={(item, index) => String(item.id)}
                rightOpenValue={-75}
            />
        </View>
    }
    else if (updateStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{updateError}</Text>
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