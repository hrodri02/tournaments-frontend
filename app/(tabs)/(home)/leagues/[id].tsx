import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { GameExcerpt } from '@/store/leagues/GameExcerpt';

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

const DATA = [
  {
    id: 0,
    homeTeam: "Barcelona",
    awayTeam: "Chivas",
    date: format(new Date(2025, 1, 6), 'eee, MMM i pp')
  },
  {
    id: 1,
    homeTeam: "Pumas",
    awayTeam: "America",
    date: format(new Date(2025, 1, 3), 'eee, MMM i pp')
  },		
  {
    id: 2,
    homeTeam: "Toluca",
    awayTeam: "Monterey",
    date: format(new Date(2025, 1, 3), 'eee, MMM i pp')
  }
];

export default function LeagueScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList style={styles.flatlist}
          ListHeaderComponent={<Text style={styles.header}>Schedule</Text>}
          ItemSeparatorComponent={() => (<View style={styles.separator}></View>)}
          data={DATA}
          renderItem={({item}) => 
            <GameExcerpt game={item} style={styles.item}></GameExcerpt>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
  