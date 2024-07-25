import React from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { Game } from '../models/game';

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
        <View style={style}>
            <Text style={styles.textFont}>{game.location} at {game.startTime} ({game.durationInHours} hours)</Text>
        </View>
    );
}