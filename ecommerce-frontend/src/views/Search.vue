<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Résultats de recherche</h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>

      <div v-if="searchQuery && filteredProducts.length === 0" class="text-center py-12">
        <p class="text-xl text-gray-600">Aucun produit trouvé pour "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { productService } from '@/services/api.js';

const route = useRoute();

const products = ref([]);
const searchQuery = ref(route.query.q || '');

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
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
  } catch (err) {
    console.error('Erreur de chargement des produits', err);
  }
});

watch(() => route.query.q, (val) => {
  searchQuery.value = val || '';
});
</script>