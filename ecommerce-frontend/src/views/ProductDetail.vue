<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="card text-center py-12">
        <p class="text-xl text-gray-600">Chargement du produit...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="card text-center py-12">
        <p class="text-xl text-red-600">{{ error }}</p>
      </div>
      
      <!-- Product Detail -->
      <div v-else class="card">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Image Container -->
          <div class="relative">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-96 lg:h-[500px] object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute top-4 right-4">
              <span 
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold text-white uppercase',
                  product.stock < 5 ? 'bg-red-500' : 'bg-green-500'
                ]"
              >
                {{ product.stock < 5 ? 'Stock limité' : 'En stock' }}
              </span>
            </div>
          </div>
          
          <!-- Info Container -->
          <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">{{ product.name }}</h1>
              <span class="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase whitespace-nowrap">
                {{ product.category }}
              </span>
            </div>
            
            <!-- Description -->
            <p class="text-gray-600 text-lg leading-relaxed">{{ product.description }}</p>
            
            <!-- Product Meta -->
            <div class="bg-gray-50 p-6 rounded-xl space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-medium">Stock disponible:</span>
                <span 
                  :class="[
                    'font-semibold',
                    product.stock < 5 ? 'text-red-600' : 'text-gray-900'
                  ]"
                >
                  {{ product.stock }} unités
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-medium">Catégorie:</span>
                <span class="font-semibold text-gray-900">{{ product.category }}</span>
              </div>
            </div>
            
            <!-- Price Section -->
            <div class="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 rounded-xl text-center text-white">
              <p class="text-4xl lg:text-5xl font-bold mb-2">
                {{ product.price.toLocaleString() }} MAD
              </p>
            </div>
            
            <!-- Actions -->
            <div class="space-y-4">
              <!-- Quantity Input -->
              <div class="flex items-center gap-4">
                <label for="quantity-input" class="text-gray-700 font-medium">Quantité:</label>
                <input 
                  id="quantity-input" 
                  type="number" 
                  v-model.number="quantity" 
                  min="1" 
                  :max="product.stock || 99" 
                  class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <!-- Add to Cart Button -->
              <button 
                v-if="isLoggedInState"
                @click="addToCart" 
                :disabled="product.stock === 0"
                :class="[
                  'w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3',
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-soft hover:shadow-medium hover:-translate-y-1'
                ]"
              >
                <span class="text-xl">🛒</span>
                {{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
              </button>
              
              <!-- Login Required -->
              <div v-else class="text-center py-4">
                <p class="text-red-600 font-bold text-lg">Connectez-vous pour ajouter au panier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { productService } from '@/services/api.js';
import { isLoggedIn } from '@/utils/auth.js';

const route = useRoute();

const product = ref(null);
const quantity = ref(1);
const loading = ref(true);
const error = ref('');
const isLoggedInState = ref(false);

const addToCart = () => {
  if (!product.value) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const idx = cart.findIndex(item => item._id === product.value._id);
  if (idx !== -1) {
    cart[idx].quantity = (cart[idx].quantity || 1) + quantity.value;
  } else {
    cart.push({ ...product.value, quantity: quantity.value });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produit ajouté au panier !');
  quantity.value = 1;
};

onMounted(async () => {
  try {
    const id = route.params.id;
    product.value = await productService.getById(id);
  } catch (err) {
    error.value = "Produit introuvable.";
  } finally {
    loading.value = false;
  }
  isLoggedInState.value = isLoggedIn();
});
</script>

