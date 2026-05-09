import React from 'react';
import { Image, ImageSource } from 'expo-image';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { Monogram } from '@/components/Monogram';

type CustomHeaderProps = {
    imageUrl: string | undefined;
    title: string;
}

export default function CustomHeader({ imageUrl, title }: CustomHeaderProps) {
  let baseUrl: string | undefined = imageUrl? imageUrl.slice(0, imageUrl.indexOf("?")) : undefined;

  let icon: React.ReactElement;
  if (baseUrl) {
    const imageSource: ImageSource = { uri: baseUrl };
    icon = <Image source={imageSource} style={styles.headerIcon} />;
  } else {
    icon = <Monogram name={title} size={40} />;
  } 

  return (
      <View style={styles.headerContainer}>
        {icon}
        <Text style={styles.headerText}>{title}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    columnGap: 10
  },
  headerIcon: {
    width: 40, 
    height: 40, 
    borderRadius: 20
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
});