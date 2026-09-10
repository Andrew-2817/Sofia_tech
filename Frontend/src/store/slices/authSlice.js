// store/slices/authSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ========== УТИЛИТЫ ==========
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

const saveUserToStorage = (user, token) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
  }
};

const clearUserStorage = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Ошибка очистки хранилища:', error);
  }
};

const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (user && token) {
      return {
        isLoggedIn: true,
        user: JSON.parse(user),
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error);
  }
  return {
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
  };
};

// ========== THUNK ==========
// Регистрация
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }
      if (error.response?.status === 422) {
        const detail = error.response?.data?.detail;
        if (Array.isArray(detail)) {
          return rejectWithValue(detail[0]?.msg || 'Ошибка валидации данных');
        }
        return rejectWithValue(detail || 'Ошибка валидации данных');
      }
      return rejectWithValue(error.response?.data?.detail || 'Ошибка регистрации');
    }
  }
);

// Логин
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Неверный email или пароль');
      }
      return rejectWithValue(error.response?.data?.detail || 'Ошибка входа');
    }
  }
);

// Получение профиля
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      // Если токен невалидный — очищаем хранилище
      if (error.response?.status === 401) {
        clearUserStorage();
        return rejectWithValue('Сессия истекла, войдите заново');
      }
      return rejectWithValue(error.response?.data?.detail || 'Ошибка загрузки профиля');
    }
  }
);

// Обновление профиля
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.put(`${API_URL}/user/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        clearUserStorage();
        return rejectWithValue('Сессия истекла, войдите заново');
      }
      return rejectWithValue(error.response?.data?.detail || 'Ошибка обновления профиля');
    }
  }
);

// ========== SLICE ==========
const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromStorage(),
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      clearUserStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user, action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user, action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Получение профиля
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Обновляем только user, токен остаётся
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Если сессия истекла — разлогиниваем
        if (action.payload === 'Сессия истекла, войдите заново') {
          state.isLoggedIn = false;
          state.user = null;
        }
      })
      
      // Обновление профиля
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === 'Сессия истекла, войдите заново') {
          state.isLoggedIn = false;
          state.user = null;
        }
      });
  },
});

// ========== МЕМОИЗИРОВАННЫЕ СЕЛЕКТОРЫ ==========
const selectAuthState = (state) => state.auth;

// Базовые селекторы
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Мемоизированные селекторы
export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name || null
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || null
);

export const selectUserPhone = createSelector(
  [selectUser],
  (user) => user?.phone || null
);

export const selectUserAddress = createSelector(
  [selectUser],
  (user) => user?.address || null
);

export const selectIsAdmin = createSelector(
  [selectUser],
  (user) => user?.is_admin || false
);

// ========== ЭКСПОРТ ==========
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;