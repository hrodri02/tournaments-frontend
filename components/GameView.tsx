import React from 'react';
import { View, ViewStyle, Text, StyleSheet, Pressable } from 'react-native';
import { Game } from '../models/game';
import { Link } from 'expo-router';

type GameViewProps = {
    game: Game;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    textFont: {
        fontSize: 18
    }
});

export function GameView({ game, style }: GameViewProps) {
    return(
        <Link href={{
            pathname: '/game/[id]',
            params: {id: game.id}
          }} asChild>
            <Pressable>
                <View style={style}>
                    <Text style={styles.textFont}>{game.location} at {game.startTime} ({game.durationInHours} hours)</Text>
                </View>
            </Pressable>
        </Link>
    );
}