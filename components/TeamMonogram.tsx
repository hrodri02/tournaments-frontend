import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PALETTE = [
    '#E53935',
    '#8E24AA',
    '#1E88E5',
    '#00897B',
    '#43A047',
    '#FB8C00',
    '#F4511E',
    '#D81B60',
    '#6D4C41',
    '#039BE5',
];

function hashColor(name: string): string {
    let h = 5381;
    for (let i = 0; i < name.length; i++) {
        h = (h * 33) ^ name.charCodeAt(i);
    }
    return PALETTE[Math.abs(h) % PALETTE.length];
}

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.[0] ?? '';
    const second = words[1]?.[0] ?? '';
    return (first + second).toUpperCase();
}

type TeamMonogramProps = {
    name: string;
    size: number;
}

export function TeamMonogram({ name, size }: TeamMonogramProps) {
    const bg = hashColor(name);
    const initials = getInitials(name);
    const fontSize = Math.round(size * 0.38);

    return (
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
