<template>
  <section class="auth-section">
    <div class="auth-container">
      <h1 class="auth-title">ANIPIA</h1>
      <p class="auth-subtitle">Sign in to your account.</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="auth-input-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="@" required autocomplete="username" />
        </div>

        <div class="auth-input-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required autocomplete="current-password" />
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>

        <div class="auth-input-group" style="display:inline; align-items:center; gap:0.5rem;">
          <input type="checkbox" id="remember-me" v-model="rememberMe" />
          <label for="remember-me" style="font-weight:500; cursor:pointer;">Remember me</label>
        </div>

        <button type="submit" class="button" style="margin-top:2rem;">Login</button>

        <div class="auth-divider" style="margin-top:3rem;"><span>or</span></div>

        <p class="auth-footer">
          Don't have an account?
          <router-link to="/signup">Sign up</router-link>
        </p>
      </form>
    </div>

    <!-- Toast notifikace -->
    <div v-if="toastMessage" :class="['toast', toastType, { show: showToastFlag }]">
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const passwordError = ref('');

// Toast
const toastMessage = ref('');
const toastType = ref('success'); // success / error
const showToastFlag = ref(false);

function showToast(message, type = 'success') {
  toastMessage.value = message;
  toastType.value = type;
  showToastFlag.value = true;

  setTimeout(() => {
    showToastFlag.value = false;
  }, 4000);
}

// Předvyplnění emailu po registraci
onMounted(() => {
  const prefillEmail = localStorage.getItem('prefillEmail');
  if (prefillEmail) {
    email.value = prefillEmail;
    localStorage.removeItem('prefillEmail');
  }
});

async function handleLogin() {
  passwordError.value = '';

  try {
    const response = await fetch('http://localhost:8080/api/zakaznici/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, heslo: password.value })
    });

    if (response.ok) {
      const data = await response.json();
      data.email = email.value;
      // Uložení podle rememberMe
      if (rememberMe.value) {
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        sessionStorage.setItem('user', JSON.stringify(data));
      }

      showToast(`Welcome back, ${data.jmeno} ${data.prijmeni}`, 'success');

      // Po chvilce přesměrujeme
      setTimeout(() => {
        router.push('/'); // nebo na homepage
      }, 2000);
    } else {
      showToast('Invalid email or password', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Login error', 'error');
  }
}
</script>

<style scoped>
@import '../assets/CSS/loginStyles.css';
.auth-section {
    background-color: rgba(60, 85, 45, 0.81);
    min-height: 100vh;
    padding: 7rem 2rem;
}
.error-message { color: #b43b18; font-size: 1.2rem; margin-top: 0.3rem; }
</style>
