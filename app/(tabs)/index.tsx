import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Game } from '../../models/game';
import { GameView } from '../../components/GameView';

const styles = StyleSheet.create({
  container: {
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
    padding: 10,
    height: 44,
  },
});

export default function HomeScreen() {
  const games1: Game[] = [
    new Game('Golden Gate Park - field 1', '4:00 pm', 1),
    new Game('Golden Gate Park - field 2', '6:00 pm', 2)
  ];

  const games2: Game[] = [
    new Game('Crocker Park - field 1', '5:00 pm', 2),
    {location: 'Crocker Park - field 2', startTime: '8:00 pm', durationInHours: 2}
  ];

 return (
  <View style={styles.container}>
      <SectionList
        sections={[
          {title: '8/2', data: games1},
          {title: '8/5', data: games2},
        ]}
        renderItem={({item}) => 
          <GameView style={styles.item} game={item}/>
        }
        renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item.location}`}
      />
    </View>
 );
}