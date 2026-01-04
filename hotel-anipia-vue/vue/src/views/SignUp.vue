<template>
  <section class="auth-section">
    <div class="auth-container">
      <h1 class="auth-title">ANIPIA</h1>
      <p class="auth-subtitle">Welcome to our hotel. Sign up to create reservations.</p>

      <form @submit.prevent="handleSignUp" class="auth-form">
        <div class="auth-name-row">
          <div class="auth-input-group">
            <label for="firstName">First name</label>
            <input v-model="firstName" type="text" id="firstName" required />
          </div>
          <div class="auth-input-group">
            <label for="lastName">Last name</label>
            <input v-model="lastName" type="text" id="lastName" required />
          </div>
        </div>

        <div class="auth-input-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="@" required />
        </div>

        <div class="auth-input-group">
          <label for="telefon">Telephone</label>
          <input v-model="telefon" type="tel" id="telefon" placeholder="+420" pattern="[0-9]{9}" maxlength="9" inputmode="numeric" required />
        </div>

        <div class="auth-input-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required autocomplete="new-password" />
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>

        <div class="auth-input-group">
          <label for="confirmPassword">Confirm password</label>
          <input v-model="confirmPassword" type="password" id="confirmPassword" required autocomplete="new-password" />
        </div>

        <button type="submit" class="button">Sign Up</button>

        <p class="auth-agreement">
          By creating an account, you agree to our
          <a href="#">Terms of Service</a> and
          <a href="#">Privacy & Cookie Statement</a>.
        </p>

        <div class="auth-divider"><span>or</span></div>

        <p class="auth-footer">
          Already have an account?
          <router-link to="/login">Login now</router-link>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const telefon = ref('');
const password = ref('');
const confirmPassword = ref('');
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

async function handleSignUp() {
  passwordError.value = '';

  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/zakaznici/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jmeno: firstName.value,
        prijmeni: lastName.value,
        telefon: telefon.value,
        email: email.value,
        heslo: password.value
      })
    });

    if (response.ok) {
      showToast('Your registration is completed. Please log in', 'success');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const text = await response.text();
      if (text.includes('Email')) {
        showToast('User with such an email already exists', 'error');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        showToast('Registration failed', 'error');
      }
    }
  } catch (err) {
    console.error(err);
    showToast('Server error', 'error');
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