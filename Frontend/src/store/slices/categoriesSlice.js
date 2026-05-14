import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Асинхронный thunk для загрузки категорий
export const fetchCategoriesTree = createAsyncThunk(
  'categories/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCategoriesTree();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    tree: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.tree = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка дерева категорий
      .addCase(fetchCategoriesTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesTree.fulfilled, (state, action) => {
        state.loading = false;
        state.tree = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCategoriesTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;