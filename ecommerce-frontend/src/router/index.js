import { createRouter, createWebHistory } from 'vue-router';

// Importation des vues
import Home from '@/views/Home.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Cart from '@/views/Cart.vue';
import Categories from '@/views/Categories.vue';
import Search from '@/views/Search.vue';
import AdminDashboard from '@/views/AdminViews/AdminDashboard.vue';
import AdminProducts from '@/views/AdminViews/AdminProducts.vue';
import AdminUsers from '@/views/AdminViews/AdminUsers.vue';
import Profile from '@/views/Profile.vue';
import AdminOrders from '@/views/AdminViews/AdminOrders.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
