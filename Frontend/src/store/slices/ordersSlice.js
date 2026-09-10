// store/slices/ordersSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ========== УТИЛИТЫ ==========
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error, defaultMessage) => {
  return error.response?.data?.detail || defaultMessage;
};

// ========== THUNK ==========
// Создание заказа
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/orders/`,
        orderData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Ошибка оформления заказа'));
    }
  }
);

// Получение заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.get(
        `${API_URL}/orders/my`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Ошибка загрузки заказов'));
    }
  }
);

// Получение конкретного заказа
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.get(
        `${API_URL}/orders/${orderId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Ошибка загрузки заказа'));
    }
  }
);

// Отмена заказа
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.put(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Ошибка отмены заказа'));
    }
  }
);

// Повтор заказа
export const reorder = createAsyncThunk(
  'orders/reorder',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('Нет токена авторизации');
      }
      
      const response = await axios.post(
        `${API_URL}/orders/${orderId}/reorder`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Ошибка повторения заказа'));
    }
  }
);

// ========== SLICE ==========
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    selectedOrder: null,
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
      // createOrder
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
      
      // fetchUserOrders
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
      
      // fetchOrderById
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
      
      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // reorder
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

// ========== МЕМОИЗИРОВАННЫЕ СЕЛЕКТОРЫ ==========
const selectOrdersState = (state) => state.orders;

// Базовые селекторы
export const selectOrders = (state) => state.orders.items || [];
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersSuccess = (state) => state.orders.success;

// Мемоизированные селекторы
export const selectOrdersCount = createSelector(
  [selectOrders],
  (orders) => orders.length
);

export const selectOrdersByStatus = createSelector(
  [selectOrders, (_, status) => status],
  (orders, status) => orders.filter(order => order.status === status)
);

export const selectOrdersCountByStatus = createSelector(
  [selectOrdersByStatus],
  (filteredOrders) => filteredOrders.length
);

export const selectOrderById = createSelector(
  [selectOrders, (_, orderId) => orderId],
  (orders, orderId) => orders.find(order => order.id === orderId)
);

export const selectRecentOrders = createSelector(
  [selectOrders, (_, limit) => limit],
  (orders, limit = 5) => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }
);

export const selectTotalSpent = createSelector(
  [selectOrders],
  (orders) => orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
);

export const selectActiveOrders = createSelector(
  [selectOrders],
  (orders) => orders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  )
);

// ========== ЭКСПОРТ ==========
export const { clearOrderState, clearOrders, clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;