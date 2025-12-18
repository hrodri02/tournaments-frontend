import React from 'react';
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { League, LeagueStatus } from '@/entities/index';
import { parseISO, format, addWeeks } from 'date-fns';
import { es, enUS } from 'date-fns/locale'
import { type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ImageFetcher } from '@/components/ImageFetcher';

type LeagueExcerptProps = {
    league: League;
    pathname?: string;
    style?: ViewStyle;
    clickable?: boolean;
    imageSideLength?: number;
}

export function LeagueExcerpt({ league, pathname, style, clickable = false, imageSideLength = 36 }: LeagueExcerptProps) {
    const { t, i18n } = useTranslation('home');
    const currentLanguage = i18n.language;
    const locale = currentLanguage === 'en-US'? enUS : es;
    const linkHref: Href = { pathname: pathname } as Href;

    if (!league) {
        return null;
    }

    const startDate = parseISO(league.startDate)
    const endDate = addWeeks(startDate, league.durationInWeeks)
    const formattedStartDate = format(startDate, 'MMMM d y', {locale: locale});
    const formattedEndDate = format(endDate, 'MMMM d y', {locale: locale})

    const renderLeagueDateText = (league: League): React.JSX.Element | null => {
        switch (league.status) {
            case LeagueStatus.notStarted:
                return <Text style={styles.itemSubheader}>{t('starts_label')} {formattedStartDate}</Text>
            case LeagueStatus.inProgress:
                return <Text style={styles.itemSubheader}>{t('started_label')} {formattedStartDate}</Text>
            case LeagueStatus.ended:
                return <Text style={styles.itemSubheader}>{t('ended_label')} {formattedEndDate}</Text>
            default:
                return null;
        }
    }

    const content = (
        <View style={style}>
            {
                league.logoUrl ?
                <ImageFetcher key={league.logoUrl} imageUrl={league.logoUrl}/> : 
                <Image 
                    style={{width: imageSideLength, height: imageSideLength, borderRadius: imageSideLength / 2 }} 
                    source={require('@/assets/images/liga_mx_logo.jpeg')}
                />
            }
            
            <View style={styles.leagueDetails}>
                <Text style={styles.itemHeader}>{league.name}</Text>
                {renderLeagueDateText(league)}
            </View>
        </View>
    );
    
    if (clickable) {
        return (
            <Link href={linkHref} asChild>
                <Pressable>
                    {content}
                </Pressable>
            </Link>
        );
    }
    
    return content;
}

const styles = StyleSheet.create({
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