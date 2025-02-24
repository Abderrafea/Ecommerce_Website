<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="card mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        </div>

        <!-- Orders Table -->
        <div class="card">
          <div v-if="loading" class="text-center py-12">
            <p class="text-xl text-gray-600">Chargement des commandes...</p>
          </div>
          <div v-else-if="orders.length === 0" class="text-center py-12">
            <p class="text-xl text-gray-600">Aucune commande trouvée.</p>
          </div>
          <div v-else class="overflow-x-auto max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ order.user?.name || 'Client inconnu' }}</div>
                    <div class="text-sm text-gray-500">{{ order.user?.email || 'Email non disponible' }}</div>
                    <div class="text-sm text-gray-500">{{ order.user?.phone || 'Tél. non disponible' }}</div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="space-y-3">
                      <div v-for="item in order.products" :key="item.product?._id" class="flex items-start space-x-3">
                        <img 
                          :src="item.product?.image" 
                          :alt="item.product?.name"
                          class="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          @error="handleImageError"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ item.product?.name || 'Produit non disponible' }}
                          </div>
                          <div class="text-sm text-gray-600">
                            Quantité: {{ item.quantity }}
                          </div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ item.product?.price ? `${item.product.price} MAD` : 'Prix non disponible' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ order.shippingAddress?.address || 'Adresse non disponible' }}</div>
                    <div class="text-sm font-medium text-gray-900">{{ order.shippingAddress?.city || 'Ville non disponible' }}</div>
                    <div class="text-sm text-gray-500">{{ order.shippingAddress?.postalCode || 'Code postal non disponible' }}</div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-lg font-bold text-gray-900">
                      {{ formatPrice(order.totalPrice) }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ formatDate(order.createdAt) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { orderService } from '@/services/api.js';
import AdminNavbar from '@/components/AdminNavbar.vue';

const orders = ref([]);
const loading = ref(true);

const loadOrders = async () => {
  try {
    const response = await orderService.getAll();
    console.log('Commandes reçues:', response);
    orders.value = response;
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date non disponible';
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Prix non disponible';
  return `${price.toFixed(2)} MAD`;
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-product.png'; 
};

onMounted(() => {
  loadOrders();
});
</script>