// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';


// Состояние для брендов
export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const brands = await api.getBrands();
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Сначала получаем бренды
      const brandsResponse = await api.getBrands();
      const brands = Array.isArray(brandsResponse) ? brandsResponse : [];
      
      // Формируем словари для быстрого доступа
      const brandNames = {};
      const brandSlugs = {};
      
      brands.forEach(brand => {
        brandNames[brand.id] = brand.name;
        brandSlugs[brand.id] = brand.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') // заменяем все не буквенно-цифровые символы на -
          .replace(/^-+|-+$/g, ''); // убираем тире в начале и конце
      });
      
      // Сохраняем словари в Redux или в переменную
      // Можно сохранить в отдельный slice или в localStorage
      
      // Получаем товары
      const response = await api.getAllProducts();
      // console.log(response);
      
      const productsArray = Array.isArray(response) ? response : (response.products || []);
      
      // Нормализация товаров с использованием динамических брендов
      const normalizedProducts = productsArray.map(product => ({
        // Базовые поля
        id: product.id,
        sku: product.sku || `SKU-${product.id}`,
        name: product.name,
        price: product.price || 0,
        main_image: product.main_image,
        brandId: product.brand_id,
        categoryId: product.category_id,
        
        // Поля из таблицы products
        description: product.description || null,
        color: product.color || null,
        width: product.width || null,
        height: product.height || null,
        depth: product.depth || null,
        weight: product.weight || null,
        
        // Вспомогательные поля (вычисляемые из динамических брендов)
        brand: brandSlugs[product.brand_id] || 'unknown',
        brandName: brandNames[product.brand_id] || 'Unknown',
      }));
      
      return {
        products: normalizedProducts,
        brands: brands,
        brandNames: brandNames,
        brandSlugs: brandSlugs
      };
      
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Функция для получения брендов (если нужно отдельно)
export const getBrandsFromStore = (state) => state.products.brands || [];

// Функция для получения имени бренда по ID
export const getBrandNameById = (state, brandId) => {
  return state.products.brandNames?.[brandId] || 'Unknown';
};

// Функция для получения слага бренда по ID
export const getBrandSlugById = (state, brandId) => {
  return state.products.brandSlugs?.[brandId] || 'unknown';
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    brands: [],           // Список всех брендов
    brandNames: {},       // Словарь { id: name }
    brandSlugs: {},       // Словарь { id: slug }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Загрузка товаров
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
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Загрузка брендов отдельно
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        // Обновляем словари
        const brandNames = {};
        const brandSlugs = {};
        action.payload.forEach(brand => {
          brandNames[brand.id] = brand.name;
          brandSlugs[brand.id] = brand.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        });
        state.brandNames = brandNames;
        state.brandSlugs = brandSlugs;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;