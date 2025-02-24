// Fonction pour vérifier si un token est valide
export function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
}

// Fonction pour obtenir l'utilisateur connecté
export function getCurrentUser() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) return null;
  
  if (!isTokenValid(token)) {
    // Token expiré, nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  try {
    return JSON.parse(userData);
  } catch (e) {
    return null;
  }
}

// Fonction pour vérifier si l'utilisateur est connecté
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Fonction pour nettoyer les données d'authentification
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
} 