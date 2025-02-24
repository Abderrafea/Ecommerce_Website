<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="card">
        <div class="text-center">
          <img src="../assets/e-commerce.png" alt="Logo" class="mx-auto h-20 w-auto mb-6" />
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Connexion</h2>
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <CustomInput
              v-model="email"
              label="Email"
              type="email"
              placeholder="Entrez votre email"
              class="input-field"
            />
          </div>
          
          <div>
            <CustomInput
              v-model="password"
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              class="input-field"
            />
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>
          
          <button type="submit" class="btn-primary w-full">
            Se connecter
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Vous n'avez pas de compte ? 
            <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-semibold">
              Créer un compte
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from '@/components/CustomInput.vue';
import { authService } from '@/services/api.js';

const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  try {
    const res = await authService.login({
      email: email.value,
      password: password.value
    });

    const token = res.token;
    localStorage.setItem('token', token);
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userData = {
      id: payload.id,
      name: payload.name || 'Utilisateur',
      email: email.value,
      role: payload.role || 'user'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    window.location.href = '/';
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion';
  }
};
</script>

