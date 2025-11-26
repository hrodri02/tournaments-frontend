import React, { 
  useEffect, 
  useLayoutEffect, 
  useMemo 
} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
  selectGamesStatus, 
  fetchGames, 
  selectGamesError
} from '@/store/games/gamesSlice';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { makeSelectDenormalizedGames } from '@/store/teams/teamsSlice';

export default function LeagueScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const leagueId = Number(id);
  const league = useAppSelector(state => selectLeagueById(state, leagueId));
  const gamesStatus = useAppSelector(selectGamesStatus);
  const gamesError = useAppSelector(selectGamesError);
  const selectDenormalizedGames = useMemo(
    () => makeSelectDenormalizedGames(leagueId),
    [leagueId]
  );
  const games = useAppSelector(selectDenormalizedGames);

  // fetch games if they haven't already
  useEffect(() => {
    if (gamesStatus === 'idle') {
      dispatch(fetchGames());
    }
  }, [dispatch, gamesStatus]);

  useLayoutEffect(() => {
    if (league?.name) {
      navigation.setOptions({ title: league.name });
    }
  }, [navigation, league?.name]);

  let view: React.JSX.Element = <></>;
  if (gamesStatus === 'idle' || gamesStatus === 'succeeded') {
    view = <FlatList
      ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      data={games}
      renderItem={({ item }) => (
        <GameExcerpt 
          game={item}
          style={styles.item} 
        />
      )}
    />
  }
  else if (gamesStatus === 'loading') {
    view = <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  }
  else {
    view = <View style={styles.loadingContainer}>
      <Text>{gamesError}</Text>
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
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    borderBottomWidth: 1
  },
  separator: {
    borderWidth: 0.5,
    borderColor: 'black'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});