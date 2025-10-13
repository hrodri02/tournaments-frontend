import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Team } from '@/entities/index';

const DATA: Team[] = [
    {
        id: 1,
        name: 'Club America',
        ownerId: 1,
        playerIds: []
    },
    {
        id: 2,
        name: 'Toluca FC',
        ownerId: 1,
        playerIds: []
    },
];

type ItemProps = {
    item: Team;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
    <Pressable onPress={onPress} style={[styles.item, {backgroundColor}]}>
        <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
    </Pressable>
);

export default function TeamsPage() {
    const [selectedId, setSelectedId] = useState<number>();

    const renderItem = ({item}: {item: Team}) => {
        const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
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

    return (
        <SafeAreaView style={[styles.safeAreaContainer, styles.perfectCentering]}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
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
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16
    }
});