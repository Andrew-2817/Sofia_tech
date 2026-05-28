  // store/slices/productsSlice.js
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import { api } from '../../services/api';

  export const fetchAllProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const { homeier, brandt, liebherr, nivona, diet, kupper, schult, graude, bonk, teka, falmec } = await api.getAllProducts();
        
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
height: product.height ? product.height * 100 : null, // перевод из метров в сантиметры
  width: product.width ? product.width * 100 : null,    // тоже переводим ширину
  depth: product.depth ? product.depth * 100 : null,
          volume: product.volume ? product.volume * 1000 : null,
          net_weight: product.net_weight,
          series: product.series, // Добавить series
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width*100) : null,
          gross_weight: product.gross_weight,
          // Флаг бренда
          brand: 'homeier',
          factory: null, // Тип установки
          warranty: null // У Homeier нет гарантии в данных
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
          brand: 'brandt',
          factory: null, // Нет данных
          warranty: null, // Нет данных
            series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
          
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
            series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
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
          brand: 'nivona',
            series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
                  factory: null, // Нет данных
        warranty: null // Нет данных
        }));
        
        allProducts.push(...normalizedNivona);


        // Нормализуем товары Diet (бренд Diet) - brand_id = 5 (пример)
const normalizedDiet = diet.map(product => ({
  id: product.id,
  sku: product.model || `DT-${product.id}`,
  name: product.name,
  price: product.price_public || 0,
  main_image: product.main_image || null,
  comment: product.comment || null,
  description: product.specifications || `Модель: ${product.model || '—'}\nЛинейка: ${product.line || '—'}\nЦвет: ${product.color || '—'}`,
  brandId: product.brand_id,
  brandName: 'De Dietrich',
  categoryId: product.category_id,
  // Характеристики Diet
  model: product.model,
  line: product.line,
  specifications: product.specifications,
  color: product.color,
  price_public: product.price_public,
  // Флаг бренда
  brand: 'de dietrich',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
          factory: null, // Нет данных
        warranty: null // Нет данных
}));

allProducts.push(...normalizedDiet);

