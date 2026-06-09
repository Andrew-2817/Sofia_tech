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
    brand: null,
    inStock: null,
    // Новые динамические фильтры
    widthRange: [0, 200],      // ширина в см
    heightRange: [0, 200],     // высота в см
    depthRange: [0, 100],      // глубина в см
    volumeRange: [0, 1000],    // объем в литрах
    performanceRange: [0, 1500], // производительность м³/ч
    noiseLevelRange: [0, 70],    // уровень шума дБ
    mountingType: '',            // тип монтажа
    controlType: '',             // тип управления
    material: '',                // материал
    compatibility: [],           // совместимость с брендами
    powerRange: [0, 5000],       // мощность в Вт
      factory: [],      // добавить
  warranty: [],
    series: [],        // Серия (K-series.1, K-series.2 и т.д.)
  netWeightRange: [0, 100], // Вес нетто в кг
  widthCmRange: [0, 200],
  status: []   // Ширина в см      
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
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    setInStock: (state, action) => {
      state.inStock = action.payload;
    },
        // Добавляем reducer для статуса
    setStatus: (state, action) => {
      const value = action.payload;
      if (state.status.includes(value)) {
        state.status = state.status.filter(v => v !== value);
      } else {
        state.status.push(value);
      }
    },
    
    // Новые редьюсеры для динамических фильтров
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
      const brand = action.payload;
      if (state.compatibility.includes(brand)) {
        state.compatibility = state.compatibility.filter(b => b !== brand);
      } else {
        state.compatibility.push(brand);
      }
    },
    setPowerRange: (state, action) => {
      state.powerRange = action.payload;
    },
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
        setFactory: (state, action) => {
      const value = action.payload;
      if (state.factory.includes(value)) {
        state.factory = state.factory.filter(v => v !== value);
      } else {
        state.factory.push(value);
      }
    },
    setWarranty: (state, action) => {
      const value = action.payload;
      if (state.warranty.includes(value)) {
        state.warranty = state.warranty.filter(v => v !== value);
      } else {
        state.warranty.push(value);
      }
    },
        // Добавить фильтр по серии
    setSeries: (state, action) => {
      const value = action.payload;
      if (state.series.includes(value)) {
        state.series = state.series.filter(v => v !== value);
      } else {
        state.series.push(value);
      }
    },
    
    // Добавить фильтр по весу нетто
    setNetWeightRange: (state, action) => {
      state.netWeightRange = action.payload;
    },
    
    // Добавить фильтр по ширине в см
    setWidthCmRange: (state, action) => {
      state.widthCmRange = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.category = 'all';
      state.manufacturer = [];
      state.priceRange = [0, 500000];
      state.color = '';
      state.loadCapacity = '';
      state.energyClass = '';
      state.brand = null;
      state.inStock = null;
      // Сброс динамических фильтров
      state.widthRange = [0, 200];
      state.heightRange = [0, 200];
      state.depthRange = [0, 100];
      state.volumeRange = [0, 1000];
      state.performanceRange = [0, 1500];
      state.noiseLevelRange = [0, 70];
      state.mountingType = '';
      state.controlType = '';
      state.material = '';
      state.compatibility = [];
      state.powerRange = [0, 5000];
           state.factory = [];
      state.warranty = [];
           state.series = [];
      state.netWeightRange = [0, 100];
      state.widthCmRange = [0, 200];
      state.status = []; 
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
  setStatus
} = filtersSlice.actions;

export default filtersSlice.reducer;