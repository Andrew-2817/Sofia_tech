// store/slices/categoriesSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// ========== КОНСТАНТЫ ==========
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// ========== АСИНХРОННЫЙ THUNK ==========
export const fetchCategoriesTree = createAsyncThunk(
  'categories/fetchTree',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Проверяем кеш
      const state = getState();
      const { lastUpdated, tree } = state.categories;
      
      // Если есть данные и они не устарели — возвращаем их
      if (tree.length > 0 && lastUpdated && (Date.now() - lastUpdated < CACHE_TTL)) {
        return tree;
      }
      
      // Если кеш устарел или пуст — делаем запрос
      const response = await api.getCategoriesTree();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка загрузки категорий');
    }
  }
);

// ========== SLICE ==========
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
      state.lastUpdated = null;
    },
    // Принудительное обновление (сброс кеша)
    invalidateCategoriesCache: (state) => {
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesTree.fulfilled, (state, action) => {
        state.loading = false;
        state.tree = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchCategoriesTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки категорий';
      });
  },
});

// ========== БАЗОВЫЕ СЕЛЕКТОРЫ ==========
export const selectCategories = (state) => state.categories.tree;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesLastUpdated = (state) => state.categories.lastUpdated;

// ========== МЕМОИЗИРОВАННЫЕ СЕЛЕКТОРЫ ==========
// Все категории плоским списком (для поиска)
export const selectAllCategoriesFlat = createSelector(
  [selectCategories],
  (categories) => {
    const flatten = (items, result = []) => {
      for (const item of items) {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children, result);
        }
      }
      return result;
    };
    return flatten(categories);
  }
);

// Поиск категории по ID
export const selectCategoryById = createSelector(
  [selectAllCategoriesFlat, (_, id) => id],
  (categories, id) => categories.find(cat => cat.id === id)
);

// Поиск категории по slug
export const selectCategoryBySlug = createSelector(
  [selectAllCategoriesFlat, (_, slug) => slug],
  (categories, slug) => categories.find(cat => cat.slug === slug)
);

// Категории 1 уровня
export const selectLevel1Categories = createSelector(
  [selectCategories],
  (categories) => categories.filter(cat => cat.level === 1)
);

// Категории по уровню
export const selectCategoriesByLevel = createSelector(
  [selectAllCategoriesFlat, (_, level) => level],
  (categories, level) => categories.filter(cat => cat.level === level)
);

// Дочерние категории по parent_id
export const selectChildrenCategories = createSelector(
  [selectAllCategoriesFlat, (_, parentId) => parentId],
  (categories, parentId) => categories.filter(cat => cat.parent_id === parentId)
);

// Breadcrumbs для категории
export const selectCategoryBreadcrumbs = createSelector(
  [selectAllCategoriesFlat, (_, categoryId) => categoryId],
  (categories, categoryId) => {
    const breadcrumbs = [];
    let currentId = categoryId;
    const categoryMap = {};
    
    // Строим карту для быстрого доступа
    categories.forEach(cat => {
      categoryMap[cat.id] = cat;
    });
    
    // Поднимаемся вверх по дереву
    while (currentId && categoryMap[currentId]) {
      breadcrumbs.unshift(categoryMap[currentId]);
      currentId = categoryMap[currentId].parent_id;
    }
    
    return breadcrumbs;
  }
);

// Проверка наличия кеша
export const selectHasValidCache = createSelector(
  [selectCategoriesLastUpdated, selectCategories],
  (lastUpdated, tree) => {
    return tree.length > 0 && lastUpdated && (Date.now() - lastUpdated < CACHE_TTL);
  }
);

// ========== ЭКСПОРТ ==========
export const { clearCategories, invalidateCategoriesCache } = categoriesSlice.actions;
export default categoriesSlice.reducer;