// Нормализуем товары Kupper (бренд Kuppersbusch) - brand_id = 6 (пример)
const normalizedKupper = kupper.map(product => ({
  id: product.id,
  sku: product.sku || `KP-${product.id}`,
  name: product.name,
  price: product.price || 0,
  main_image: product.main_image || null,
  comment: product.comment || null,
  description: product.description || `Серия: ${product.series || '—'}\nСтатус: ${product.status || '—'}\nЦвет: ${product.color || '—'}`,
  brandId: product.brand_id,
  brandName: 'Kuppersbusch',
  categoryId: product.category_id,
  // Характеристики Kupper
  sku_kupper: product.sku,
  status: product.status,
  color: product.color,
  series: product.series,
height: product.height ? product.height * 100 : null, // перевод из метров в сантиметры
  width: product.width ? product.width * 100 : null,    // тоже переводим ширину
  depth: product.depth ? product.depth * 100 : null,  
  volume: product.volume ? product.volume * 1000 : null,
  net_weight: product.net_weight,
  // Флаг бренда
  brand: 'kuppersbusch',
    series: product.series, // Добавить series
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width*100) : null,
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedKupper);

// Нормализуем товары Schult (бренд Schulthess) - brand_id = 7 (пример)
const normalizedSchult = schult.map(product => ({
  id: product.id,
  sku: product.model || `SC-${product.id}`,
  name: product.name,
  price: product.price || 0,
  main_image: product.main_image || null,
  comment: product.comment || null,
  description: product.description || `Модель: ${product.model || '—'}\nГруппа: ${product.product_group || '—'}\nПрограммы: ${product.programs || '—'}\nЦвет: ${product.color || '—'}`,
  brandId: product.brand_id,
  brandName: 'Schulthess',
  categoryId: product.category_id,
  // Характеристики Schult
  model: product.model,
  door_hinge: product.door_hinge,
  product_group: product.product_group,
  color: product.color,
  programs: product.programs,
  height: product.height ? product.height * 100 : null, // перевод из метров в сантиметры
  width: product.width ? product.width * 100 : null,    // тоже переводим ширину
  depth: product.depth ? product.depth * 100 : null,
  volume: product.volume ? product.volume * 1000 : null,
  gross_weight: product.gross_weight,
  // Флаг бренда
  brand: 'schulthess',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width*100) : null,
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedSchult);

// Нормализуем товары Graude (бренд Graude) - brand_id = 8 (пример)
const normalizedGraude = graude.map(product => ({
  id: product.id,
  sku: product.sku || `GR-${product.id}`,
  name: product.name,
  price: product.price_public || 0,
  main_image: product.main_image || null,
  comment: null,
  description: product.description || '—',
  brandId: product.brand_id,
  brandName: 'Graude',
  categoryId: product.category_id,
  // Характеристики Graude
  sku_graude: product.sku,
  price_public: product.price_public,
  // Флаг бренда
  brand: 'graude',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedGraude);

// Нормализуем товары Bonk (бренд Bonkrasher) - brand_id = 9 (пример)
const normalizedBonk = bonk.map(product => ({
  id: product.id,
  sku: product.sku || `BN-${product.id}`,
  name: product.name,
  price: product.price || 0,
  main_image: product.main_image || null,
  comment: null,
  description: product.functionality || '—',
  brandId: product.brand_id,
  brandName: 'Bonkrasher',
  categoryId: product.category_id,
  // Характеристики Bonk
  sku_bonk: product.sku,
  functionality: product.functionality,
  // Флаг бренда
  brand: 'bonkrasher',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedBonk);

// Нормализуем товары Teka (бренд Teka) - brand_id = 10 (пример)
const normalizedTeka = teka.map(product => ({
  id: product.id,
  sku: `TE-${product.id}`,
  name: product.name,
  price: product.price || 0,
  main_image: null,
  comment: `DMD: ${product.dmd_quantity || '—'}, DMD_PERUP: ${product.dmd_perup_quantity || '—'}`,
  description: `DMD количество: ${product.dmd_quantity || '—'}\nDMD_PERUP количество: ${product.dmd_perup_quantity || '—'}`,
  brandId: product.brand_id,
  brandName: 'Teka',
  categoryId: product.category_id,
  // Характеристики Teka
  dmd_quantity: product.dmd_quantity,
  dmd_perup_quantity: product.dmd_perup_quantity,
  // Флаг бренда
  brand: 'teka',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
  width_cm: product.width_cm || product.width ? parseFloat(product.width_cm || product.width) : null,
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedTeka);

// Нормализуем товары Falmec (бренд Falmec) - brand_id = 11 (пример)
const normalizedFalmec = falmec.map(product => ({
  id: product.id,
  sku: product.model || product.manufacturer_code || `FM-${product.id}`,
  name: `Falmec ${product.model || product.manufacturer_code || product.id}`,
  price: product.price_retail || 0,
  main_image: product.main_image || null,
  comment: `Монтаж: ${product.mounting_type || '—'}, Управление: ${product.control_type || '—'}`,
  description: `Модель: ${product.model || '—'}\nКод производителя: ${product.manufacturer_code || '—'}\nТип монтажа: ${product.mounting_type || '—'}\nЦвет: ${product.color || '—'}\nШирина: ${product.width_cm || '—'} см\nПроизводительность: ${product.performance_m3h || '—'} м³/ч\nМин. шум: ${product.min_noise_db || '—'} дБ\nПрограмма поставки: ${product.supply_program || '—'}\nТип управления: ${product.control_type || '—'}`,
  brandId: product.brand_id,
  brandName: 'Falmec',
  categoryId: product.category_id,
  // Характеристики Falmec
  model: product.model,
  manufacturer_code: product.manufacturer_code,
  mounting_type: product.mounting_type,
  color: product.color,
  width_cm: product.width_cm,
  performance_m3h: product.performance_m3h,
  min_noise_db: product.min_noise_db,
  supply_program: product.supply_program,
  control_type: product.control_type,
  price_retail: product.price_retail,
  // Флаг бренда
  brand: 'falmec',
    series: product.series, // Добавить series
  net_weight: product.net_weight ? parseFloat(product.net_weight) : null, // Привести к числу
            factory: null, // Нет данных
          warranty: null // Нет данных
}));

allProducts.push(...normalizedFalmec);
        
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

  // Селекторы для получения доступных опций фильтров
export const selectFactoryOptions = (state) => {
  const factories = new Set();
  state.products.items.forEach(product => {
    if (product.factory && product.factory !== 'null' && product.factory !== 'undefined') {
      factories.add(product.factory);
    }
  });
  return Array.from(factories).sort();
};

export const selectWarrantyOptions = (state) => {
  const warranties = new Set();
  state.products.items.forEach(product => {
    if (product.warranty && product.warranty !== null && product.warranty !== undefined) {
      warranties.add(product.warranty);
    }
  });
  return Array.from(warranties).sort((a, b) => a - b);
};

  export default productsSlice.reducer;