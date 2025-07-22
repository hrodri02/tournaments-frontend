import React from 'react';
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { League, LeagueStatus } from '@/entities/index';
import { parseISO, format, addWeeks } from 'date-fns';
const screenHeight = Dimensions.get('window').height;

type LeagueExcerptProps = {
    league: League;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
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
    if (!league) {
        return null;
    }

    const startDate = parseISO(league.startDate)
    const endDate = addWeeks(startDate, league.durationInWeeks)
    const formattedStartDate = format(startDate, 'MMMM d y');
    const formattedEndDate = format(endDate, 'MMMM d y')

    const renderLeagueDateText = (league: League): JSX.Element | null => {
        switch (league.status) {
            case LeagueStatus.notStarted:
                return <Text style={styles.itemSubheader}>Starts {formattedStartDate}</Text>
            case LeagueStatus.inProgress:
                return <Text style={styles.itemSubheader}>Started {formattedStartDate}</Text>
            case LeagueStatus.ended:
                return <Text style={styles.itemSubheader}>Ended {formattedEndDate}</Text>
            default:
                return null;
        }
    }
    
    return(
        <Link href={{
            pathname: '/(app)/home/leagues/[id]',
            params: {id: league.id}
          }} asChild>
            <Pressable>
                <View style={style}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <View style={styles.leagueDetails}>
                        <Text style={styles.itemHeader}>{league.name}</Text>
                        {renderLeagueDateText(league)}
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}