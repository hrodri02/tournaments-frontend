import React from 'react';
import { StyleSheet, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { logoutRequest, selectAuthStatus, selectAuthError } from '@/store/auth/auth.slice';

export default function SettingsScreen() {
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector(selectAuthStatus)
  const authError = useAppSelector(selectAuthError)
  const myAccountSectionItems = ['Become an Admin', 'Change City (Puebla)', 'Delete Account']

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
        {authStatus === 'failed' && <Text style={styles.errorView}>{authError}</Text>}
        <TouchableOpacity style={styles.button} onPress={() => {
          dispatch(logoutRequest())
        }}>
          <Text style={styles.buttonText}>Log Out</Text>
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
    backgroundColor: '#0000ff',
    marginBottom: 20
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 12
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
