// Configuration de l'API
const API_CONFIG = {
  // URL de base de l'API - peut être changée selon l'environnement
  BASE_URL: process.env.VUE_APP_API_URL || 'http://localhost:5000',
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    
    // Produits
    PRODUCTS: '/api/product',
    PRODUCT_BY_ID: (id) => `/api/product/${id}`,
    
    
    ORDERS: '/api/order',
    USER_ORDERS: '/api/order/orders',
    
    // Admin
    ADMIN_DASHBOARD: '/api/admin/dashboard',
    ADMIN_USERS: '/api/admin/users',
    ADMIN_USER_BY_ID: (id) => `/api/admin/users/${id}`,
  }
};

// Fonction pour construire l'URL complète
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour obtenir les headers d'authentification
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Export de la configuration
export default API_CONFIG; 