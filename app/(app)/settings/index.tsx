import React from 'react';
import { StyleSheet, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MyAccountExcerpt } from '@/components/MyAccountExcerpt';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { logout, isLoading } = useAuth();
  const myAccountSectionItems = ['Become an Admin', 'Teams', 'Change City (Puebla)', 'Delete Account'];
  const pathnames = ['', '/(app)/settings/teams', '', ''];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SectionList
          style={styles.sectionList}
          sections={[
            {title: 'My Account', data: myAccountSectionItems},
          ]}
          renderItem={({item, index}) => 
            <MyAccountExcerpt style={styles.item} pathname={pathnames[index]}>{item}</MyAccountExcerpt>
          }
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
        />
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={logout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log Out</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#ff3b30',
    marginBottom: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorView: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'red',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 8
  }
}); 