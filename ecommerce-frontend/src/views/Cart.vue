<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h2>
      
      <div v-if="cartProducts.length" class="space-y-8">
        <div class="space-y-4">
          <div
            v-for="(product, index) in cartProducts"
            :key="index"
            class="card flex items-center justify-between gap-6"
          >
            <div class="flex items-center gap-4 flex-1">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ product.name }}</h3>
                <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>
                <p class="text-green-600 font-bold">{{ product.price }} MAD</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <button 
                @click="decreaseQuantity(index)" 
                :disabled="product.quantity <= 1"
                class="w-8 h-8 border border-gray-300 bg-white rounded-md flex items-center justify-center font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span class="text-lg font-bold min-w-[40px] text-center">{{ product.quantity }}</span>
              <button 
                @click="increaseQuantity(index)" 
                class="w-8 h-8 border border-gray-300 bg-white rounded-md flex items-center justify-center font-bold hover:bg-gray-50"
              >
                +
              </button>
            </div>
            
            <div class="text-right min-w-[120px]">
              <p class="text-lg font-bold text-green-600 mb-2">
                {{ (product.price * product.quantity).toFixed(2) }} MAD
              </p>
              <button 
                @click="removeProduct(index)" 
                class="btn-danger text-sm"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h3>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-600">Sous-total:</span>
              <span class="font-semibold">{{ subtotal.toFixed(2) }} MAD</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-lg font-bold text-gray-900">Total:</span>
              <span class="text-xl font-bold text-green-600">{{ subtotal.toFixed(2) }} MAD</span>
            </div>
          </div>
        </div>

        <form class="card" @submit.prevent="payCart">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Adresse de livraison</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
              v-model="shippingAddress.country" 
              type="text" 
              placeholder="Pays" 
              required 
              class="input-field"
            />
            <input 
              v-model="shippingAddress.city" 
              type="text" 
              placeholder="Ville" 
              required 
              class="input-field"
            />
            <input 
              v-model="shippingAddress.address" 
              type="text" 
              placeholder="Adresse" 
              required 
              class="input-field"
            />
            <input 
              v-model="shippingAddress.postalCode" 
              type="text" 
              placeholder="Code postal" 
              required 
              class="input-field"
            />
          </div>
          <button class="btn-primary w-full text-lg py-4" type="submit">
            Payer {{ subtotal.toFixed(2) }} MAD
          </button>
        </form>
      </div>
      
      <!-- Empty Cart -->
      <div v-else class="card text-center py-12">
        <p class="text-xl text-gray-600 mb-4">Votre panier est vide.</p>
        <router-link to="/" class="btn-primary">
          Continuer les achats
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { orderService } from '@/services/api.js';

const cartProducts = ref([]);
const shippingAddress = ref({
  country: '',
  city: '',
  address: '',
  postalCode: ''
});

const subtotal = computed(() => {
  return cartProducts.value.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
});

const increaseQuantity = (index) => {
  cartProducts.value[index].quantity += 1;
  updateCart();
};

const decreaseQuantity = (index) => {
  if (cartProducts.value[index].quantity > 1) {
    cartProducts.value[index].quantity -= 1;
    updateCart();
  }
};

const removeProduct = (index) => {
  cartProducts.value.splice(index, 1);
  updateCart();
};

const updateCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartProducts.value));
};

const payCart = async () => {
  if (!cartProducts.value.length) {
    alert('Votre panier est vide.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour effectuer une commande.');
      return;
    }

    const formattedProducts = cartProducts.value.map(item => ({
      product: item._id,
      quantity: item.quantity
    }));

    const orderData = {
      products: formattedProducts,
      shippingAddress: shippingAddress.value
    };

    await orderService.create(orderData);

    localStorage.removeItem('cart');
    cartProducts.value = [];
    alert('Commande effectuée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la commande:', error);
    const errorMessage = error.response?.data?.message || 'Erreur lors de la commande. Veuillez réessayer.';
    alert(errorMessage);
  }
};

onMounted(() => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cartProducts.value = JSON.parse(storedCart);
  }
});
</script>

