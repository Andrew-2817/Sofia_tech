// api.js
export const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const API_BASE_URL_photo = 'http://127.0.0.1:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Категории
  async getCategoriesTree() {
    return this.request('/categories/tree');
  }

  // ========== НОВЫЕ МЕТОДЫ ДЛЯ ТОВАРОВ ==========
  
  // Получить все товары Homeier
  async getHomeierProducts() {
    return this.request('/products/homeier/');
  }

  // Получить все товары Brandt
  async getBrandtProducts() {
    return this.request('/products/brandt/');
  }

  // Получить все товары (объединяет оба бренда)
  async getAllProducts() {
    try {
      const [homeier, brandt] = await Promise.all([
        this.getHomeierProducts(),
        this.getBrandtProducts()
      ]);
      return { homeier, brandt };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}

export const api = new ApiService();