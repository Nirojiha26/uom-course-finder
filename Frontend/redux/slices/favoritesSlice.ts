import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface FavoritesState {
  items: Course[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Course>) => {
      const exists = state.items.find((c) => c.id === action.payload.id);

      if (exists) {
        state.items = state.items.filter((c) => c.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },

    loadFavorites: (state, action: PayloadAction<Course[]>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
