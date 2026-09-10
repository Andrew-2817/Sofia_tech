// store/slices/filtersSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

// ========== КОНСТАНТЫ (вынесены для переиспользования) ==========
const DEFAULT_FILTERS = {
  searchQuery: '',
  category: 'all',
  manufacturer: [],
  priceRange: [0, 5000000],
  color: '',
  loadCapacity: '',
  energyClass: '',
  brand: null,
  inStock: null,
  widthRange: [0, 200],
  heightRange: [0, 1000],
  depthRange: [0, 100],
  volumeRange: [0, 1000],
  performanceRange: [0, 1500],
  noiseLevelRange: [0, 70],
  mountingType: '',
  controlType: '',
  material: '',
  compatibility: [],
  powerRange: [0, 5000],
  factory: [],
  warranty: [],
  series: [],
  netWeightRange: [0, 100],
  widthCmRange: [0, 200],
  status: [],
};

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
const toggleArrayItem = (arr, item) => {
  return arr.includes(item) 
    ? arr.filter(v => v !== item)
    : [...arr, item];
};

const isFilterActive = (filter) => {
  if (Array.isArray(filter)) {
    return filter.length > 0;
  }
  if (typeof filter === 'string') {
    return filter !== '' && filter !== 'all';
  }
  if (typeof filter === 'boolean' || filter === null) {
    return filter !== null;
  }
  if (typeof filter === 'object' && filter !== null) {
    // Для диапазонов [min, max]
    if (Array.isArray(filter) && filter.length === 2) {
      return filter[0] > 0 || filter[1] > 0;
    }
    return Object.values(filter).some(v => v !== null && v !== undefined && v !== '');
  }
  return !!filter;
};

// ========== SLICE ==========
const filtersSlice = createSlice({
  name: 'filters',
  initialState: DEFAULT_FILTERS,
  reducers: {
    // Поиск
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    
    // Производители
    toggleManufacturer: (state, action) => {
      state.manufacturer = toggleArrayItem(state.manufacturer, action.payload);
    },
    
    // Цена
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    
    // Цвет
    setColor: (state, action) => {
      state.color = action.payload;
    },
    
    // Устаревшие (можно оставить для совместимости)
    setLoadCapacity: (state, action) => {
      state.loadCapacity = action.payload;
    },
    setEnergyClass: (state, action) => {
      state.energyClass = action.payload;
    },
    
    // Бренд и наличие
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    setInStock: (state, action) => {
      state.inStock = action.payload;
    },
    
    // ===== ДИНАМИЧЕСКИЕ ФИЛЬТРЫ =====
    setWidthRange: (state, action) => {
      state.widthRange = action.payload;
    },
    setHeightRange: (state, action) => {
      state.heightRange = action.payload;
    },
    setDepthRange: (state, action) => {
      state.depthRange = action.payload;
    },
    setVolumeRange: (state, action) => {
      state.volumeRange = action.payload;
    },
    setPerformanceRange: (state, action) => {
      state.performanceRange = action.payload;
    },
    setNoiseLevelRange: (state, action) => {
      state.noiseLevelRange = action.payload;
    },
    setMountingType: (state, action) => {
      state.mountingType = action.payload;
    },
    setControlType: (state, action) => {
      state.controlType = action.payload;
    },
    setMaterial: (state, action) => {
      state.material = action.payload;
    },
    toggleCompatibility: (state, action) => {
      state.compatibility = toggleArrayItem(state.compatibility, action.payload);
    },
    setPowerRange: (state, action) => {
      state.powerRange = action.payload;
    },
    
    // ===== СПЕЦИФИЧЕСКИЕ ФИЛЬТРЫ =====
    setFactory: (state, action) => {
      state.factory = toggleArrayItem(state.factory, action.payload);
    },
    setWarranty: (state, action) => {
      state.warranty = toggleArrayItem(state.warranty, action.payload);
    },
    setSeries: (state, action) => {
      state.series = toggleArrayItem(state.series, action.payload);
    },
    setNetWeightRange: (state, action) => {
      state.netWeightRange = action.payload;
    },
    setWidthCmRange: (state, action) => {
      state.widthCmRange = action.payload;
    },
    setStatus: (state, action) => {
      state.status = toggleArrayItem(state.status, action.payload);
    },
    
    // Массовое обновление
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    
    // Сброс всех фильтров
    resetFilters: (state) => {
      return { ...DEFAULT_FILTERS };
    },
  },
});

