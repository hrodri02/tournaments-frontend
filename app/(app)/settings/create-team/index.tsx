import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CreateTeamPage() {
    const [text, onChangeText] = useState('');
    const [email, onChangeEmail] = useState('');
    const [inviteModalVisible, setInviteModalVisible] = useState(false);

    function showInviteFriendModal() {
        setInviteModalVisible(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Team Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Enter team name"
            />

            <Text style={styles.text}>Upload Team Logo</Text>
            <Text style={[styles.subtext, styles.marginAtBottom]}>Upload a PNG or JPG under 8MB.</Text>

            <Text style={styles.text}>Upload Team Logo</Text>
            <View style={[styles.horizontalFlexContainer, styles.marginAtBottom]}>
                <Text style={styles.subtext}>You can have up 24 players in your team.</Text>
                <Pressable onPress={showInviteFriendModal}>
                    <FontAwesome6 name="user-plus" size={24} color="black" /> 
                </Pressable>
            </View>

            <Modal
                isVisible={inviteModalVisible}
                onSwipeComplete={() => { 
                    setInviteModalVisible(!inviteModalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Invite a Friend</Text>
                    <TextInput
                        style={[styles.input, styles.whiteBackground]}
                        onChangeText={onChangeEmail}
                        value={email}
                        placeholder="Enter email"
                    />

                    <Button
                        onPress={() => {console.log('send invite')}}
                        title="Invite"
                        color="#007AFF"
                        accessibilityLabel="Invite friend to your team"
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    subtext: {
        fontSize: 16,
    },
    marginAtBottom: {
        marginBottom: 20
    },
    horizontalFlexContainer: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        marginTop: 44,
        borderRadius: 20,
        padding: 35,
        backgroundColor: '#777',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    whiteBackground: {
        backgroundColor: 'white'
    }
});