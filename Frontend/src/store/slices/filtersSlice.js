import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchQuery: '',
    category: 'all',
    manufacturer: [],
    priceRange: [0, 150000],
    weight: '',
    color: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    toggleManufacturer: (state, action) => {
      const manufacturer = action.payload;
      if (state.manufacturer.includes(manufacturer)) {
        state.manufacturer = state.manufacturer.filter(m => m !== manufacturer);
      } else {
        state.manufacturer.push(manufacturer);
      }
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setWeight: (state, action) => {
      state.weight = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.category = 'all';
      state.manufacturer = [];
      state.priceRange = [0, 150000];
      state.weight = '';
      state.color = '';
    },
  },
});

export const { setSearchQuery, setCategory, toggleManufacturer, setPriceRange, setWeight, setColor, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;