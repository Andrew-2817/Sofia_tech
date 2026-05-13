import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Восстановление состояния из localStorage
const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (user && token) {
      return {
        isLoggedIn: true,
        user: JSON.parse(user),
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователя из localStorage:', error);
  }
  return {
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
  };
};

// Асинхронные действия
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
      return rejectWithValue(error.response?.data?.detail || 'Ошибка регистрации');
    }
  }
);

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
      return rejectWithValue(error.response?.data?.detail || 'Ошибка входа');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromStorage(), // ← восстанавливаем состояние
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('access_token', action.payload.access_token);
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('access_token', action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;