import React from 'react'; 
import { 
    View, 
    ViewStyle, 
    Text, 
    StyleSheet, 
    Pressable, 
    Dimensions 
} from 'react-native';
import { ImageFetcher } from '@/components/ImageFetcher';
import { Link } from 'expo-router';
import { GameResponse } from '@/entities/index';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DEFAULT_IMAGES } from '@/constants/Assets';

const screenHeight = Dimensions.get('window').height;

type GameExcerptProps = {
    game: GameResponse;
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
        borderRadius: 20,
        width: screenHeight * 0.1,
        height: screenHeight * 0.1,
    },
    teamViews: {
        flex: 3,
    },
    teamView: { 
        columnGap: 5,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'   
    },
    date: { 
        fontSize: 14,
        fontWeight: 'bold',
    },
    dateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        paddingHorizontal: 10
    }
})

export function GameExcerpt({ game, style }: GameExcerptProps) {
    const { t, i18n } = useTranslation('league');
    const locale = (['en-US', 'en'].includes(i18n.language))? enUS : es;
    const date = Date.parse(game.gameDateTime);
    const formattedDate = formatDate(date);
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);

    function formatDate(date: number): string {
        const dateString = format(date, 'eee, MMM d pp', {locale: locale});
        if (locale === enUS) {
            return dateString;
        }
        // capitalize the first letter of the day and month
        return dateString.charAt(0).toUpperCase() + 
               dateString.slice(1,5) + 
               dateString.charAt(5).toUpperCase() + 
               dateString.slice(6);
    }

    return (
        <Link href={{
            pathname: '/(app)/home/leagues/[id]/games/[gameId]',
            params: {id: leagueId, gameId: game.id}
        }} asChild>
            <Pressable>
            <View style={style}>
                <View style={styles.teamViews}>
                <View style={styles.teamView}>
                    <ImageFetcher
                        imageStyle={styles.image} 
                        key={game.homeTeam.logoUrl}
                        imageUrl={game.homeTeam.logoUrl}
                        defaultImageSource={DEFAULT_IMAGES.TEAM_LOGO}
                    />
                    <Text style={styles.text}>{game.homeTeam.name}</Text>
                </View>

                <View style={styles.teamView}>
                    <ImageFetcher 
                        imageStyle={styles.image}
                        key={game.awayTeam.logoUrl}
                        imageUrl={game.awayTeam.logoUrl}
                        defaultImageSource={DEFAULT_IMAGES.TEAM_LOGO}
                    />
                    <Text style={styles.text}>{game.awayTeam.name}</Text>
                    </View>
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
            </Pressable>
        </Link>
    )
}   
