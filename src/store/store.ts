import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice'
import themeReducer from './slices/ThemeSlice'
import ItemsReducer from './slices/ItemsSlice'


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    items: ItemsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch