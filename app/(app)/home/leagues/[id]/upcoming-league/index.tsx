import React, { useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/hooks/useStore';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { makeSelectTeamsByIds } from '@/store/teams/teamsSlice';
import { TeamExcerpt } from '@/components/TeamExcerpt';

export default function UpcomingLeaguePage() {
    const router = useRouter();
    const navigation = useNavigation();
    const { user, isLoading } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const selectTeamsByIds = useMemo(
        () => makeSelectTeamsByIds(league.teamIds),
        [league]
    );
    const teams = useAppSelector(selectTeamsByIds);
    
    useLayoutEffect(() => {
        if (league?.name) {
            navigation.setOptions({ title: league.name });
        }
    }, [navigation, league?.name]);

    const handleMenuButtonPressed = () => {
        const options = ['Applications', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
        {
            options,
            cancelButtonIndex,
        },
        (buttonIndex) => {
            switch (buttonIndex) {
                case 0: 
                    router.push(`./applications`);
                    break;
                case 1:
                    break;
                }
            }
        );
    };

    useLayoutEffect(() => {
        if (user && !isLoading) {
            if (user.appUserRole === 'ADMIN') {
                navigation.setOptions({
                headerRight: () => (
                    <Pressable
                        style={styles.topRightNavButton}
                        onPress={handleMenuButtonPressed}
                    >
                        <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
                    </Pressable>
                )
                });
            }
            else {
                navigation.setOptions({
                headerRight: undefined
                });
            }
        }
  }, [navigation, user, isLoading, handleMenuButtonPressed]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                ListHeaderComponent={<View><Text style={styles.sectionHeader}>Teams</Text></View>}
                data={teams}
                renderItem={({item}) => <TeamExcerpt style={styles.item} team={item}/>}
                keyExtractor={item => String(item.id)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topRightNavButton: {
        marginHorizontal: 20,
    },
    container: {
        flex: 1
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
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
});