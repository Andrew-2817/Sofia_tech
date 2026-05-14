// store/slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Загрузка избранного из localStorage
const loadFavoritesFromStorage = () => {
  try {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
  } catch (error) {
    console.error('Ошибка загрузки избранного из localStorage:', error);
  }
  return [];
};

// Сохранение избранного в localStorage
const saveFavoritesToStorage = (items) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(items));
  } catch (error) {
    console.error('Ошибка сохранения избранного в localStorage:', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavoritesFromStorage(), // Загружаем из localStorage
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const { id, brandId } = action.payload;
      const index = state.items.findIndex(
        item => item.id === id && item.brandId === brandId
      );
      
      if (index === -1) {
        state.items.push({ id, brandId });
      } else {
        state.items.splice(index, 1);
      }
      
      // Сохраняем в localStorage
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToStorage(state.items);
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;