<template>
  <div class="card group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
    <router-link :to="`/product/${product._id}`" class="block mb-4">
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity duration-200"
      />
    </router-link>

    <div class="flex-1">
      <router-link :to="`/product/${product._id}`" class="block mb-2">
        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
          {{ product.name }}
        </h3>
      </router-link>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ product.description }}
      </p>
      
      <p class="text-2xl font-bold text-gray-900 mb-4">
        {{ product.price }} MAD
      </p>
    </div>

    <button 
      @click="handleAddToCart" 
      :disabled="!isLoggedIn"
      :class="[
        'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200',
        isLoggedIn 
          ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-medium' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'
      ]"
    >
      {{ isLoggedIn ? 'Ajouter au panier' : 'Connexion requise' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn as checkLoginStatus } from '@/utils/auth.js';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);
const router = useRouter();
const isLoggedIn = ref(false);

const handleAddToCart = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  emit('add-to-cart', props.product);
};

onMounted(() => {
  isLoggedIn.value = checkLoginStatus();
});
</script>
