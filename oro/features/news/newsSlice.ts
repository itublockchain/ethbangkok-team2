import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// Define a type for the slice state
export type NewsItem = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Define the initial state using that type
interface NewsState {
  value: NewsItem | null;
}

const initialState: NewsState = {
  value: null, // Başlangıçta bir haber seçilmediği için `null` olabilir
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<NewsItem>) => {
      state.value = action.payload;
    },
    clearNews: (state) => {
      state.value = null;
    },
  },
});

export const { setNews, clearNews } = newsSlice.actions;

// Selector
export const selectNews = (state: RootState) => state.news.value;

export default newsSlice.reducer;