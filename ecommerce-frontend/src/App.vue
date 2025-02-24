<template>
  <div id="app" class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased flex flex-col">
    <Navbar />
    
    <main class="flex-grow">
      <router-view />
    </main>

    <Footer />

    <!-- Notification de succès -->
    <div 
      v-if="showNotification" 
      class="fixed top-24 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-medium z-50 max-w-sm animate-slide-in"
    >
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { isTokenValid } from '@/utils/auth.js';

const router = useRouter();
const route = useRoute();

const showNotification = ref(false);
const notificationMessage = ref('');

const showNotificationMessage = (message) => {
  notificationMessage.value = message;
  showNotification.value = true;
  
  // Masquer la notification après 3 secondes
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

onMounted(() => {
  // Vérification du token expiré au chargement de l'app
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (route.path !== '/login') {
      router.push('/login');
    }
  }
});

// Exposer la fonction pour qu'elle soit accessible globalement
defineExpose({
  showNotificationMessage
});
</script>

<style>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>