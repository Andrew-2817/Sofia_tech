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

  // Homeier
  async getHomeierProducts() {
    return this.request('/products/homeier/');
  }

  // Brandt
  async getBrandtProducts() {
    return this.request('/products/brandt/');
  }

  // Liebherr (новый бренд)
  async getLiebherrProducts() {
    return this.request('/products/liebherr/');
  }

  // Nivona (новый бренд)
  async getNivonaProducts() {
    return this.request('/products/nivona/');
  }

  // Получить все товары всех брендов
  async getAllProducts() {
    try {
      const [homeier, brandt, liebherr, nivona] = await Promise.all([
        this.getHomeierProducts(),
        this.getBrandtProducts(),
        this.getLiebherrProducts(),
        this.getNivonaProducts()
      ]);
      return { homeier, brandt, liebherr, nivona };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}

export const api = new ApiService();