// ========== МЕМОИЗИРОВАННЫЕ СЕЛЕКТОРЫ ==========
const selectFiltersState = (state) => state.filters;

// Базовые селекторы
export const selectSearchQuery = (state) => state.filters.searchQuery;
export const selectCategory = (state) => state.filters.category;
export const selectManufacturer = (state) => state.filters.manufacturer;
export const selectPriceRange = (state) => state.filters.priceRange;
export const selectColor = (state) => state.filters.color;
export const selectBrand = (state) => state.filters.brand;
export const selectInStock = (state) => state.filters.inStock;

// Мемоизированный селектор — активные фильтры
export const selectActiveFilters = createSelector(
  [selectFiltersState],
  (filters) => {
    const active = [];
    
    if (filters.manufacturer.length > 0) {
      active.push({ type: 'manufacturer', values: filters.manufacturer });
    }
    if (filters.color) {
      active.push({ type: 'color', value: filters.color });
    }
    if (filters.brand) {
      active.push({ type: 'brand', value: filters.brand });
    }
    if (filters.inStock !== null) {
      active.push({ type: 'inStock', value: filters.inStock });
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) {
      active.push({ type: 'priceRange', values: filters.priceRange });
    }
    if (filters.widthCmRange[0] > 0 || filters.widthCmRange[1] < 200) {
      active.push({ type: 'widthCmRange', values: filters.widthCmRange });
    }
    if (filters.heightRange[0] > 0 || filters.heightRange[1] < 1000) {
      active.push({ type: 'heightRange', values: filters.heightRange });
    }
    if (filters.depthRange[0] > 0 || filters.depthRange[1] < 100) {
      active.push({ type: 'depthRange', values: filters.depthRange });
    }
    if (filters.volumeRange[0] > 0 || filters.volumeRange[1] < 1000) {
      active.push({ type: 'volumeRange', values: filters.volumeRange });
    }
    if (filters.controlType) {
      active.push({ type: 'controlType', value: filters.controlType });
    }
    if (filters.mountingType) {
      active.push({ type: 'mountingType', value: filters.mountingType });
    }
    if (filters.material) {
      active.push({ type: 'material', value: filters.material });
    }
    if (filters.compatibility.length > 0) {
      active.push({ type: 'compatibility', values: filters.compatibility });
    }
    if (filters.factory.length > 0) {
      active.push({ type: 'factory', values: filters.factory });
    }
    if (filters.warranty.length > 0) {
      active.push({ type: 'warranty', values: filters.warranty });
    }
    if (filters.series.length > 0) {
      active.push({ type: 'series', values: filters.series });
    }
    if (filters.status.length > 0) {
      active.push({ type: 'status', values: filters.status });
    }
    if (filters.netWeightRange[0] > 0 || filters.netWeightRange[1] < 100) {
      active.push({ type: 'netWeightRange', values: filters.netWeightRange });
    }
    
    return active;
  }
);

// Мемоизированный селектор — количество активных фильтров
export const selectActiveFiltersCount = createSelector(
  [selectActiveFilters],
  (activeFilters) => activeFilters.length
);

// Мемоизированный селектор — есть ли активные фильтры
export const selectHasActiveFilters = createSelector(
  [selectActiveFiltersCount],
  (count) => count > 0
);

// Мемоизированный селектор — все фильтры в виде объекта
export const selectAllFilters = createSelector(
  [selectFiltersState],
  (filters) => ({ ...filters })
);

// ========== ЭКСПОРТ ==========
export const {
  setSearchQuery,
  setCategory,
  toggleManufacturer,
  setPriceRange,
  setColor,
  setLoadCapacity,
  setEnergyClass,
  setBrand,
  setInStock,
  setWidthRange,
  setHeightRange,
  setDepthRange,
  setVolumeRange,
  setPerformanceRange,
  setNoiseLevelRange,
  setMountingType,
  setControlType,
  setMaterial,
  toggleCompatibility,
  setPowerRange,
  setFilters,
  resetFilters,
  setFactory,
  setWarranty,
  setSeries,
  setNetWeightRange,
  setWidthCmRange,
  setStatus,
} = filtersSlice.actions;

export default filtersSlice.reducer;