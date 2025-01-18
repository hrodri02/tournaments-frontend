import React from 'react';
import { SectionList, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;

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
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5em',
    padding: 10,
    marginVertical: 5,
  },
  image: {
    borderRadius: '10px',
    height: screenHeight * 0.1,
    width: screenHeight * 0.1,
    backgroundColor: '#0000aa'
  },
  textView: {
  },
  itemHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubheader: {
    fontSize: 12,
  }
});

export default function HomeScreen() {
  return (
    <SectionList
      style={styles.container}
      sections={[
        {title: 'Upcomming Leagues', data: [1,2]},
        {title: 'Current Leagues', data: [1,2]},
        {title: 'Previous Leagues', data: [1,2]},
      ]}
      renderItem={({item}) => 
        <View style={styles.item}>
          <Image style={styles.image}/>
          <View style={styles.textView}>
            <Text style={styles.itemHeader}>Premier Leage at Hawk</Text>
            <Text style={styles.itemSubheader}>Tuesday Night League</Text>
          </View>
        </View>
      }
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}
