import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { 
    StyleSheet, 
    View, 
    Text, 
    SectionList, 
    Pressable, 
    ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/hooks/useStore';
import { selectTeamsById } from '@/store/teams/teamsSlice';


export default function TeamDetailPage() {
    const { id } = useLocalSearchParams();
    const teamId = Number(id);
    const team = useAppSelector(state => selectTeamsById(state, teamId));
    const navigation = useNavigation();

    useLayoutEffect(() => {
        if (team?.name) {
          navigation.setOptions({ title: team.name });
        }
      }, [navigation, team?.name]);

    return (
        <SafeAreaView style={[styles.safeAreaContainer, styles.perfectCentering]}>
            <Text style={styles.title}>{team.name}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
    },
    title: {
        fontSize: 16
    }
});