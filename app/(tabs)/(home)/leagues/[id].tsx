// use JSX within javascript
import React from 'react';
// We are going to be showing a list of games that are coming up
import { FlatList, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
// We use SafeAreaView, so that the views that we add do not cover the bottom nav bar or the top status bar on mobile devices.
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {addDays, format} from 'date-fns';
import { Header } from 'react-native/Libraries/NewAppScreen';
const screenHeight = Dimensions.get('window').height;
// create a styles object to style our views/components
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // TODO: add a background color prop to see the safe area
    // backgroundColor: 'blue',    
   },
   text: {
    textAlign: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
   },
   image: { 
    backgroundColor: 'yellow',
    width: screenHeight * 0.1,
    height: screenHeight * 0.1,
   },
   item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
   },
   teamViews: {
    flex: 3,
   },
   teamView: { 
    columnGap: '0.5em',
    padding: 10,
    flex: 1,
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
   date: { 
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    alignContent: 'center',
    flex: 1,
    color: 'white',
    borderLeftWidth: 3,
    borderLeftColor: 'white',
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
	name1: "Barcelona",
	name2: "Chivas",
	date: format(new Date(2025, 1, 6), 'eee, MMM i pp'),
  },
  {
	name1: "Pumas",
	name2: "America",
	date: format(new Date(2025, 1, 3), 'eee, MMM i pp')
  
  },		
  {
  name1: "Toluca",
  name2: "Monterey",
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
        
          <View style={styles.item}>
            <View style={styles.teamViews}>
            <View style={styles.teamView}>
              <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
              <Text style={styles.text}>{item.name1}</Text>
            </View>

            <View style={styles.teamView}>
              <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
              <Text style={styles.text}>{item.name2}</Text>
            </View>
            </View>

            <Text style={styles.date}> {item.date}</Text>
          </View>
          }
        />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  