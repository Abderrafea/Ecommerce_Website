<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div class="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
            <img 
              src="@/assets/img_home.jpeg" 
              alt="BoutikGo" 
              class="w-64 h-64 md:w-96 md:h-96 object-cover rounded-3xl shadow-2xl border-8 border-white/20 hover:border-white/40 transition-all duration-300"
            />
          </div>
          
          <div class="text-center lg:text-left">
            <h1 class="text-5xl md:text-7xl font-bold mb-6 hover:text-yellow-300 transition-colors duration-300">
              BoutikGo
            </h1>
            <p class="text-xl md:text-3xl text-white/90 mb-8">
              Bienvenue dans votre boutique en ligne préférée
            </p>
            <div class="flex justify-center lg:justify-start">
              <button 
                @click="scrollToCategories"
                class="bg-white text-blue-600 hover:bg-yellow-300 px-12 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg shadow-lg"
              >
                Découvrir
                <i class="fas fa-chevron-down animate-bounce"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="categoriesSection" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Nos Catégories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <router-link 
            v-for="category in categories" 
            :key="category.name"
            :to="{ path: '/categories', query: { filter: category.value }}"
            class="group cursor-pointer"
          >
            <div :class="['bg-gradient-to-br rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl', category.gradient]">
              <i :class="['text-4xl text-white mb-4', category.icon]"></i>
              <h3 class="text-lg font-semibold text-white">{{ category.name }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h2>
          <p class="text-lg text-gray-600">Découvrez notre sélection de produits de qualité</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <ProductCard
            v-for="(x, index) in products"
            :key="index"
            :product="x"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { productService } from '@/services/api.js';

const products = ref([]);
const categoriesSection = ref(null);

const categories = [
  { 
    name: 'Électronique', 
    value: 'electronique',
    icon: 'fas fa-mobile-alt',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Mode', 
    value: 'vetements',
    icon: 'fas fa-tshirt',
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Maison', 
    value: 'maison',
    icon: 'fas fa-home',
    gradient: 'from-green-500 to-green-600'
  },
  { 
    name: 'Sport', 
    value: 'sport',
    icon: 'fas fa-futbol',
    gradient: 'from-red-500 to-red-600'
  }
];

const scrollToCategories = () => {
  if (categoriesSection.value) {
    categoriesSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(p => p._id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} a été ajouté au panier.`);
};

onMounted(async () => {
  try {
    products.value = await productService.getAll();
  } catch (err) {
    console.error('Erreur de chargement des produits', err);
  }
});
</script>