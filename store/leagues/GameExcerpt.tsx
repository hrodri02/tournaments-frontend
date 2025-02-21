import React from 'react'; 
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

interface Game {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: string;
}
  
type GameExcerptProps = {
    game: Game;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        alignContent: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
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
        fontSize: 24,
        textAlign: 'center',
        alignContent: 'center',
        flex: 1,
        color: 'white',
        borderLeftWidth: 3,
        borderLeftColor: 'white',
    }
})

export function GameExcerpt({ game, style }: GameExcerptProps) {
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
                    <Text style={styles.text}>{game.homeTeam}</Text>
                </View>

                <View style={styles.teamView}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <Text style={styles.text}>{game.awayTeam}</Text>
                    </View>
                </View>

                <Text style={styles.date}>{game.date}</Text>
            </View>
            </Pressable>
        </Link>
    )
}   
