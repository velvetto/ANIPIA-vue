<template>
  <main class="main-gallery">
    <!-- Intro -->
    <section class="host">
      <h2>Our Guests</h2>
      <p>
        We are delighted to host a variety of beloved pets, including cats, dogs, and small rodents.
        Below, you’ll find some adorable photos of our guests enjoying their stay with us. We take
        pride in offering a safe and loving environment for all pets, ensuring they have a wonderful
        time while their owners are away.
      </p>
    </section>

    <!-- Galleries -->
    <section
      v-for="(section, index) in galleries"
      :key="index"
      class="gallery"
    >
      <div class="wrapper-gallery">
        <h2 class="gallery-title">{{ section.title }}</h2>
        <hr />

        <div class="gallery-grid">
          <div
            v-for="(item, i) in section.items"
            :key="i"
            class="gallery-image"
          >
            <img :src="item.img" :alt="item.name" />
            <div class="overlay">
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <a href="#" class="button">
          <p>View more</p>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup>
import '../assets/CSS/galleryStyles.css'

// ---- Cats ----
import cat1 from '../assets/Photos/Gallery/cat1.jpg'
import cat2 from '../assets/Photos/Gallery/cat2.jpg'
import cat3 from '../assets/Photos/Gallery/cat3.jpg'
import cat4 from '../assets/Photos/Gallery/cat4.jpg'
import cat5 from '../assets/Photos/Gallery/cat5.webp'
import cat6 from '../assets/Photos/Gallery/cat6.jfif'

// ---- Dogs ----
import dog1 from '../assets/Photos/Gallery/dog1.jpg'
import dog2 from '../assets/Photos/Gallery/dog2.webp'
import dog3 from '../assets/Photos/Gallery/dog3.jpg'
import dog4 from '../assets/Photos/Gallery/dog4.jpg'
import dog5 from '../assets/Photos/Gallery/dog5.webp'
import dog6 from '../assets/Photos/Gallery/dog6.webp'

// ---- Rodents ----
import rodent1 from '../assets/Photos/Gallery/rodents1.jpg'
import rodent2 from '../assets/Photos/Gallery/rodents2.jpg'
import rodent3 from '../assets/Photos/Gallery/rodents3.webp'
import rodent4 from '../assets/Photos/Gallery/rodents4.jpg'
import rodent5 from '../assets/Photos/Gallery/rodents5.jpg'
import rodent6 from '../assets/Photos/Gallery/rodents6.webp'

// ---- Data ----
const galleries = [
  {
    title: 'Cats',
    items: [
      { name: 'Simba', img: cat1 },
      { name: 'Oliver', img: cat3 },
      { name: 'Leo', img: cat2 },
      { name: 'Nala', img: cat4 },
      { name: 'Cleo', img: cat5 },
      { name: 'Milo', img: cat6 }
    ]
  },
  {
    title: 'Dogs',
    items: [
      { name: 'Max', img: dog1 },
      { name: 'Buddy', img: dog2 },
      { name: 'Molly', img: dog3 },
      { name: 'Bear', img: dog4 },
      { name: 'Bella', img: dog5 },
      { name: 'Duke', img: dog6 }
    ]
  },
  {
    title: 'Rodents',
    items: [
      { name: 'Ember & Copper', img: rodent1 },
      { name: 'Ruby', img: rodent2 },
      { name: 'Rose', img: rodent3 },
      { name: 'Max', img: rodent4 },
      { name: 'Poppy', img: rodent5 },
      { name: 'Coral', img: rodent6 }
    ]
  }
]
</script>
