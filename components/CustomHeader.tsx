import React from 'react';
import { Image } from 'expo-image';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';

type CustomHeaderProps = {
    imageUrl: string | undefined;
    title: string;
}

export default function CustomHeader({ imageUrl, title }: CustomHeaderProps) {
  let baseUrl: string | undefined = imageUrl? imageUrl.slice(0, imageUrl.indexOf("?")) : undefined;
  return (
      <View style={styles.headerContainer}>
        {
          imageUrl &&
          <Image
            source={{uri: baseUrl}}
            style={styles.headerIcon}
          />
        }
          
        <Text style={styles.headerText}>{title}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Align image and text horizontally
    alignItems: 'center', // Vertically center the items
    // Add margin if you want it further from the back button
  },
  headerIcon: {
    width: 40, // Adjust size as needed
    height: 40, 
    marginRight: 10, // Space between image and text
    borderRadius: 20
  },
  headerText: {
    fontSize: 18, // Adjust font size to match standard header
    fontWeight: 'bold', // Optional: Match header bolding
    color: '#000', // Optional: Set color
  },
});