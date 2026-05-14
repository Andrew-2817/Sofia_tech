// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Асинхронный thunk для загрузки всех товаров
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { homeier, brandt } = await api.getAllProducts();
      
      // Нормализуем товары Homeier
      const normalizedHomeier = homeier.map(product => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        main_image: product.main_image,
        comment: product.comment,
        description: product.description,
        brandId: product.brand_id,
        brandName: 'Homeier',
        categoryId: product.category_id,
        groupLevel1: product.group_level_1, // название товара
        groupLevel2: product.group_level_2,
        // Характеристики Homeier
        color: product.color,
        width: product.width,
        height: product.height,
        depth: product.depth,
        volume: product.volume,
        net_weight: product.net_weight,
        gross_weight: product.gross_weight,
        // Флаг бренда
        brand: 'homeier'
      }));
      
      // Нормализуем товары Brandt
      const normalizedBrandt = brandt.map(product => ({
        id: product.id,
        sku: product.model || `BR-${product.id}`, // model используется как SKU
        name: product.name,
        price: product.price,
        main_image: product.main_image,
        comment: product.comment,
        description: product.specifications, // specifications используем как описание
        brandId: product.brand_id,
        brandName: 'Brandt',
        categoryId: product.category_id,
        model: product.model,
        specifications: product.specifications,
        design: product.design,
        // Флаг бренда
        brand: 'brandt'
      }));
      
      return [...normalizedHomeier, ...normalizedBrandt];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;