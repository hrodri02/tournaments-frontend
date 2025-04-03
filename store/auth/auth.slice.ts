import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/entities/auth";
import { createAppAsyncThunk } from '@/hooks/useStore';
import { login, signup } from '@/services/auth.service';
import { RootState } from '@/store/store';
import { getStoredAuth, setStorageItemAsync, TOKEN_KEY, USER_KEY } from './authStorage';

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

export const loadAuth = createAppAsyncThunk(
  'auth/load',
  async () => {
    const token = await getStoredAuth();
    return token
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

export const loginRequest = createAppAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await login(email, password)
    await setStorageItemAsync(TOKEN_KEY, res.token)
    await setStorageItemAsync(USER_KEY, JSON.stringify(res.user))
    return res
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

export const signupRequest = createAppAsyncThunk(
  'auth/signup',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await signup(email, password)
    await setStorageItemAsync(TOKEN_KEY, res.token)
    await setStorageItemAsync(USER_KEY, JSON.stringify(res.user))
    return res
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

export const logoutRequest = createAppAsyncThunk(
  'auth/logout',
  async () => {
    await setStorageItemAsync(TOKEN_KEY, null)
    await setStorageItemAsync(USER_KEY, null)
  },
  {
    condition(arg, thunkApi) {
      const status = selectAuthStatus(thunkApi.getState())
      if (status !== 'succeeded') {
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
        state.status = 'idle'
        state.error = null
      },
    },
    extraReducers: builder => {
        builder
        .addCase(loadAuth.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(loadAuth.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.jws = action.payload.jws
          state.user = JSON.parse(String(action.payload.user)) as User
        })
        .addCase(loadAuth.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message ?? 'Unknown Error'
        })
        .addCase(loginRequest.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(loginRequest.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.user = action.payload.user
          state.jws = action.payload.token
        })
        .addCase(loginRequest.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message ?? 'Unknown Error'
        })
        .addCase(signupRequest.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(signupRequest.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.user = action.payload.user
          state.jws = action.payload.token
        })
        .addCase(signupRequest.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message ?? 'Unknown Error'
        })
        .addCase(logoutRequest.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(logoutRequest.fulfilled, (state, action) => {
          state.status = 'idle'
          state.user = null
          state.jws = null
        })
        .addCase(logoutRequest.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message ?? 'Unknown Error'
        })
    }
})

export const { resetAuthState } = slice.actions

export default slice.reducer

export const selectAuthToken = (state: RootState) => state.auth.jws
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
