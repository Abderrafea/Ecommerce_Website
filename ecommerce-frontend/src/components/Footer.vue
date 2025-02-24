<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div>
          <h3 class="text-xl font-bold mb-4 text-primary-500">À propos de BoutikGo</h3>
          <p class="text-gray-400 mb-4">
            Votre destination shopping en ligne pour des produits de qualité. 
            Nous nous engageons à vous offrir la meilleure expérience d'achat.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-bold mb-4 text-primary-500">Liens rapides</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
                Accueil
              </router-link>
            </li>
            <li>
              <router-link to="/categories" class="text-gray-400 hover:text-white transition-colors">
                Catégories
              </router-link>
            </li>
            <li>
              <router-link to="/cart" class="text-gray-400 hover:text-white transition-colors">
                Panier
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="text-gray-400 hover:text-white transition-colors">
                Mon compte
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-bold mb-4 text-primary-500">Contact</h3>
          <ul class="space-y-2">
            <li class="flex items-center space-x-2 text-gray-400">
              <i class="fas fa-map-marker-alt w-6"></i>
              <span>123 Rue abc, casablanca. Maroc</span>
            </li>
            <li class="flex items-center space-x-2 text-gray-400">
              <i class="fas fa-phone w-6"></i>
              <span>+212 6 12 34 56 78</span>
            </li>
            <li class="flex items-center space-x-2 text-gray-400">
              <i class="fas fa-envelope w-6"></i>
              <span>contact@boutikgo.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-gray-800 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} BoutikGo. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
