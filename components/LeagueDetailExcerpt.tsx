import React from 'react';
import { 
    View, 
    ViewStyle, 
    Text, 
    StyleSheet 
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// the type of the name property of Ionicons component
type IoniconsName = keyof typeof Ionicons.glyphMap;

export interface LeagueDetail {
    id: number;
    iconName: IoniconsName;
    description: string;
    text: string;
}

type LeagueDetailExcerptProps = {
    detail: LeagueDetail;
    style?: ViewStyle;
}

export function LeagueDetailExcerpt({ detail, style }: LeagueDetailExcerptProps) {
    return (
        <View style={[style, styles.rowContainer]}>
            <Ionicons name={detail.iconName} size={24} color="black" />
            <Text style={styles.title}>{detail.description}:</Text>
            <Text style={styles.subtitle}>{detail.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 14
    }
});