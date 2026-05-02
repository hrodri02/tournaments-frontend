import React, { useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/hooks/useStore';
import { selectLeagueById } from '@/store/leagues/leaguesSlice';
import { makeSelectTeamsByIds } from '@/store/teams/teamsSlice';
import { TeamExcerpt } from '@/components/TeamExcerpt';
import { LeagueDetail, LeagueDetailExcerpt } from '@/components/LeagueDetailExcerpt';
import { useTranslation } from 'react-i18next';
import { parseISO, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale'

export default function UpcomingLeaguePage() {
    const router = useRouter();
    const navigation = useNavigation();
    const { t, i18n } = useTranslation(['home', 'common']);
    const currentLanguage = i18n.language;
    const locale = currentLanguage === 'en-US'? enUS : es;
    const { user, isLoading } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const selectTeamsByIds = useMemo(
        () => makeSelectTeamsByIds(league.teamIds),
        [league]
    );
    const teams = useAppSelector(selectTeamsByIds);
    const startDate = parseISO(league.startDate)
    const formattedStartDate = formatDate(startDate);
    const leagueDetails: LeagueDetail[] = [
        {
            id: 1, 
            iconName: "calendar-outline", 
            description: t('upcoming_league.start_date_label'), 
            text: formattedStartDate
        },
        {
            id: 2, 
            iconName: "time-outline", 
            description: t('upcoming_league.duration_label'), 
            text: `${league.durationInWeeks} ${t('upcoming_league.weeks_label')}`
        },
    ];

    function formatDate(startDate: Date): string {
        const dateString = format(startDate, 'MMMM d y', {locale: locale});
        if (locale === enUS) {
            return dateString;
        }
        // capitalize the first letter
        return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    }
    
    useLayoutEffect(() => {
        if (league) {
          navigation.setOptions({
            headerTitle: () => (
              <CustomHeader
                key={league.logoUrl}
                title={league.name} 
                imageUrl={league.logoUrl} 
              />
            )
          });
        }
    }, [league, navigation]);

    const handleMenuButtonPressed = () => {
        const options = [
            t('upcoming_league.applications_label'), 
            t('upcoming_league.upload_league_logo_option'),
            t('common:cancel_button'),
        ];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
        {
            options,
            cancelButtonIndex,
        },
        (buttonIndex) => {
            switch (buttonIndex) {
                case 0: 
                    router.push(`./applications`);
                    break;
                case 1:
                    router.push(`./upload-league-logo`);
                    break;
                case 2:
                    break;
                }
            }
        );
    };

    useLayoutEffect(() => {
        if (user && !isLoading) {
            if (user.appUserRole === 'ADMIN') {
                navigation.setOptions({
                headerRight: () => (
                    <Pressable
                        style={styles.topRightNavButton}
                        onPress={handleMenuButtonPressed}
                    >
                        <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
                    </Pressable>
                )
                });
            }
            else {
                navigation.setOptions({
                    headerRight: undefined
                });
            }
        }
    }, [navigation, user, isLoading, handleMenuButtonPressed]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.topFlatList}
                ListHeaderComponent={<View><Text style={styles.sectionHeader}>{t('upcoming_league.section_one_title')}</Text></View>}
                data={leagueDetails}
                renderItem={({item}) => 
                    <LeagueDetailExcerpt detail={item} style={styles.item}/>
                }
                keyExtractor={item => String(item.id)}
            />
            <FlatList
                style={styles.bottomFlatList}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                ListHeaderComponent={<View><Text style={styles.sectionHeader}>{t('upcoming_league.section_two_title')}</Text></View>}
                data={teams}
                renderItem={({item}) => <TeamExcerpt style={styles.item} team={item}/>}
                keyExtractor={item => String(item.id)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topRightNavButton: {
        marginHorizontal: 20,
    },
    container: {
        flex: 1
    },
    topFlatList: {
        flexGrow: 0,
    },
    bottomFlatList: {
        flex: 1,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
    },
    itemSeparator: {
        borderWidth: 0.1,
    },
});