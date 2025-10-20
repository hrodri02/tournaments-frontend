import React, { useLayoutEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { 
    StyleSheet, 
    Text, 
    SectionList
} from 'react-native';
import { PlayerExcerpt }  from '@/components/PlayerExcerpt';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/useStore';
import { selectTeamById } from '@/store/teams/teamsSlice';
import { makeSelectPlayersByIds } from '@/store/players/playersSlice';

export default function TeamDetailPage() {
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const team = useAppSelector(state => selectTeamById(state, teamId));
    const navigation = useNavigation();
    const selectPlayersInTeam = useMemo(
        () => makeSelectPlayersByIds(team.playerIds),
        []
    );
    const playersInTeam = useAppSelector(selectPlayersInTeam);

    useLayoutEffect(() => {
        if (team?.name) {
          navigation.setOptions({ title: team.name });
        }
      }, [navigation, team?.name]);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <SectionList
                style={styles.sectionList}
                sections={[
                    { title: 'Players', data: playersInTeam },
                    { title: 'Invited Players', data: [] },
                ]}
                renderItem={({ item }) =>
                    <PlayerExcerpt style={styles.item} player={item}/>
                }
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
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
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
    },
    title: {
        fontSize: 16
    }
});