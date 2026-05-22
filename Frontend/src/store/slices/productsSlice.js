// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { homeier, brandt, liebherr, nivona } = await api.getAllProducts();
      
      let allProducts = [];
      
      // Нормализуем товары Homeier (brand_id = 1)
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
        groupLevel1: product.group_level_1,
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
      
      allProducts.push(...normalizedHomeier);
      
      // Нормализуем товары Brandt (brand_id = 2)
      const normalizedBrandt = brandt.map(product => ({
        id: product.id,
        sku: product.model || `BR-${product.id}`,
        name: product.name,
        price: product.price,
        main_image: product.main_image,
        comment: product.comment,
        description: product.specifications,
        brandId: product.brand_id,
        brandName: 'Brandt',
        categoryId: product.category_id,
        model: product.model,
        specifications: product.specifications,
        design: product.design,
        // Флаг бренда
        brand: 'brandt'
      }));
      
      allProducts.push(...normalizedBrandt);
      
      // Нормализуем товары Liebherr (brand_id = 3)
      const normalizedLiebherr = liebherr.map(product => ({
        id: product.id,
        sku: product.model || product.ean || `LB-${product.id}`,
        name: product.name,
        price: product.price_public || product.promo_price_public || 0,
        main_image: product.main_image || null,
        comment: product.status || null,
        description: `Модель: ${product.model || '—'}\nEAN: ${product.ean || '—'}\nСтатус: ${product.status || '—'}\nКатегория: ${product.category_name || '—'}\nПроизводство: ${product.production_start || '—'}\nФабрика: ${product.factory || '—'}\nГарантия: ${product.warranty || '—'} лет`,
        brandId: product.brand_id,
        brandName: 'Liebherr',
        categoryId: product.category_id,
        // Характеристики Liebherr
        model: product.model,
        ean: product.ean,
        status: product.status,
        category_name: product.category_name,
        production_start: product.production_start,
        factory: product.factory,
        warranty: product.warranty,
        price_public: product.price_public,
        price_wholesale: product.price_wholesale,
        promo_price_public: product.promo_price_public,
        promo_price_wholesale: product.promo_price_wholesale,
        // Флаг бренда
        brand: 'liebherr'
      }));
      
      allProducts.push(...normalizedLiebherr);
      
      // Нормализуем товары Nivona (brand_id = 4)
      const normalizedNivona = nivona.map(product => ({
        id: product.id,
        sku: product.sku || product.model || `NV-${product.id}`,
        name: product.name,
        price: product.price_public || 0,
        main_image: product.main_image || null,
        comment: product.comment || null,
        description: product.description || `Модель: ${product.model || '—'}\nАртикул: ${product.sku || '—'}`,
        brandId: product.brand_id,
        brandName: 'Nivona',
        categoryId: product.category_id,
        // Характеристики Nivona
        model: product.model,
        sku_nivona: product.sku,
        // Флаг бренда
        brand: 'nivona'
      }));
      
      allProducts.push(...normalizedNivona);
      
      return allProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
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