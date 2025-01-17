import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/entities/auth";

interface State {
    user: User | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: State = {
    user: null,
    status: 'idle',
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

export const {} = slice.actions

export default slice.reducer
