import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Gallery from '../views/Gallery.vue';
import Prices from '../views/Prices.vue';
import Login from '../views/Login.vue';
import signup from '../views/SignUp.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/prices', name: 'Prices', component: Prices },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: signup },
  { path: '/profile', name: 'Profile', component: Profile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
