import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/news/newsSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer, // `news` slice'ı store'a ekleniyor
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;