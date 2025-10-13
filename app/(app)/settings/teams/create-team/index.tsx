import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Pressable, 
    TouchableOpacity, 
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';
import { CreateTeamRequest } from '@/entities/index'
import Modal from 'react-native-modal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TeamInvitationForm from '@/components/TeamInvitationForm';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    createTeam, 
    selectTeamsCreateStatus, 
    selectTeamsCreateError,
    selectTeamIds,
    selectTeamsById
} from '@/store/teams/teamsSlice';
import EditEmailForm from '@/components/EditEmailForm';

interface EmailItem {
    key: string;
}

interface CreateTeamFormData {
    teamName: string;
    emails: EmailItem[];
}

export default function CreateTeamPage() {
    const MAX_PLAYERS = 24;
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedEmail, setSelectedEmail] = useState('');
    const { control, handleSubmit } = useForm<CreateTeamFormData>({
        defaultValues: {
            teamName: '',
            emails: []
        },
    });
    // Use useFieldArray to manage the dynamic 'emails' array
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "emails" as const,
    });
    const dispatch = useAppDispatch();
    const createStatus = useAppSelector(selectTeamsCreateStatus)
    const createError = useAppSelector(selectTeamsCreateError)
    const teamIds = useAppSelector(selectTeamIds)
    const lastTeamId = (teamIds.length > 0)? teamIds[teamIds.length - 1] : null
    const lastTeamCreated = useAppSelector(state =>
        lastTeamId ? selectTeamsById(state, lastTeamId) : null 
    )

    const addEmail = (email: string) => {
        // Simple validation check before adding
        const isEmailTaken = fields.some(emailItem => emailItem.key === email)
        if (email && !isEmailTaken) {
            append({key: email})
            console.log(`Added email: ${email}`);
        }
        setInviteModalVisible(false)
        setSelectedIndex(-1); 
    };

    const editEmail = (newEmail: string, oldEmail: string) => {
        const isSame = newEmail === oldEmail
        // check if new email is unique before making change
        const isEmailTaken = fields.some(emailItem => emailItem.key === newEmail)
        if (newEmail && !isSame && !isEmailTaken) {
            update(selectedIndex, { key: newEmail });
        }
        setEditModalVisible(false)
    }

    function showInviteFriendModal() {
        const count = fields.length
        if (count < MAX_PLAYERS) {
            setInviteModalVisible(true)
        }
        else {
            alert('You can have up to ' + MAX_PLAYERS + ' players in your team.');
        }
    }

    function onCreateTeamButtonPressed(data: CreateTeamFormData) {
        const now: Date = new Date();
        const emails = data.emails.map(item => item.key);
        const isoString: string = now.toISOString();
        const createTeamRequest: CreateTeamRequest = {
            name: data.teamName,
            playersToInvite: emails,
            createdAt: isoString
        }
        dispatch(createTeam(createTeamRequest))
    }

    const closeRow = (rowMap: RowMap<{key: string;}>, rowKey: string) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const editRow = (rowMap: RowMap<{key: string;}>, rowKey: string) => {
        const index = fields.findIndex(item => item.key === rowKey);
        if (index > -1) {
            // set selected email
            setSelectedIndex(index);
            setSelectedEmail(rowKey)
            // close row
            closeRow(rowMap, rowKey)
            // show edit modal, passing the index
            setEditModalVisible(true)
        }
    }

    const deleteRow = (rowMap: RowMap<{key: string;}>, rowKey: string) => {
        const index = fields.findIndex(item => item.key === rowKey);
        if (index > -1) {
            // Use 'remove' to delete by index
            remove(index);
        }
    };

    let view: React.JSX.Element = <></>;
    if (createStatus === 'idle') {
        view = <View style={styles.container}>
            <View style={styles.main}>
                <Controller
                    control={control}
                    name="teamName"
                    rules={{ required: 'Team name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <View>
                            <Text style={styles.text}>Team Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter team name"
                            />
                            {error && <Text style={styles.errorText}>{error.message}</Text>}
                        </View>
                    )}
                />

                <Text style={styles.text}>Upload Team Logo</Text>
                <Text style={[styles.subtext, styles.marginAtBottom]}>Upload a PNG or JPG under 8MB.</Text>

                <Text style={styles.text}>Invite Players</Text>
                <View style={styles.horizontalFlexContainer}>
                    <Text style={styles.subtext}>You can have up {MAX_PLAYERS} players in your team.</Text>
                    <Pressable onPress={showInviteFriendModal}>
                        <FontAwesome6 name="user-plus" size={24} color="black" /> 
                    </Pressable>
                    
                </View>
                <View style={styles.listContainer}>
                    <SwipeListView
                        data={fields}
                        renderItem={ (data, rowMap) => (
                            <View style={styles.item}>
                                <Text>{data.item.key}</Text>
                            </View>
                        )}
                        renderHiddenItem={ (data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnLeft]}
                                    onPress={() => editRow(rowMap, data.item.key)}
                                >
                                    <Text style={styles.backTextWhite}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                    onPress={() => {
                                        deleteRow(rowMap, data.item.key)
                                    }}
                                >
                                    <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        rightOpenValue={-150}
                    />
                </View>
                
            </View>
            <Pressable
                onPress={handleSubmit(onCreateTeamButtonPressed)}
                style={styles.buttonContainer}
            >
                <Text style={styles.buttonText}>Create Team</Text>
            </Pressable>

            <Modal
                isVisible={inviteModalVisible}
                onSwipeComplete={() => { 
                    setInviteModalVisible(!inviteModalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <TeamInvitationForm onInvite={addEmail} onClose={() => {}}/>
            </Modal>

            <Modal
                isVisible={editModalVisible}
                onSwipeComplete={() => { 
                    setInviteModalVisible(!editModalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <EditEmailForm oldEmail={selectedEmail} onSubmit={editEmail} onClose={() => {}}/>
            </Modal>
        </View>
    }
    else if (createStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (createStatus === 'succeeded' && lastTeamCreated) {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>Team {lastTeamCreated.name} successfully created.</Text>
        </View>
    }
    else {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{createError}</Text>
        </View>
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {view}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        margin: 12
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    main: {
        flex: 1
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
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
    listContainer: {
        flex: 1,
        marginTop: 10,
    },
    item: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    buttonContainer: {
        marginHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        marginBottom: 20,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});