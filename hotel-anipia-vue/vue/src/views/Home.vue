<template>
  <div>
    <main class="mainPage">
      <!-- Hlavní obrázek + info -->
      <div class="main-image">
        <div class="main-image-wrapper wrapper">
          <div class="main-image-content">
            <div class="main-image-info">
              <h1 class="main-image-title">Hotel Anipia</h1>
              <p class="main-image-subtitle">Love and Care When You’re Not There.</p>
              <div class="main-image-text">
                <p>
                  We understand that your pets are more than just animals—they’re family. Our state-of-the-art facility offers a safe,
                  comfortable, and fun environment for your furry friends while you’re away. Whether it’s for a day, a week, or longer,
                  our team provides personalized care to ensure your pets feel right at home.
                </p>
              </div>
              <router-link to="/about" class="main-image-button button">Read more</router-link>
            </div>
            <div class="main-image-image">
              <img :src="mainImage" alt="Main Image" />
            </div>
          </div>
        </div>
      </div>

      <!-- Price list -->
      <section class="price-list">
        <div class="wrapper">
          <h2 class="price-list-title">Our Price List</h2>
          <div class="price-list-items">
            <PriceItem
              v-for="(item, index) in prices"
              :key="index"
              :title="item.title"
              :price="item.price"
              :img="item.img"
            />
          </div>
        </div>
      </section>

      <!-- Rules section -->
      <section class="rules-section">
        <div class="wrapper">
          <div class="rules-content">
            <div class="rules-text">
              <h2 class="rules-title">Rules</h2>
              <ul class="rules-list">
                <li v-for="(rule, index) in rules" :key="index">{{ rule }}</li>
              </ul>
            </div>
            <div class="rules-image">
              <img :src="rulesImage" alt="Rules Image" />
            </div>
          </div>
        </div>
      </section>

      <!-- Services section -->
      <section class="services-section">
        <div class="wrapper">
          <h2 class="services-title">Services</h2>
          <p class="services-description">
            Our hotel offers a wide range of services for animals, including grooming, walking, and special exercises.
          </p>
          <div class="services-grid">
            <ServiceItem
              v-for="(service, index) in services"
              :key="index"
              :title="service.title"
              :desc="service.desc"
              :img="service.img"
            />
          </div>
        </div>
      </section>

      <!-- Modální okna pro mazlíčky 
      <div v-for="(pet, index) in pets" :key="index">
        <div v-if="pet.modalOpen" class="modal" @click.self="closeModal(index)">
          <div class="modal-content">
            <span class="close" @click="closeModal(index)">&times;</span>
            <h3>{{ pet.name }}</h3>
            <img :src="pet.img" :alt="pet.name" />
            <p>{{ pet.desc }}</p>
          </div>
        </div>
      </div> -->

      <!-- Toast hláška -->
      <Toast v-if="toast.visible" :message="toast.message" :type="toast.type" />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMain } from '../composables/useMain.js'

import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import PriceItem from '../components/PriceItem.vue'
import ServiceItem from '../components/ServiceItem.vue'
import Toast from '../components/Toast.vue'

import mainImage from '../assets/Photos/mainImage.png'
import smallDog from '../assets/Photos/smallDog.png'
import bigDog from '../assets/Photos/bigDog.png'
import cat from '../assets/Photos/cat.png'
import rodent from '../assets/Photos/rodent.png'
import grooming from '../assets/Photos/grooming.jpg'
import walking from '../assets/Photos/walking.png'
import exercise from '../assets/Photos/exercise.png'
import feeding from '../assets/Photos/feeding.webp'
import vet from '../assets/Photos/veterinary.webp'
import play from '../assets/Photos/play.webp'
import rulesImage from '../assets/Photos/rulesImage.png'

// --- Composable ---
const {
  isMenuActive,
  toggleMenu,
  closeMenu,
  name,
  email,
  message,
  toast,
  submitForm,
  user,
  logout
} = useMain()

// --- Home data ---
const mainImageSrc = mainImage

const prices = reactive([
  { title: 'Small Dogs', price: '$15 / Night', img: smallDog },
  { title: 'Large Dogs', price: '$25 / Night', img: bigDog },
  { title: 'Cats', price: '$10 / Night', img: cat },
  { title: 'Rodents', price: '$5 / Night', img: rodent }
])

const rules = [
  'All animals must have up-to-date vaccinations.',
  'Pets should be brought in clean and healthy condition.',
  'Owners must provide specific feeding instructions.',
  'Any health issues should be communicated in advance.',
  'Accommodation is based on the size and nature of the pet.'
]

const services = [
  { title: 'Grooming', desc: 'This includes activities like bathing, hair care, nail trimming, and skincare.', img: grooming },
  { title: 'Walking', desc: 'This activity helps maintain the pet’s physical health and provides mental stimulation.', img: walking },
  { title: 'Exercise', desc: 'Regular exercise is crucial for a pet’s overall well-being and happiness.', img: exercise },
  { title: 'Feeding', desc: 'Our hotel offers personalized plans to ensure your pet gets the right diet for their health.', img: feeding },
  { title: 'Veterinary Care', desc: 'Regular check-ups, preventive care, and immediate medical attention if needed.', img: vet },
  { title: 'Playtime', desc: 'Activities that stimulate your pets mind and keep them entertained throughout their stay.', img: play }
]

const pets = reactive([
  { name: 'Small Dog', img: smallDog, desc: 'Small dog description', modalOpen: false },
  { name: 'Large Dog', img: bigDog, desc: 'Large dog description', modalOpen: false },
  { name: 'Cat', img: cat, desc: 'Cat description', modalOpen: false },
  { name: 'Rodent', img: rodent, desc: 'Rodent description', modalOpen: false }
])

// --- Modals & toast ---
const openModal = (index) => { pets[index].modalOpen = true }
const closeModal = (index) => { pets[index].modalOpen = false }

</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.6);
  justify-content: center; align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
}
.close {
  position: absolute;
  top: 10px; right: 20px;
  font-size: 24px;
  cursor: pointer;
}
</style>
