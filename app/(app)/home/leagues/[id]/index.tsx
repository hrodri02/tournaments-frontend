import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Pressable 
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
  selectGamesStatus, 
  fetchGames, 
  makeSelectGamesByLeagueId, 
  selectGamesError
} from '@/store/games/gamesSlice';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "@/contexts/AuthContext";

export default function LeagueScreen() {
  const { user, isLoading } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const leagueId = Number(id);
  const league = useAppSelector(state => selectLeagueById(state, leagueId));
  const gamesStatus = useAppSelector(selectGamesStatus);
  const gamesError = useAppSelector(selectGamesError);
  const selectGamesOfLeague = useMemo(
    () => makeSelectGamesByLeagueId(leagueId),
    []
  );
  const gamesOfLeague = useAppSelector(selectGamesOfLeague);

  // fetch games if they haven't already
  useEffect(() => {
    if (gamesStatus === 'idle') {
      dispatch(fetchGames(leagueId));
    }
  }, [dispatch, gamesStatus]);

  useLayoutEffect(() => {
    if (league?.name) {
      navigation.setOptions({ title: league.name });
    }
  }, [navigation, league?.name]);

  const handlePress = () => {
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
            console.log('display applications page');
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
              onPress={handlePress}
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
  }, [navigation, user, isLoading, handlePress])

  let view: React.JSX.Element = <></>;
  if (gamesStatus === 'idle' || gamesStatus === 'succeeded') {
    view = <FlatList
      ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      data={gamesOfLeague}
      renderItem={({ item }) => (
        <GameExcerpt game={item} style={styles.item} />
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
  topRightNavButton: {
    marginHorizontal: 20,
  },
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