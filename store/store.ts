import {configureStore} from '@reduxjs/toolkit'
import authSlice from "@/store/auth.slice";
import leaguesSlice from "@/store/leagues/leaguesSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        leagues: leaguesSlice
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
