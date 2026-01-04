<template>
  <header class="header">
    <div class="wrapper">
      <nav class="navbar">
        <router-link to="/" class="nav-logo">Anipia</router-link>
        <ul :class="['nav-menu', { active: menuOpen }]">
          <li class="nav-item"><router-link to="/">Home</router-link></li>
          <li class="nav-item"><router-link to="/about">About</router-link></li>
          <li class="nav-item"><router-link to="/gallery">Gallery</router-link></li>
          <li class="nav-item"><router-link to="/prices">Prices</router-link></li>

          <!-- Dynamický auth odkaz -->
          <li class="nav-item">
            <!-- Pokud uživatel není přihlášen → Login -->
            <router-link
              v-if="!user"
              to="/login"
              class="nav-button"
            >
              Login
            </router-link>

            <!-- Pokud je přihlášen a není na /profile → My Profile -->
            <router-link
              v-else-if="user && route.path !== '/profile'"
              to="/profile"
              class="nav-button"
            >
              My Profile
            </router-link>

            <!-- Pokud je přihlášen a je na /profile → Logout -->
            <a
              v-else
              href="#"
              class="nav-button"
              @click.prevent="logout"
            >
              Logout
            </a>
          </li>
        </ul>

        <div class="hamburger" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </nav>
    </div>

    <!-- Toast notifikace -->
    <div v-if="toastMessage" :class="['toast', toastType, { show: showToastFlag }]">
      {{ toastMessage }}
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);
const user = ref(JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')));

// Toast
const toastMessage = ref('');
const toastType = ref('success');
const showToastFlag = ref(false);

function showToast(message, type = 'success') {
  toastMessage.value = message;
  toastType.value = type;
  showToastFlag.value = true;

  setTimeout(() => {
    showToastFlag.value = false;
  }, 2000);
}

const toggleMenu = () => menuOpen.value = !menuOpen.value;

const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  user.value = null;

  showToast('You have been logged out', 'success');

  setTimeout(() => {
    router.push('/');
  }, 1500);
};

// Reaktivní aktualizace user při přihlášení z jiné stránky
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
  if (storedUser) user.value = storedUser;
});

// Sleduj změny v localStorage/sessionStorage
window.addEventListener('storage', () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
  user.value = storedUser;
});
</script>

<style scoped>

.toast.error { background-color: #dc3545; }
.toast.success { background-color: #3C552D; }
</style>
