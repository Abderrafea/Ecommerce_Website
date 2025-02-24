<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">👥 Gestion des Utilisateurs</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un utilisateur..."
              class="input-field"
            />
            <select v-model="roleFilter" class="input-field">
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateurs</option>
              <option value="admin">Administrateurs</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="card">
          <div v-if="loading" class="text-center py-12">
            <p class="text-xl text-gray-600">Chargement des utilisateurs...</p>
          </div>
          <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
            <p class="text-xl text-gray-600">Aucun utilisateur trouvé.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ user.role === 'admin' ? 'Admin' : 'Utilisateur' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button @click="viewUser(user)" class="btn-secondary text-sm">
                      👁️ Voir
                    </button>
                    <button 
                      @click="deleteUser(user._id)" 
                      :disabled="user.role === 'admin' && adminCount <= 1"
                      :class="[
                        'text-sm',
                        user.role === 'admin' && adminCount <= 1 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed px-3 py-1 rounded-lg' 
                          : 'btn-danger'
                      ]"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- User Details Modal -->
        <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl max-w-md w-full">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-bold text-gray-900">Détails de l'utilisateur</h3>
              <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <span class="font-semibold text-gray-700">Nom:</span>
                <p class="text-gray-900">{{ selectedUser.name }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Email:</span>
                <p class="text-gray-900">{{ selectedUser.email }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Rôle:</span>
                <p class="text-gray-900">{{ selectedUser.role }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Date d'inscription:</span>
                <p class="text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
              </div>
            </div>
            <div class="p-6 border-t border-gray-200">
              <button @click="selectedUser = null" class="btn-primary w-full">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '@/services/api.js';
import AdminNavbar from '@/components/AdminNavbar.vue';

const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const roleFilter = ref('');
const selectedUser = ref(null);

const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (roleFilter.value) {
    filtered = filtered.filter(user => 
      user.role === roleFilter.value
    );
  }
  
  return filtered;
});

const adminCount = computed(() => {
  return users.value.filter(user => user.role === 'admin').length;
});

const loadUsers = async () => {
  try {
    users.value = await adminService.getUsers();
    loading.value = false;
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    loading.value = false;
  }
};

const deleteUser = async (userId) => {
  const user = users.value.find(u => u._id === userId);
  
  if (user.role === 'admin' && adminCount.value <= 1) {
    alert('Impossible de supprimer le dernier administrateur !');
    return;
  }

  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
    return;
  }

  try {
    await adminService.deleteUser(userId);
    loadUsers();
    showNotification('Utilisateur supprimé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showNotification('Erreur lors de la suppression');
  }
};

const viewUser = (user) => {
  selectedUser.value = user;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showNotification = (message) => {
  alert(message);
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-users {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  color: #2c3e50;
  margin: 0;
}

.admin-controls {
  display: flex;
  gap: 1rem;
}

.search-input,
.role-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.loading,
.no-users {
  padding: 3rem;
  text-align: center;
  color: #666;
}

/* Table */
.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e0e0e0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

tr:hover {
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details small {
  color: #666;
  font-size: 0.8rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1976d2;
}

.role-badge.admin {
  background: #fff3e0;
  color: #f57c00;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.view-btn {
  background: #3498db;
  color: white;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.view-btn:hover {
  background: #2980b9;
}

.delete-btn:hover:not(:disabled) {
  background: #c0392b;
}

/* Modal */
.user-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.modal-content p {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

.modal-content p strong {
  color: #2c3e50;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #eee;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-users {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .admin-controls {
    flex-direction: column;
  }
  
  .users-table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style> 