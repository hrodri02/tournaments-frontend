import { configureStore } from "@reduxjs/toolkit";
import leaguesSlice from "@/store/leagues/leaguesSlice";
import gamesSlice from "@/store/games/gamesSlice";
import gameStatsSlice from "@/store/gamestats/gameStatsSlice";
import teamsSlice from "@/store/teams/teamsSlice";

const store = configureStore({
  reducer: {
    leagues: leaguesSlice,
    teams: teamsSlice,
    games: gamesSlice,
    gameStats: gameStatsSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
