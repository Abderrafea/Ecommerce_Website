<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="card text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Mon Compte</h1>
        <p class="text-xl text-gray-600">Bienvenue, {{ user?.name || 'Utilisateur' }}</p>
      </div>

      <div class="card mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2">
          Informations Personnelles
        </h2>
        <div v-if="!editMode" class="space-y-4 mb-6">
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <label class="font-bold text-gray-900">Nom complet :</label>
            <span class="text-gray-700">{{ user?.name || 'Non renseigné' }}</span>
          </div>
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <label class="font-bold text-gray-900">Email :</label>
            <span class="text-gray-700">{{ user?.email || 'Non renseigné' }}</span>
          </div>
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <label class="font-bold text-gray-900">Rôle :</label>
            <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {{ user?.role === 'admin' ? 'Administrateur' : 'Client' }}
            </span>
          </div>
        </div>
        <!-- Formulaire d'édition -->
        <form v-else @submit.prevent="submitEdit" class="space-y-4 mb-6">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-900">Nom complet :</label>
            <input v-model="editUser.name" type="text" class="input" required />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-900">Email :</label>
            <input v-model="editUser.email" type="email" class="input" required />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-900">Mot de passe actuel <span class='text-red-500'>*</span> :</label>
            <input v-model="editUser.currentPassword" type="password" class="input" placeholder="Votre mot de passe actuel" required />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-900">Nouveau mot de passe :</label>
            <input v-model="editUser.password" type="password" class="input" placeholder="Laisser vide pour ne pas changer" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-gray-900">Confirmer le mot de passe :</label>
            <input v-model="editUser.confirmPassword" type="password" class="input" placeholder="Confirmer le mot de passe" />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn-primary">Enregistrer</button>
            <button type="button" class="btn-secondary" @click="editMode = false">Annuler</button>
          </div>
        </form>
        <button v-if="!editMode" class="btn-primary" @click="startEdit">Modifier le profil</button>
      </div>

      <div class="card mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2">
          Mes Commandes
        </h2>
        <div v-if="orders.length === 0" class="text-center py-8">
          <p class="text-gray-600 text-lg mb-4">Aucune commande pour le moment</p>
          <router-link to="/" class="btn-primary">
            Commencer à acheter
          </router-link>
        </div>
        <div v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
          <div v-for="order in orders" :key="order._id" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 mb-2">
              <span class="font-bold text-gray-900">Commande #{{ order._id.slice(-6) }}</span>
              <span class="text-gray-600 text-sm">{{ formatDate(order.createdAt) }}</span>
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-sm font-bold',
                  order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ order.isDelivered ? 'Livrée' : 'En attente' }}
              </span>
            </div>
            <div class="font-bold text-gray-900 mb-2">
              Total: {{ order.totalPrice }} MAD
            </div>
            <div v-if="order.isDelivered && order.deliveredAt" class="text-sm text-gray-600 mb-2">
              Livrée le: {{ formatDate(order.deliveredAt) }}
            </div>
            <!-- Liste des produits de la commande -->
            <div class="pl-2">
              <div v-for="item in order.products" :key="item._id" class="flex items-center gap-2 mb-1">
                <span class="text-gray-700">•</span>
                <span class="font-medium">{{ item.product?.name }}</span>
                <span class="text-gray-500">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2">
          Actions Rapides
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link to="/cart" class="btn-primary flex items-center justify-center gap-2">
            Voir mon panier
          </router-link>
          <router-link to="/" class="btn-primary flex items-center justify-center gap-2">
            Continuer les achats
          </router-link>
          <button class="btn-danger flex items-center justify-center gap-2" @click="logout">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService, userService } from '@/services/api.js';
import { getCurrentUser } from '@/utils/auth.js';

const router = useRouter();

const user = ref(null);
const orders = ref([]);

// --- Ajout pour édition du profil ---
const editMode = ref(false);
const editUser = ref({ name: '', email: '', password: '', confirmPassword: '', currentPassword: '' });

const startEdit = () => {
  editUser.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    password: '',
    confirmPassword: '',
    currentPassword: '' // Toujours vide à chaque ouverture
  };
  editMode.value = true;
};

const submitEdit = async () => {
  if (editUser.value.password && editUser.value.password !== editUser.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas.');
    return;
  }
  if (!editUser.value.currentPassword) {
    alert('Veuillez saisir votre mot de passe actuel.');
    return;
  }
  try {
    const payload = {
      name: editUser.value.name,
      email: editUser.value.email,
      currentPassword: editUser.value.currentPassword
    };
    if (editUser.value.password) payload.password = editUser.value.password;
    const res = await userService.updateProfile(payload);
    user.value = res.user;
    localStorage.setItem('user', JSON.stringify(res.user));
    editMode.value = false;
    editUser.value.password = '';
    editUser.value.confirmPassword = '';
    editUser.value.currentPassword = '';
    alert('Profil mis à jour !');
  } catch (err) {
    alert('Erreur lors de la mise à jour du profil');
  }
};
// --- Fin ajout édition profil ---

const loadOrders = async () => {
  try {
    orders.value = await orderService.getUserOrders();
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    orders.value = [];
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
  window.location.reload();
};

onMounted(() => {
  user.value = getCurrentUser();
  if (!user.value) {
    router.push('/login');
  } else {
    loadOrders();
  }
});
</script>

