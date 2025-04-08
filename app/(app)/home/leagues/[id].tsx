import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectLeagueById, selectLeaguesStatus, fetchLeagues } from '@/store/leagues/leaguesSlice';
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
  const leaguesStatus = useAppSelector(selectLeaguesStatus);
  const league = useAppSelector(state => selectLeagueById(state, leagueId));

  // Fetch leagues if not already loaded
  React.useEffect(() => {
    if (leaguesStatus === 'idle') {
      dispatch(fetchLeagues());
    }
  }, [dispatch, leaguesStatus]);

  useLayoutEffect(() => {
    if (league?.name) {
      navigation.setOptions({ title: league.name });
    }
  }, [navigation, league?.name]);

  if (leaguesStatus === 'loading') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!league) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <Text>League not found</Text>
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
          data={league.games}
          renderItem={({ item }) => (
            <GameExcerpt game={item} style={styles.item} />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
  