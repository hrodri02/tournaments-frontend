import React from 'react';
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { League } from '@/entities/index';
import { parseISO, format } from 'date-fns';
const screenHeight = Dimensions.get('window').height;

type LeagueExcerptProps = {
    league: League;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    image: {
        borderRadius: '10px',
        height: screenHeight * 0.1,
        width: screenHeight * 0.1,
    },
    itemHeader: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemSubheader: {
        fontSize: 12,
    },
    leagueDetails: {
        justifyContent: 'center',
    }
});

export function LeagueExcerpt({ league, style }: LeagueExcerptProps) {
    const date = parseISO(league.date)
    const day = format(date, 'cccc');
    const timeOfDay = format(date, 'BBBB')
    return(
        <Link href={{
            pathname: '/leagues/[id]',
            params: {id: league.id}
          }} asChild>
            <Pressable>
                <View style={style}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <View style={styles.leagueDetails}>
                        <Text style={styles.itemHeader}>{league.name}</Text>
                        <Text style={styles.itemSubheader}>{day} {timeOfDay}</Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}