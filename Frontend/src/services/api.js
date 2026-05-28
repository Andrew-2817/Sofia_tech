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

    async getDietProducts() {
    return this.request('/products/dedietrich/');
  }

    async getKupperProducts() {
    return this.request('/products/kuppersbusch/');
  }

    async getGraudeProducts() {
    return this.request('/products/graude/');
  }

    async getBonkProducts() {
    return this.request('/products/bonkrasher/');
  }

    async getTekaProducts() {
    return this.request('/products/teka/');
  }

    async getFalmecProducts() {
    return this.request('/products/falmec/');
  }

      async getSchultProducts() {
    return this.request('/products/schulthess/');
  }

  // Получить все товары всех брендов
  async getAllProducts() {
    try {
      const [homeier, brandt, liebherr, nivona, diet, kupper, schult, graude, bonk, teka, falmec] = await Promise.all([
        this.getHomeierProducts(),
        this.getBrandtProducts(),
        this.getLiebherrProducts(),
        this.getNivonaProducts(),
        this.getDietProducts(),
        this.getKupperProducts(),
        this.getSchultProducts(),
        this.getGraudeProducts(),
        this.getBonkProducts(),
        this.getTekaProducts(),
        this.getFalmecProducts()

      ]);
      return { homeier, brandt, liebherr, nivona, diet, kupper, schult, graude, bonk, teka, falmec};
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}

export const api = new ApiService();