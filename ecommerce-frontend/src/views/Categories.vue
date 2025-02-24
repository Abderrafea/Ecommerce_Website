<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-6"> Catégories</h1>
        <div class="max-w-md mx-auto">
          <label class="block text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie :</label>
          <select v-model="selectedCategory" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>

      <div v-if="selectedCategory && filteredProducts.length === 0" class="text-center py-12">
        <p class="text-xl text-gray-600">Aucun produit trouvé dans la catégorie "{{ selectedCategory }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { productService } from '@/services/api.js';

const products = ref([]);
const selectedCategory = ref('');
const categories = ref([]);

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(p => p.category === selectedCategory.value);
});

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
    categories.value = [...new Set(products.value.map(p => p.category))];
  } catch (err) {
    console.error('Erreur de chargement des produits', err);
  }
});
</script>

