import React, { useLayoutEffect, useState } from 'react'; 
import { Flatlist, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'; 
import {GameExcerpt} from '@/store/leagues/GameExcerpt'; 
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; 
import { ScreenStackHeaderCenterView } from 'react-native-screens';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const navigation = useNavigation(); 
    useLayoutEffect(() => { 
        navigation.setOptions({
            title: 'HomeTeam vs AwayTeam',
            headerTitleAlign: 'center'
        }); 
    }, [navigation]);

    return (
        <View>
            <Text style={styles.date}>Monday, March 17 at Golden Gate Park</Text>
            
            <View style={styles.teamsScores}> 
                <View style={styles.homeTeamLogo}> 
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

                <View style={styles.awayTeamLogo}> 
                    <Image 
                        style={styles.teamLogoImage} 
                        source={require('@/assets/images/liga_mx_logo.jpeg')}
                        resizeMode='contain'
                    />
                    <Text style={styles.text}>AwayTeam</Text>
                </View>
            </View>

            <View style={styles.goalsView}>
                <Text style={[styles.text, styles.goalsViewItem]}> Raul Jimenez </Text>
                <Image 
                    style={[styles.goalsViewItem, styles.soccerBallImage]} 
                    source={require('@/assets/images/soccerBall.png')}
                    resizeMode='contain'
                />
                <Text style={[styles.text, styles.goalsViewItem]}> Raul Jimenez </Text>
            </View>

            <View> 
                <View style={styles.yelloCardsView} >
                    <Text style={[styles.text, styles.equalWidth]}> 1 </Text>
                    <Text style={[styles.text, styles.equalWidth]}> Yellow Cards </Text>
                    <Text style={[styles.text, styles.equalWidth]}> 2 </Text>
                </View>

                <View style={styles.redCardsView}> 
                    <Text style={[styles.text, styles.equalWidth]}> 0 </Text>
                    <Text style={[styles.text, styles.equalWidth]}> Red Cards </Text>
                    <Text style={[styles.text, styles.equalWidth]}> 0 </Text>
                </View>
            </View>
        </View>
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
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center'
    }, 
    date: { 
        fontSize: 18,
        textAlign: 'center',
        padding: 10
    }, 
    teamsScores: { 
        flexDirection: 'row', 
        alignItems: 'center',
    },
    score: { 
        textAlign: 'center',
        fontSize: 48,
    }, 
    goalsView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    yelloCardsView: { 
        flexDirection: 'row',
        alignItems: 'center'
    },
    redCardsView: { 
        alignItems: 'center', 
        flexDirection: 'row'
    },
    goalsViewItem: {
        flex: 1
    },
    homeTeamLogo: { 
        flex: 1,
        alignItems: 'center',  
    },
    awayTeamLogo: {
        flex: 1,
        alignItems: 'center',
    },
    equalWidth: { 
        flex: 1
    }
})