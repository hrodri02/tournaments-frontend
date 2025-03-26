import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector } from '@/hooks/useStore';
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
   }
})

export default function LeagueScreen() {
  const { id } = useLocalSearchParams()
  const navigation = useNavigation();
  const leagueId = Number(id)
  const league = useAppSelector(state => selectLeagueById(state, leagueId));

  useLayoutEffect(() => {
    if (league.name) {
      navigation.setOptions({ title: league.name });
    }
  }, [navigation, league.name]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
          ItemSeparatorComponent={() => (<View style={styles.separator}></View>)}
          data={league.games}
          renderItem={({item}) => 
            <GameExcerpt game={item} style={styles.item}></GameExcerpt>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
  