<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">📦 Gestion des Produits</h1>
          <button @click="showAddForm = true" class="btn-primary">
            + Ajouter un produit
          </button>
        </div>

        <!-- Filters -->
        <div class="card mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un produit..."
              class="input-field"
            />
            <select v-model="categoryFilter" class="input-field">
              <option value="">Toutes les catégories</option>
              <option value="electronique">Électronique</option>
              <option value="vetements">Vêtements</option>
              <option value="livres">Livres</option>
              <option value="maison">Maison</option>
              <option value="sport">Sport</option>
              <option value="beaute">Beauté</option>
              <option value="jouets">Jouets</option>
              <option value="alimentation">Alimentation</option>
              <option value="autres">Autres</option>
            </select>
          </div>
        </div>

        <!-- Products Table -->
        <div class="card">
          <div v-if="loading" class="text-center py-12">
            <p class="text-xl text-gray-600">Chargement des produits...</p>
          </div>
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-xl text-gray-600">Aucun produit trouvé.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in filteredProducts" :key="product._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img :src="product.image" :alt="product.name" class="h-12 w-12 object-cover rounded-lg" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ product.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ product.price }} MAD</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getCategoryName(product.category) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button @click="editProduct(product)" class="btn-secondary text-sm">
                      ✏️ Modifier
                    </button>
                    <button @click="deleteProduct(product._id)" class="btn-danger text-sm">
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal -->
        <div v-if="showAddForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-bold text-gray-900">
                {{ editingProduct ? 'Modifier le produit' : 'Ajouter un produit' }}
              </h3>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit:</label>
                <input v-model="formData.name" type="text" required class="input-field" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description:</label>
                <textarea v-model="formData.description" required class="input-field h-24"></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prix (MAD):</label>
                  <input v-model.number="formData.price" type="number" step="0.01" required class="input-field" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Stock:</label>
                  <input v-model.number="formData.stock" type="number" required class="input-field" />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie:</label>
                  <select v-model="formData.category" @change="onCategoryChange" class="input-field mb-2">
                    <option value="">Sélectionner une catégorie</option>
                    <option value="electronique">Électronique</option>
                    <option value="vetements">Vêtements</option>
                    <option value="livres">Livres</option>
                    <option value="maison">Maison</option>
                    <option value="sport">Sport</option>
                    <option value="beaute">Beauté</option>
                    <option value="jouets">Jouets</option>
                    <option value="alimentation">Alimentation</option>
                    <option value="autres">Autres</option>
                    <option value="personnalise">Autre catégorie...</option>
                  </select>
                  
                  <!-- Champ de saisie pour catégorie personnalisée -->
                  <div v-if="formData.category === 'personnalise'" class="mt-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la catégorie:</label>
                    <input 
                      v-model="customCategory" 
                      type="text" 
                      placeholder="Entrez le nom de la catégorie..."
                      class="input-field"
                      @input="updateCustomCategory"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Image du produit:</label>
                  
                  <!-- Prévisualisation de l'image -->
                  <div v-if="imagePreview || formData.image" class="mb-4">
                    <img 
                      :src="imagePreview || formData.image" 
                      alt="Preview" 
                      class="h-32 w-32 object-cover rounded-lg border border-gray-300" 
                    />
                  </div>
                  
                  <!-- Upload d'image -->
                  <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="handleImageUpload" 
                        accept="image/*" 
                        class="hidden"
                        ref="fileInput"
                      />
                      <button 
                        type="button"
                        @click="$refs.fileInput.click()"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Uploader une image locale
                      </button>
                      <span v-if="uploading" class="text-sm text-blue-600">Upload en cours...</span>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL de l'image:</label>
                    <input 
                      v-model="formData.image" 
                      type="url" 
                      placeholder="L'URL sera remplie automatiquement après upload..." 
                      class="input-field" 
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex gap-4">
                <button type="button" @click="closeForm" class="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" class="btn-primary flex-1">
                  {{ editingProduct ? 'Modifier' : 'Ajouter' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { productService } from '@/services/api.js';
import AdminNavbar from '@/components/AdminNavbar.vue';

const products = ref([]);
const loading = ref(true);
const showAddForm = ref(false);
const editingProduct = ref(null);
const searchQuery = ref('');
const categoryFilter = ref('');
const imagePreview = ref('');
const uploading = ref(false);
const customCategory = ref('');

const formData = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  image: ''
});

const getCategoryName = (category) => {
  const categories = {
    'electronique': 'Électronique',
    'vetements': 'Vêtements',
    'livres': 'Livres',
    'maison': 'Maison',
    'sport': 'Sport',
    'beaute': 'Beauté',
    'jouets': 'Jouets',
    'alimentation': 'Alimentation',
    'autres': 'Autres'
  };
  
  // Si c'est une catégorie prédéfinie, retourner le nom français
  if (categories[category]) {
    return categories[category];
  }
  
  // Si c'est une catégorie personnalisée, capitaliser la première lettre
  if (category && category !== 'personnalise') {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  return category;
};

const filteredProducts = computed(() => {
  let filtered = products.value;
  
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(product => 
      product.category === categoryFilter.value
    );
  }
  
  return filtered;
});

const loadProducts = async () => {
  try {
    products.value = await productService.getAll();
    loading.value = false;
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!formData.value.image && !imagePreview.value) {
      showNotification('Veuillez ajouter une image au produit');
      return;
    }
    
    if (editingProduct.value) {
      await productService.update(editingProduct.value._id, formData.value);
    } else {
      await productService.create(formData.value);
    }
    
    closeForm();
    loadProducts();
    showNotification('Produit ' + (editingProduct.value ? 'modifié' : 'ajouté') + ' avec succès !');
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('Erreur lors de l\'opération');
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = { ...product };
  showAddForm.value = true;
};

const deleteProduct = async (productId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    return;
  }

  try {
    await productService.delete(productId);
    loadProducts();
    showNotification('Produit supprimé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showNotification('Erreur lors de la suppression');
  }
};

const closeForm = () => {
  showAddForm.value = false;
  editingProduct.value = null;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  };
  imagePreview.value = '';
  uploading.value = false;
  customCategory.value = '';
  
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = '';
  }
};

const onCategoryChange = () => {
  if (formData.value.category !== 'personnalise') {
    customCategory.value = '';
  }
};

const updateCustomCategory = () => {
  if (customCategory.value.trim()) {
    formData.value.category = customCategory.value.trim().toLowerCase();
  }
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    showNotification('Veuillez sélectionner une image valide');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    showNotification('L\'image doit faire moins de 5MB');
    return;
  }
  
  // Prévisualisation
  imagePreview.value = URL.createObjectURL(file);
  uploading.value = true;
  
  // Upload vers le serveur
  const uploadFormData = new FormData();
  uploadFormData.append('image', file);
  
  try {
    const response = await fetch('http://localhost:5000/api/products/upload-image', {
      method: 'POST',
      body: uploadFormData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'upload');
    }
    
    const data = await response.json();
    formData.value.image = data.imageUrl;
    uploading.value = false;
    showNotification('Image uploadée avec succès !');
  } catch (error) {
    console.error('Erreur upload:', error);
    uploading.value = false;
    imagePreview.value = '';
    showNotification('Erreur lors de l\'upload de l\'image: ' + error.message);
  }
};

const showNotification = (message) => {
  alert(message);
};

onMounted(() => {
  loadProducts();
});
</script>