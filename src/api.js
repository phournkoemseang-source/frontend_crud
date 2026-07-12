import axios from 'axios';

// Reads the backend URL from the .env file (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL
});

export default {
  getProducts() {
    return api.get('/products');
  },
  getProduct(id) {
    return api.get(`/products/${id}`);
  },
  createProduct(data) {
    return api.post('/products', data);
  },
  updateProduct(id, data) {
    return api.put(`/products/${id}`, data);
  },
  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  }
};
