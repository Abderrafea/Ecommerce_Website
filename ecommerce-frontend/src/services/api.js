import axios from 'axios';
import { buildApiUrl, getAuthHeaders } from '@/config/api.js';

// Configuration d'axios
const apiClient = axios.create({
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter automatiquement les headers d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    config.headers = { ...config.headers, ...authHeaders };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(buildApiUrl('/api/auth/login'), credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post(buildApiUrl('/api/auth/register'), userData);
    return response.data;
  }
};

// Service des produits
export const productService = {
  getAll: async () => {
    const response = await apiClient.get(buildApiUrl('/api/product'));
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(buildApiUrl(`/api/product/${id}`));
    return response.data;
  },
  
  create: async (productData) => {
    const response = await apiClient.post(buildApiUrl('/api/product'), productData);
    return response.data;
  },
  
  update: async (id, productData) => {
    const response = await apiClient.put(buildApiUrl(`/api/product/${id}`), productData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(buildApiUrl(`/api/product/${id}`));
    return response.data;
  }
};

// Service des commandes
export const orderService = {
  create: async (orderData) => {
    const response = await apiClient.post(buildApiUrl('/api/order'), orderData);
    return response.data;
  },
  
  getUserOrders: async () => {
    console.log('Appel API getUserOrders');
    const response = await apiClient.get(buildApiUrl('/api/order/orders'));
    console.log('Réponse API:', response.data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get(buildApiUrl('/api/order'));
    return response.data;
  }
};

// Service d'administration
export const adminService = {
  getDashboard: async () => {
    const response = await apiClient.get(buildApiUrl('/api/admin/dashboard'));
    return response.data;
  },
  
  getUsers: async () => {
    const response = await apiClient.get(buildApiUrl('/api/admin/users'));
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await apiClient.delete(buildApiUrl(`/api/admin/users/${id}`));
    return response.data;
  }
};

// Service utilisateur
export const userService = {
  updateProfile: async (userData) => {
    const response = await apiClient.put(buildApiUrl('/api/user/profile'), userData);
    return response.data;
  }
};

export default apiClient;