import React from 'react'; 
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Game } from '@/entities/index';
import { format } from 'date-fns';

const screenHeight = Dimensions.get('window').height;

type GameExcerptProps = {
    game: Game;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        alignContent: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: { 
        backgroundColor: 'yellow',
        width: screenHeight * 0.1,
        height: screenHeight * 0.1,
    },
    teamViews: {
        flex: 3,
    },
    teamView: { 
        columnGap: '0.5em',
        padding: 10,
        flex: 1,
        flexDirection: 'row',    
    },
    date: { 
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
        alignContent: 'center',
        fontWeight: 'bold',
        flex: 1,
        borderLeftWidth: 1
    }
})

export function GameExcerpt({ game, style }: GameExcerptProps) {
    const date = Date.parse(game.date);
    const formattedDate = format(date, 'eee, MMM i pp');

    return (
        <Link href={{
            pathname: './games/[id]',
            params: {id: game.id}
        }} asChild>
            <Pressable>
            <View style={style}>
                <View style={styles.teamViews}>
                <View style={styles.teamView}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <Text style={styles.text}>{game.homeTeam.name}</Text>
                </View>

                <View style={styles.teamView}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <Text style={styles.text}>{game.awayTeam.name}</Text>
                    </View>
                </View>

                <Text style={styles.date}>{formattedDate}</Text>
            </View>
            </Pressable>
        </Link>
    )
}   
