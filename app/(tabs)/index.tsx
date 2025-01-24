import React, { useEffect } from 'react';
import { SectionList, StyleSheet, Text } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { fetchLeagues, selectLeaguesByStatus, selectLeaguesStatus } from '@/store/leagues/leaguesSlice'
import { LeagueExcerpt } from '@/store/leagues/LeagueExcerpt'
import { LeagueStatus } from '@/entities';

const styles = StyleSheet.create({
  container: {
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
  }
});

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  const upcomingLeagues = useAppSelector(state => selectLeaguesByStatus(state, LeagueStatus.notStarted))
  const currentLeagues = useAppSelector(state => selectLeaguesByStatus(state, LeagueStatus.inProgress))
  const previousLeagues = useAppSelector(state => selectLeaguesByStatus(state, LeagueStatus.ended))
  const leaguesStatus = useAppSelector(selectLeaguesStatus)

  useEffect(() => {
    if (leaguesStatus === 'idle') {
      dispatch(fetchLeagues())
    }
  }, [leaguesStatus, dispatch])

  return (
    <SectionList
      style={styles.container}
      sections={[
        {title: 'Upcomming Leagues', data: upcomingLeagues},
        {title: 'Current Leagues', data: currentLeagues},
        {title: 'Previous Leagues', data: previousLeagues},
      ]}
      renderItem={({item}) => 
        <LeagueExcerpt style={styles.item} league={item}/>
      }
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}
