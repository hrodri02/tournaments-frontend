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

  let content: React.ReactNode
  if (authStatus === 'succeeded') {
    content = <>
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
                  <TouchableOpacity style={styles.button} onPress={() => {
                    dispatch(logoutRequest())
                  }}>
                    <Text style={styles.buttonText}>Log Out</Text>
                  </TouchableOpacity>
              </>
  }
  else if (authStatus === 'loading') {
    content = <ActivityIndicator size="large" color="#0000ff"/>
  }
  else if (authStatus === 'failed') {
    content = <Text style={styles.errorView}>{authError}</Text>
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {content}
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
  },
  errorView: {
    textAlign: 'center'
  }
});
