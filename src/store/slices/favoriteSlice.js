import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    name: "nishant",
  },
  reducers: {
    toggleFavorites(state, action) {
        state.name = action.payload
      
    },
    removeFavorites(state) {},
    clearFavorties(state) {},
  },
});

export const { toggleFavorites, removeFavorites, clearFavorties } =
  favoriteSlice.actions;

export default favoriteSlice.reducer; // connect with store