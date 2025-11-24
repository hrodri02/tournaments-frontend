import React, { useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/useStore';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { makeSelectTeamsByIds } from '@/store/teams/teamsSlice';
import { TeamExcerpt } from '@/components/TeamExcerpt';

// TODO: in addition to displaying the teams that are part of the league
// show the menu button in this page to view the applications to the league
export default function UpcomingLeaguePage() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const selectTeamsByIds = useMemo(
        () => makeSelectTeamsByIds(league.teamIds),
        []
    );
    const teams = useAppSelector(selectTeamsByIds);
    
    useLayoutEffect(() => {
        if (league?.name) {
          navigation.setOptions({ title: league.name });
        }
      }, [navigation, league?.name]);

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