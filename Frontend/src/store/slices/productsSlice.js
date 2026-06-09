// store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const products = await api.getAllProducts();
      
      
      // Общая нормализация для всех товаров (только из имеющихся полей)
      const normalizedProducts = products.products.map(product => ({
        // Базовые поля (есть в таблице)
        id: product.id,
        sku: product.sku || `SKU-${product.id}`,
        name: product.name,
        price: product.price || 0,
        main_image: product.main_image,
        brandId: product.brand_id,
        categoryId: product.category_id,
        
        // ВСЕ данные из attributes (JSON поле)
        ...product.attributes,
        
        // Вспомогательные поля (вычисляемые)
        brand: getBrandSlug(product.brand_id),
        brandName: getBrandName(product.brand_id),
      }));
      
      return normalizedProducts;
      
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Вспомогательные функции
function getBrandName(brandId) {
  const brands = {
    1: 'Kuppersbusch',
    2: 'Schulthess',
    3: 'Ilve',
    4: 'Signature Kitchen Suite',
    5: 'De Dietrich',
    6: 'Graude',
    7: 'Brandt',
    8: 'Liebherr',
    9: 'Teka',
    10: 'Falmec',
    11: 'Bone Crusher',
    12: 'Nivona',
    13: 'Fulgor Milano',
    14: 'Elica'
  };
  return brands[brandId] || 'Unknown';
}

function getBrandSlug(brandId) {
  const brands = {
    1: 'kuppersbusch',
    2: 'schulthess',
    3: 'ilve',
    4: 'signature-kitchen-suite',
    5: 'dedietrich',
    6: 'graude',
    7: 'brandt',
    8: 'liebherr',
    9: 'teka',
    10: 'falmec',
    11: 'bone-crusher',
    12: 'nivona',
    13: 'fulgor-milano',
    14: 'elica'
  };
  return brands[brandId] || 'unknown';
}

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