import { useDispatch, useSelector } from 'react-redux'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from "@/store/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: AppDispatch
}>()
