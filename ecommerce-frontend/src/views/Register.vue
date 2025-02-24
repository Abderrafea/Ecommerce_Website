<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="card">
        <!-- Logo -->
        <div class="text-center">
          <img src="../assets/e-commerce.png" alt="Logo" class="mx-auto h-20 w-auto mb-6" />
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Créer un compte</h2>
        </div>
        
        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <CustomInput 
              v-model="name" 
              label="Nom complet" 
              placeholder="Entrez votre nom"
              class="input-field"
            />
          </div>
          
          <div>
            <CustomInput 
              v-model="email" 
              label="Email" 
              type="email" 
              placeholder="exemple@email.com"
              class="input-field"
            />
          </div>
          
          <div>
            <CustomInput 
              v-model="password" 
              label="Mot de passe" 
              type="password" 
              placeholder="******"
              class="input-field"
            />
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>
          
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {{ success }}
          </div>
          
          <button type="submit" class="btn-primary w-full">
            Créer mon compte
          </button>
        </form>
        
        <!-- Liens -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Vous avez déjà un compte ? 
            <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-semibold">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomInput from '@/components/CustomInput.vue';
import { authService } from '@/services/api.js';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  try {
    const res = await authService.register({
      name: name.value,
      email: email.value,
      password: password.value
    });

    // Sauvegarder le token et les données utilisateur
    const token = res.token;
    localStorage.setItem('token', token);
    
    // Décoder le token pour obtenir les infos utilisateur
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userData = {
      id: payload.id,
      name: name.value,
      email: email.value,
      role: payload.role || 'user'
    };
    localStorage.setItem('user', JSON.stringify(userData));

    success.value = res.message;
    error.value = '';
    name.value = email.value = password.value = '';
    
    setTimeout(() => {
      router.push('/');
      window.location.reload();
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur inconnue';
    success.value = '';
  }
};
</script>

