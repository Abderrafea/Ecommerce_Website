<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center justify-start space-x-2 text-gray-900 hover:text-blue-600 transition-colors">
            <img src="@/assets/e-commerce.png" alt="BoutikGo Logo" class="h-8 w-8" />
            <span class="text-xl sm:text-2xl font-bold hidden sm:block">BoutikGo</span>
            <span class="text-lg font-bold sm:hidden">BG</span>
          </router-link>
        </div>

        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input 
              v-model="searchQuery" 
              @keyup.enter="performSearch"
              @input="onSearchInput"
              type="text" 
              placeholder="Rechercher un produit..."
              class="w-full px-4 py-2 pl-4 pr-12 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button @click="performSearch" class="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="md:hidden">
          <button @click="toggleMobileSearch" class="text-gray-600 hover:text-gray-900 p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Accueil
          </router-link>
          <router-link to="/categories" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Catégories
          </router-link>

          <div v-if="!user">
            <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Connexion
            </router-link>
          </div>
          
          <div v-if="user" class="flex items-center space-x-4">
            <router-link to="/cart" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Panier
            </router-link>
            <router-link to="/profile" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Mon Compte
            </router-link>
            
            <router-link v-if="user?.role === 'admin'" to="/admin" class="text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Admin
            </router-link>

          </div>
        </div>

        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-600 hover:text-gray-900 p-2">
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileSearchOpen" class="md:hidden py-4">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            @keyup.enter="performSearch"
            @input="onSearchInput"
            type="text" 
            placeholder="Rechercher un produit..."
            class="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button @click="performSearch" class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg">
          <router-link 
            to="/" 
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Accueil
          </router-link>
          <router-link 
            to="/categories" 
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Catégories
          </router-link>

          <div v-if="!user" class="px-3 py-2">
            <router-link 
              to="/login" 
              @click="closeMobileMenu"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full text-center block"
            >
              Connexion
            </router-link>
          </div>
          
          <div v-if="user" class="space-y-1">
            <router-link 
              to="/cart" 
              @click="closeMobileMenu"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Panier
            </router-link>
            <router-link 
              to="/profile" 
              @click="closeMobileMenu"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Mon Compte
            </router-link>
            
            <router-link 
              v-if="user?.role === 'admin'" 
              to="/admin" 
              @click="closeMobileMenu"
              class="text-orange-600 hover:text-orange-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Admin
            </router-link>

          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNavbar',
  data() {
    return {
      user: null,
      searchQuery: '',
      mobileMenuOpen: false,
      mobileSearchOpen: false,
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.user = null;
      this.mobileMenuOpen = false;
      this.$router.push('/login');
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.mobileSearchOpen = false;
        this.mobileMenuOpen = false;
        this.$router.push({
          path: '/search',
          query: { q: this.searchQuery.trim() }
        });
      }
    },
    
    onSearchInput() {
      if (this.searchQuery.length >= 3) {
        this.$emit('search', this.searchQuery);
      }
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      if (this.mobileMenuOpen) {
        this.mobileSearchOpen = false;
      }
    },

    toggleMobileSearch() {
      this.mobileSearchOpen = !this.mobileSearchOpen;
      if (this.mobileSearchOpen) {
        this.mobileMenuOpen = false;
      }
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
      this.mobileSearchOpen = false;
    }
  }
};
</script>
