// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ========== УТИЛИТЫ (вынесены из компонента) ==========
const generateSlug = (name) => {
  if (!name) return 'unknown';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const buildBrandMaps = (brands) => {
  const brandNames = {};
  const brandSlugs = {};
  
  brands.forEach(brand => {
    brandNames[brand.id] = brand.name;
    brandSlugs[brand.id] = generateSlug(brand.name);
  });
  
  return { brandNames, brandSlugs };
};

const normalizeProduct = (product, brandNames, brandSlugs) => ({
  id: product.id,
  sku: product.sku || `SKU-${product.id}`,
  name: product.name,
  price: product.price || 0,
  main_image: product.main_image,
  brandId: product.brand_id ?? null,
  categoryId: product.category_id ?? null,
  description: product.description || null,
  color: product.color || null,
  width: product.width || null,
  height: product.height || null,  // ← исправлено (убрал *100)
  depth: product.depth || null,
  weight: product.weight || null,
  // ... остальные поля
  brand: brandSlugs[product.brand_id] || 'unknown',
  brandName: brandNames[product.brand_id] || 'Unknown',
});

// ========== THUNK ==========
export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const brands = await api.getBrands();
      return Array.isArray(brands) ? brands : [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Получаем бренды
      const brandsResponse = await api.getBrands();
      const brands = Array.isArray(brandsResponse) ? brandsResponse : [];
      
      // Строим словари
      const { brandNames, brandSlugs } = buildBrandMaps(brands);
      
      // Получаем товары
      const response = await api.getAllProducts();
      const productsArray = Array.isArray(response) ? response : (response.products || []);
      
      // Нормализуем товары
      const normalizedProducts = productsArray.map(product => 
        normalizeProduct(product, brandNames, brandSlugs)
      );
      
      return {
        products: normalizedProducts,
        brands: brands,
        brandNames: brandNames,
        brandSlugs: brandSlugs,
      };
      
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.message);
    }
  }
);

// ========== СЕЛЕКТОРЫ (с мемоизацией) ==========
import { createSelector } from '@reduxjs/toolkit';

// Базовые селекторы
const selectProductsState = (state) => state.products;

export const selectAllProducts = (state) => state.products.items || [];
export const selectBrands = (state) => state.products.brands || [];
export const selectBrandNames = (state) => state.products.brandNames || {};
export const selectBrandSlugs = (state) => state.products.brandSlugs || {};
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

// Мемоизированные селекторы
export const selectProductById = createSelector(
  [selectAllProducts, (_, id) => id],
  (products, id) => products.find(p => p.id === id)
);

export const selectProductsByBrand = createSelector(
  [selectAllProducts, (_, brandId) => brandId],
  (products, brandId) => products.filter(p => p.brandId === brandId)
);

export const selectProductsByCategory = createSelector(
  [selectAllProducts, (_, categoryId) => categoryId],
  (products, categoryId) => products.filter(p => p.categoryId === categoryId)
);

export const selectBrandNameById = createSelector(
  [selectBrandNames, (_, brandId) => brandId],
  (brandNames, brandId) => brandNames[brandId] || 'Unknown'
);

export const selectBrandSlugById = createSelector(
  [selectBrandSlugs, (_, brandId) => brandId],
  (brandSlugs, brandId) => brandSlugs[brandId] || 'unknown'
);

// Функции для использования в компонентах (без мемоизации, но с проверкой)
export const getBrandNameById = (state, brandId) => {
  return state.products.brandNames?.[brandId] || 'Unknown';
};

export const getBrandSlugById = (state, brandId) => {
  return state.products.brandSlugs?.[brandId] || 'unknown';
};

// ========== SLICE ==========
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    brands: [],
    brandNames: {},
    brandSlugs: {},
    loading: false,
    error: null,
  },
  reducers: {
    // Можно добавить редьюсер для очистки
    clearProducts: (state) => {
      state.items = [];
      state.brands = [];
      state.brandNames = {};
      state.brandSlugs = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.brands = action.payload.brands;
        state.brandNames = action.payload.brandNames;
        state.brandSlugs = action.payload.brandSlugs;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки товаров';
      })
      
      // fetchBrands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        // Обновляем словари
        const { brandNames, brandSlugs } = buildBrandMaps(action.payload);
        state.brandNames = brandNames;
        state.brandSlugs = brandSlugs;
        state.error = null;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки брендов';
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;