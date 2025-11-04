import { configureStore } from "@reduxjs/toolkit";
import leaguesSlice from "@/store/leagues/leaguesSlice";
import gamesSlice from "@/store/games/gamesSlice";
import gameStatsSlice from "@/store/gamestats/gameStatsSlice";
import teamsSlice from "@/store/teams/teamsSlice";
import teamInvitesSlice from "@/store/team-invites/teamInvitesSlice";
import playersSlice from "@/store/players/playersSlice";

const store = configureStore({
  reducer: {
    leagues: leaguesSlice,
    teams: teamsSlice,
    teamInvites: teamInvitesSlice,
    players: playersSlice,
    games: gamesSlice,
    gameStats: gameStatsSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
