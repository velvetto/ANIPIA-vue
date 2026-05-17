<template>
  <Header v-if="showHeaderFooter" />
  <router-view />
  <Footer v-if="showHeaderFooter" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

const showHeaderFooter = computed(() => {
  return !['/login', '/signup'].includes(route.path)
})
</script>

<style>
@import './assets/CSS/styles.css';
</style>
