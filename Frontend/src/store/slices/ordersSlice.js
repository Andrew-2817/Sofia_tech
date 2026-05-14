// store/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Создание заказа
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/orders/`, orderData, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка оформления заказа');
    }
  }
);

// ========== ДОБАВЛЕНО: Получение заказов текущего пользователя ==========
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.get(`${API_URL}/orders/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка загрузки заказов');
    }
  }
);

// ========== ДОБАВЛЕНО: Получение конкретного заказа по ID ==========
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка загрузки заказа');
    }
  }
);

// ========== ДОБАВЛЕНО: Отмена заказа ==========
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка отмены заказа');
    }
  }
);

// ========== ДОБАВЛЕНО: Повтор заказа ==========
export const reorder = createAsyncThunk(
  'orders/reorder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.post(`${API_URL}/orders/${orderId}/reorder`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка повторения заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],           // список заказов пользователя
    currentOrder: null,  // текущий созданный заказ
    selectedOrder: null, // выбранный заказ для просмотра
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.success = false;
    },
    clearOrders: (state) => {
      state.items = [];
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Получение списка заказов
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Получение конкретного заказа
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Отмена заказа
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем статус заказа в списке
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Повтор заказа
      .addCase(reorder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(reorder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearOrderState, 
  clearOrders, 
  clearSelectedOrder 
} = ordersSlice.actions;

export default ordersSlice.reducer;