import React, { ReactNode } from 'react';
import { 
    Platform,
    View,
    StyleSheet,
    Keyboard,
    Pressable,
} from 'react-native';

type DismissKeyboardProps = { children: ReactNode }

const DismissKeyboard = ({ children }: DismissKeyboardProps) => {
    // If it's Web, just return a View so it doesn't interfere with clicks
    if (Platform.OS === 'web') return <View style={styles.container}>{children}</View>;

    // If it's Mobile, use the Pressable to dismiss the keyboard
    return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        {children}
    </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default DismissKeyboard;