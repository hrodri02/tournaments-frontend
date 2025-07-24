import { configureStore } from "@reduxjs/toolkit";
import leaguesSlice from "@/store/leagues/leaguesSlice";
import gamesSlice from "@/store/games/gamesSlice";
import gameStatsSlice from "@/store/gamestats/gameStatsSlice";

const store = configureStore({
  reducer: {
    leagues: leaguesSlice,
    games: gamesSlice,
    gameStats: gameStatsSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
