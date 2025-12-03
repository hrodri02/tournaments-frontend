import React, { useLayoutEffect, useMemo, } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { 
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList
} from 'react-native';
import { PlayerExcerpt }  from '@/components/PlayerExcerpt';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppSelector } from '@/hooks/useStore';
import { selectTeamById } from '@/store/teams/teamsSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function TeamDetailPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const { t } = useTranslation(['teams', 'common']);
    const { showActionSheetWithOptions } = useActionSheet();
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const team = useAppSelector(state => selectTeamById(state, teamId));
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

    const handleMenuButtonPressed = () => {
        const options = [
            t('detail.invites_option'),
            t('detail.join_league_option'),
            t('common:cancel_button')
        ];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        router.push(`./${teamId}/invites`);
                        break;
                    case 1:
                        router.push(`./${teamId}/join-league`);
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

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <FlatList
                ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                ListHeaderComponent={<View><Text style={styles.sectionHeader}>{t('detail.players_label')}</Text></View>}
                data={playersInTeam}
                renderItem={({item}) => <PlayerExcerpt style={styles.item} player={item}/>}
                keyExtractor={item => String(item.id)}
            />
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