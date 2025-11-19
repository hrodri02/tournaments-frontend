import React from 'react';
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { League, LeagueStatus } from '@/entities/index';
import { parseISO, format, addWeeks } from 'date-fns';
const screenHeight = Dimensions.get('window').height;

type LeagueExcerptProps = {
    league: League;
    style?: ViewStyle;
    clickable?: boolean;
    imageSideLength?: number
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
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

export function LeagueExcerpt({ league, style, clickable = false, imageSideLength = screenHeight * 0.1 }: LeagueExcerptProps) {
    if (!league) {
        return null;
    }

    const startDate = parseISO(league.startDate)
    const endDate = addWeeks(startDate, league.durationInWeeks)
    const formattedStartDate = format(startDate, 'MMMM d y');
    const formattedEndDate = format(endDate, 'MMMM d y')

    const renderLeagueDateText = (league: League): React.JSX.Element | null => {
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

    const content = (
        <View style={style}>
            <Image 
                style={[styles.image, {width: imageSideLength, height: imageSideLength } ]} 
                source={require('@/assets/images/liga_mx_logo.jpeg')}
            />
            <View style={styles.leagueDetails}>
                <Text style={styles.itemHeader}>{league.name}</Text>
                {renderLeagueDateText(league)}
            </View>
        </View>
    );
    
    if (clickable) {
        return (
            <Link href={{
                pathname: '/(app)/home/leagues/[id]',
                params: {id: league.id}
            }} asChild>
                <Pressable>
                    {content}
                </Pressable>
            </Link>
        );
    }
    
    return content;
}