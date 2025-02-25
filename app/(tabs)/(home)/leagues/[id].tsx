import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';
import { useAppSelector } from '@/hooks/useStore';
import { selectGamesByLeagueId } from '@/store/leagues/leaguesSlice';
import { useLocalSearchParams } from 'expo-router';

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
    backgroundColor: 'black',
    fontSize: 28,
    color: 'white', 
    borderBottomWidth: 6,
    borderBottomColor: 'white'
   },
   flatlist: { 
    backgroundColor: 'black',
   },
   separator: { 
    borderWidth: 3,
    borderColor: 'white',    
   }
})

export default function LeagueScreen() {
  const { id } = useLocalSearchParams()
  const leagueId = Number(id)
  const gamesOfLeague = useAppSelector(state => selectGamesByLeagueId(state, leagueId))

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList style={styles.flatlist}
          ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
          ItemSeparatorComponent={() => (<View style={styles.separator}></View>)}
          data={gamesOfLeague}
          renderItem={({item}) => 
            <GameExcerpt game={item} style={styles.item}></GameExcerpt>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
  