import React, { useEffect, useMemo } from 'react';
import { 
  SectionList, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator,
  SectionListRenderItemInfo,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { 
  fetchLeagues, 
  selectLeaguesError, 
  selectLeaguesStatus, 
  makeSelectLeaguesByStatus 
} from '@/store/leagues/leaguesSlice'
import { LeagueExcerpt } from '@/store/leagues/LeagueExcerpt'
import { LeagueStatus, League } from '@/entities';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface LeagueSection {
    title: string | null;
    sectionIndex: number | null;
    data: League[];
}

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const leaguesStatus = useAppSelector(selectLeaguesStatus);
  const leaguesError = useAppSelector(selectLeaguesError);
  const { t } = useTranslation(['home', 'errors']);

  useEffect(() => {
    if (leaguesStatus === 'idle') {
      dispatch(fetchLeagues());
    }
  }, [leaguesStatus, dispatch]);

  const selectUpcomingLeagues = useMemo(
    () => makeSelectLeaguesByStatus(LeagueStatus.notStarted),
    []
  );
  const selectCurrentLeagues = useMemo(
    () => makeSelectLeaguesByStatus(LeagueStatus.inProgress),
    []
  );
  const selectPreviousLeagues = useMemo(
    () => makeSelectLeaguesByStatus(LeagueStatus.ended),
    []
  );

  const upcomingLeagues = useAppSelector(selectUpcomingLeagues);
  const currentLeagues = useAppSelector(selectCurrentLeagues);
  const previousLeagues = useAppSelector(selectPreviousLeagues);
  const sectionsWithIndex: LeagueSection[] = [
    { title: t('section_one_title'), data: upcomingLeagues },
    { title: t('section_two_title'), data: currentLeagues },
    { title: t('section_three_title'), data: previousLeagues },
  ].map((section, index) => ({
    ...section,
    sectionIndex: index,
  }));

  const renderItem = ({ item, section }: SectionListRenderItemInfo<League, LeagueSection>) => {
    const sectionIndex = section.sectionIndex;
    let pathname: string = "";
    if (sectionIndex === 0) {
      pathname = `/(app)/home/leagues/${item.id}/upcoming-league`;
    }
    else {
      pathname = `/(app)/home/leagues/${item.id}`;
    }
    return (
      <LeagueExcerpt 
        style={styles.item} 
        pathname={pathname} 
        league={item} clickable={true}
      />
    );
  }

  const getFetchLeaguesErrorMessage = (): string => {
    const error = leaguesError!
    const message = t(`errors:${error.errorKey}`);
    return message
  }

  let view: React.JSX.Element = <></>
  if (leaguesStatus === "idle" || leaguesStatus === "succeeded") {
    view = <SectionList
            style={styles.sectionList}
            sections={sectionsWithIndex}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => 
              <Text style={styles.sectionHeader}>{section.title}</Text>
            }
          />
  }
  else if (leaguesStatus === "loading") {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  else if (leaguesStatus === "failed") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorView}>{getFetchLeaguesErrorMessage()}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {view}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  sectionList: {
    flex: 1,
    paddingTop: 22,
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
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5em',
    padding: 10,
    marginVertical: 5,
  },
  errorView: {
    textAlign: 'center'
  }
});