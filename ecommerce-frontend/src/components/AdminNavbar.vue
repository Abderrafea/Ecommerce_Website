<template>
  <nav class="bg-gray-800 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
        <!-- Header -->
        <div class="flex items-center justify-between lg:justify-start mb-4 lg:mb-0">
          <router-link to="/admin" class="flex items-center space-x-2 text-white hover:text-primary-300 transition-colors">
            <img src="@/assets/e-commerce.png" alt="BoutikGo Logo" class="h-8 w-8" />
            <span class="text-2xl font-bold">🛠️ Administration</span>
          </router-link>
          <div class="lg:hidden">
            <span class="text-gray-300">{{ user?.name || 'Admin' }}</span>
          </div>
        </div>

        <!-- User Info (Desktop) -->
        <div class="hidden lg:block">
          <span class="text-gray-300">{{ user?.name || 'Admin' }}</span>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-wrap gap-2 lg:gap-4">
          <router-link 
            to="/admin" 
            class="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-medium"
            active-class="bg-primary-600 text-white"
          >
             Dashboard
          </router-link>
          <router-link 
            to="/admin/products" 
            class="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-medium"
            active-class="bg-primary-600 text-white"
          >
             Produits
          </router-link>
          <router-link 
            to="/admin/users" 
            class="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-medium"
            active-class="bg-primary-600 text-white"
          >
             Utilisateurs
          </router-link>
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-medium"
          >
             Retour au site
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminNavbarComponent',
  data() {
    return {
      user: null
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },

};
</script>