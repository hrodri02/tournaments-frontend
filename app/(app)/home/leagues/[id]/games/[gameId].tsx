import React, { useLayoutEffect, useState } from 'react'; 
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/hooks/useStore';
import { selectGameById, selectLeagueById } from '@/store/leagues/leaguesSlice';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const { id, gameId } = useLocalSearchParams();
    const leagueId = Number(id);
    const gameID = Number(gameId);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const game = useAppSelector(state => selectGameById(league, gameID))
    
    const navigation = useNavigation(); 
    useLayoutEffect(() => { 
        navigation.setOptions({
            title: 'HomeTeam vs AwayTeam',
            headerTitleAlign: 'center'
        }); 
    }, [navigation]);

    return (
        <SafeAreaView>
            <Text style={styles.date}>Monday, March 17 at Golden Gate Park</Text>
            
            <View style={styles.gameStatView}> 
                <View style={styles.teamLogo}> 
                    <Image 
                        style={styles.teamLogoImage} 
                        source={require('@/assets/images/liga_mx_logo.jpeg')}
                        resizeMode='contain'
                    />
                    <Text style={styles.text}>HomeTeam </Text>
                </View>

                <View style={styles.equalWidth}>
                    <Text style={styles.score}> 1 - 0 </Text>
                </View>

                <View style={styles.teamLogo}> 
                    <Image 
                        style={styles.teamLogoImage} 
                        source={require('@/assets/images/liga_mx_logo.jpeg')}
                        resizeMode='contain'
                    />
                    <Text style={styles.text}>AwayTeam</Text>
                </View>
            </View>

            <View style={styles.gameStatView}>
                <Text style={[styles.text, styles.goalsViewItem]}> Raul Jimenez </Text>
                <Image 
                    style={[styles.goalsViewItem, styles.soccerBallImage]} 
                    source={require('@/assets/images/soccerBall.png')}
                    resizeMode='contain'
                />
                <Text style={[styles.text, styles.goalsViewItem]}> Raul Jimenez </Text>
            </View>

            <View style={styles.gameStatView} >
                <Text style={[styles.text, styles.equalWidth]}> 1 </Text>
                <Text style={[styles.text, styles.equalWidth]}> Yellow Cards </Text>
                <Text style={[styles.text, styles.equalWidth]}> 2 </Text>
            </View>

            <View style={styles.gameStatView}> 
                <Text style={[styles.text, styles.equalWidth]}> 0 </Text>
                <Text style={[styles.text, styles.equalWidth]}> Red Cards </Text>
                <Text style={[styles.text, styles.equalWidth]}> 0 </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    soccerBallImage: {
        width: screenHeight * 0.04,
        height: screenHeight * 0.04,
    }, 
    teamLogoImage: { 
        width: screenHeight * 0.1,
        height: screenHeight * 0.1
    }, 
    text: { 
        fontSize: 16,
        textAlign: 'center'
    }, 
    date: { 
        fontSize: 18,
        textAlign: 'center',
        padding: 10
    }, 
    score: { 
        textAlign: 'center',
        fontSize: 48,
    }, 
    gameStatView: { 
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    goalsViewItem: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1
    },
    teamLogo: { 
        flex: 1,
        alignItems: 'center',  
    },
    equalWidth: { 
        flex: 1
    }
})