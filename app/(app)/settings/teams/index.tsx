import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { 
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    Pressable, 
    ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Team } from '@/entities/index';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    fetchTeams, 
    selectAllTeams, 
    selectTeamsFetchError, 
    selectTeamsFetchStatus 
} from '@/store/teams/teamsSlice';

type ItemProps = {
    item: Team;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
    <Link href={{
                pathname: '/(app)/settings/teams/[id]',
                params: {id: item.id}
              }} asChild>
        <Pressable onPress={onPress} style={styles.item}>
            <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
        </Pressable>              
    </Link>
);

export default function TeamsPage() {
    const [selectedId, setSelectedId] = useState<number>();
    const dispatch = useAppDispatch();
    const fetchStatus = useAppSelector(selectTeamsFetchStatus)
    const fetchError = useAppSelector(selectTeamsFetchError)
    const teams = useAppSelector(selectAllTeams);

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchTeams());
        }
    }, [fetchStatus, dispatch]);

    const renderItem = ({item}: {item: Team}) => {
        const backgroundColor = item.id === selectedId ? '#424242' : '#E0E0E0';
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

    let view: React.JSX.Element = <></>;
    if (fetchStatus === 'idle' || fetchStatus === 'succeeded') {
        view = <FlatList
            data={teams}
            renderItem={renderItem}
            style={styles.container}
        />
    }
    else if (fetchStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{fetchError}</Text>
        </View>
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {view}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 10,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#E0E0E0'
    },
    title: {
        fontSize: 16
    }
});