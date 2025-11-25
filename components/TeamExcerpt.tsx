import React from 'react';
import { 
    View, 
    ViewStyle, 
    Text, 
    StyleSheet 
} from 'react-native';
import { Team } from '@/entities/index';

type TeamExcerptProps = {
    team: Team;
    style?: ViewStyle;
}

export function TeamExcerpt({ team, style }: TeamExcerptProps) {
    return (
        <View style={style}>
            <Text style={styles.title}>{team.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 14
    }
});