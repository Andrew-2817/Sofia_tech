// store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Загрузка корзины из localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Ошибка загрузки корзины из localStorage:', error);
  }
  return [];
};

// Сохранение корзины в localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Ошибка сохранения корзины в localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(), // Загружаем из localStorage
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, brandId, name, price, image, sku, brandName, color, model } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.id === id && item.brandId === brandId
      );
      
      if (existingIndex === -1) {
        state.items.push({ 
          id, 
          brandId, 
          name, 
          price, 
          quantity: 1, 
          image,
          sku: sku || null,
          brandName: brandName || null,
          color: color || null,
          model: model || null,
        });
      } else {
        state.items[existingIndex].quantity += 1;
      }
      
      // Сохраняем в localStorage
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { id, brandId } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === id && item.brandId === brandId)
      );
      saveCartToStorage(state.items);
    },
    incrementQuantity: (state, action) => {
      const { id, brandId } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.brandId === brandId
      );
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },
    decrementQuantity: (state, action) => {
      const { id, brandId } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.brandId === brandId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.items);
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter(
          i => !(i.id === id && i.brandId === brandId)
        );
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart 
} = cartSlice.actions;
export default cartSlice.reducer;