import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchQuery: '',
    category: 'all',
    manufacturer: [],
    priceRange: [0, 500000],
    color: '',
    loadCapacity: '',
    energyClass: '',
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
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setLoadCapacity: (state, action) => {
      state.loadCapacity = action.payload;
    },
    setEnergyClass: (state, action) => {
      state.energyClass = action.payload;
    },
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.category = 'all';
      state.manufacturer = [];
      state.priceRange = [0, 500000];
      state.color = '';
      state.loadCapacity = '';
      state.energyClass = '';
    },
  },
});

export const { 
  setSearchQuery, 
  setCategory, 
  toggleManufacturer, 
  setPriceRange, 
  setColor, 
  setLoadCapacity,
  setEnergyClass,
  setFilters,
  resetFilters 
} = filtersSlice.actions;

export default filtersSlice.reducer;