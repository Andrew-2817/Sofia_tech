import { createSlice } from '@reduxjs/toolkit';
import { products } from '../../data/mockData';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: products,
  },
  reducers: {},
});

export default productsSlice.reducer;