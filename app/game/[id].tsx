import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
      navigation.setOptions({ title: 'Game Details', headerTitleAlign: 'center' });
  }, [navigation])

  return (
    <View>
      <Text>Game: {id}</Text>
    </View>
  );
}