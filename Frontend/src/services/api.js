// services/api.js
export const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const API_BASE_URL_photo = 'http://127.0.0.1:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.photoURL = API_BASE_URL_photo;
  }

  getPhotoUrl(filename) {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    const cleanFilename = filename.replace(/^\/+/, '');
    return `${this.photoURL}${cleanFilename}`;
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

    // ========== БРЕНДЫ ==========
  async getBrands() {
    // Если есть кеш, возвращаем его
    if (this.brandsCache) {
      return this.brandsCache;
    }
    
    const response = await this.request('/brands/');
    this.brandsCache = response;
    return response;
  }

  async getBrand(brandId) {
    return this.request(`/brands/${brandId}`);
  }

  // ========== ЕДИНЫЙ ЭНДПОИНТ ДЛЯ ВСЕХ ТОВАРОВ ==========
  async getAllProducts() {
    try {
      const response = await this.request('/products');
      
      // Ожидаемая структура ответа от сервера:
      // {
      //   products: [...],  // массив всех товаров
      //   total: 123,       // общее количество (опционально)
      //   brands: {...}     // разбивка по брендам (опционально)
      // }
      
      // Если сервер возвращает просто массив
      if (Array.isArray(response)) {
        return { products: response };
      }
      
      // Если сервер возвращает объект с полем products
      if (response.products && Array.isArray(response.products)) {
        return response;
      }
      
      // Если сервер возвращает разбивку по брендам
      if (response.homeier || response.brandt || response.liebherr) {
        return response;
      }
      
      // Если ничего не подошло, возвращаем как есть
      return { products: response };
      
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  // ========== ОТДЕЛЬНЫЕ ЭНДПОИНТЫ ДЛЯ ОТЛАДКИ (опционально) ==========
  // Если нужно получать товары конкретного бренда для отладки
  async getProductsByBrand(brand) {
    return this.request(`/products/brand/${brand}`);
  }
  
  async getProductById(productId) {
    return this.request(`/products/${productId}`);
  }
}

export const api = new ApiService();