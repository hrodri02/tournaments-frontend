import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/entities/auth";
import { createAppAsyncThunk } from '@/hooks/useStore';
import { login } from '@/services/auth.service';
import { RootState } from '@/store/store'

interface AuthState {
    jws: string | null;
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null; 
}

const initialState: AuthState = {
    jws: null,
    user: null,
    status: 'idle',
    error: null
}

export const loginRequest = createAppAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const {token, user} = await login(email, password)
    return user
  },
  {
    condition(arg, thunkApi) {
      const authStatus = selectAuthStatus(thunkApi.getState())
      if (authStatus !== 'idle') {
        return false
      }
    }
  }
)

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      resetAuthState: (state) => {
        state.status = 'idle';
        state.error = null;
      }
    },
    extraReducers: builder => {
        builder
        .addCase(loginRequest.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(loginRequest.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload
        })
        .addCase(loginRequest.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message ?? 'Unknown Error'
        })
    }
})

export const { resetAuthState } = slice.actions

export default slice.reducer

export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
