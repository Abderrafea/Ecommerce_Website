<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Tableau de Bord Admin</h1>
        <p class="text-xl text-gray-600">Gestion de votre boutique en ligne</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card col-span-full lg:col-span-1">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
             Statistiques
          </h3>
          <div v-if="loading" class="text-gray-500">Chargement...</div>
          <div v-else class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Utilisateurs :</span>
              <span class="font-bold text-primary-600">{{ stats.totalUsers }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Produits :</span>
              <span class="font-bold text-primary-600">{{ stats.totalProducts }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Commandes :</span>
              <span class="font-bold text-primary-600">{{ stats.totalOrders }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Ventes totales :</span>
              <span class="font-bold text-green-600">{{ stats.totalSales }} MAD</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
             Gestion Utilisateurs
          </h3>
          <p class="text-gray-600 mb-6 italic">Voir et gérer les utilisateurs</p>
          <router-link to="/admin/users" class="btn-primary w-full text-center">
            Gérer les utilisateurs →
          </router-link>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
             Gestion Produits
          </h3>
          <p class="text-gray-600 mb-6 italic">Ajouter, modifier et supprimer des produits</p>
          <router-link to="/admin/products" class="btn-primary w-full text-center">
            Gérer les produits →
          </router-link>
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
             Commandes
          </h3>
          <p class="text-gray-600 mb-6 italic">Voir et gérer les commandes</p>
          <router-link to="/admin/orders" class="btn-primary w-full text-center">
            Gérer les commandes →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '@/services/api.js';

const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalSales: 0
});
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await adminService.getDashboard();
    stats.value = data.dashboard;
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques', err);
  } finally {
    loading.value = false;
  }
});
</script>

