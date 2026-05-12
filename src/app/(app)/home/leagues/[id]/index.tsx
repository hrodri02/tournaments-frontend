import React, { 
  useEffect, 
  useLayoutEffect, 
  useMemo 
} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
  selectGamesStatus, 
  fetchGames, 
  selectGamesError
} from '@/store/games/gamesSlice';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { makeSelectDenormalizedGames } from '@/store/games/gamesSlice';
import { useTranslation } from 'react-i18next';

export default function LeagueScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation(['home', 'errors']);
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
    if (league) {
      navigation.setOptions({
        headerTitle: () => (
            <CustomHeader
              imageUrl={league.logoUrl}
              title={league.name}
            />
        )
      });
    }
  }, [league, navigation]);

  const handleMenuButtonPressed = () => {
    const options = [
      t('upcoming_league.upload_league_logo_option'),
      t('common:cancel_button'),
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
          router.push(`./${leagueId}/upload-league-logo`);
          break;
        case 1:
          break;
        }
      }
    );
  };

  useLayoutEffect(() => {
    if (user) {
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
  }, [navigation, user, handleMenuButtonPressed]);

  const getFetchGamesErrorMessage = (): string => {
    const error = gamesError!
    const message = t(`errors:${error.errorKey}`);
    return message;
  }

  let view: React.JSX.Element = <></>;
  if (gamesStatus === 'idle' || gamesStatus === 'succeeded') {
    view = <FlatList
      ListHeaderComponent={<Text style={styles.header}>{t('league.schedule_title')}</Text>}
      data={games}
      renderItem={({ item }) => (
        <GameExcerpt game={item} />
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
      <Text>{getFetchGamesErrorMessage()}</Text>
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
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 2,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 2,
    borderBottomWidth: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});