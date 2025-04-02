import { StyleSheet, Text, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const myAccountSectionItems = ['Become an Admin', 'Change City (Puebla)', 'Delete Account'];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SectionList
          style={styles.sectionList}
          sections={[
            {title: 'My Account', data: myAccountSectionItems},
          ]}
          renderItem={({item}) => 
            <Text style={styles.item}>{item}</Text>
          }
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionList: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    fontSize: 12,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0000ff',
    marginBottom: 20
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 12
  }
});
