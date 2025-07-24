import React, { useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectGamesStatus, fetchGames, makeSelectGamesByLeagueId } from '@/store/games/gamesSlice';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

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

export default function LeagueScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const leagueId = Number(id);
  const league = useAppSelector(state => selectLeagueById(state, leagueId));
  const gamesStatus = useAppSelector(selectGamesStatus);
  const selectGamesOfLeague = useMemo(
    () => makeSelectGamesByLeagueId(leagueId),
    []
  );
  const gamesOfLeague = useAppSelector(selectGamesOfLeague);

  // fetch games if they haven't already
  React.useEffect(() => {
    if (gamesStatus === 'idle') {
      dispatch(fetchGames(leagueId));
    }
  }, [dispatch, gamesStatus]);

  useLayoutEffect(() => {
    if (league?.name) {
      navigation.setOptions({ title: league.name });
    }
  }, [navigation, league?.name]);

  if (gamesStatus === 'loading') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!gamesOfLeague) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <Text>Games not found</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={gamesOfLeague}
          renderItem={({ item }) => (
            <GameExcerpt game={item} style={styles.item} />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
  