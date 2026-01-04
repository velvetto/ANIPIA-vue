<template>
  <main class="price-list-section">
    
      <h2 class="price-list-tit">Our Price List</h2>
      <div class="price-list-container">
        <!-- Cena 1 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="grooming" alt="Service 1">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Heated Hydrobath</h2>
            <p class="price-item-description">
              Our team is trained to handle dogs of all sizes and temperaments, ensuring a safe and enjoyable experience.
              The warm water and massage can help alleviate muscle tension and improve overall well-being.
              We tailor the bath to your dog's specific needs, ensuring they receive the best possible care.
              We create a calm and soothing atmosphere to make the bathing process as pleasant as possible.
            </p>
            <p class="price-item-price">$20</p>
          </div>
        </div>

        <!-- Cena 2 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="haircut" alt="Service 2">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Full Body Haircut</h2>
            <p class="price-item-description">
              Give your furry friend a fresh, stylish look with our Full Body Haircut service at Pampered Paws.
              Our expert groomers are dedicated to providing a comfortable and enjoyable grooming experience, ensuring
              your dog looks and feels their best. We take the time to understand your dog's specific needs and
              preferences, providing a customized grooming session.
            </p>
            <p class="price-item-price">$80</p>
          </div>
        </div>

        <!-- Cena 3 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="nailClipping" alt="Service 3">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Nail Clipping</h2>
            <p class="price-item-description">
              Regular nail maintenance is essential for your dog's overall well-being, and our experienced groomers ensure a safe
              and stress-free experience. Regular nail clipping prevents overgrown nails, which can cause pain and lead to other
              health issues. Your dog's comfort and safety are our top priorities. We create a calm and soothing environment to
              make the grooming process enjoyable.
            </p>
            <p class="price-item-price">$15</p>
          </div>
        </div>

        <!-- Cena 4 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="toothBrush" alt="Service 4">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Tooth Brushing</h2>
            <p class="price-item-description">
              Dental care is crucial for preventing plaque buildup, bad breath, and other oral health issues.
              Our gentle and effective tooth brushing service will keep your pet's teeth clean and their breath fresh.
              It promotes overall health by preventing oral infections and other related health issues.
            </p>
            <p class="price-item-price">$10</p>
          </div>
        </div>

        <!-- Cena 5 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="inspection" alt="Service 5">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Inspection</h2>
            <p class="price-item-description">
              Health checks are essential for early detection of potential issues and maintaining your pet's overall health.
              Our experienced team provides a detailed inspection to keep your furry friend in top condition.
              A comprehensive examination of your pet's body, including skin, coat, eyes, ears, teeth, and paws,
              to identify any signs of health concerns.
            </p>
            <p class="price-item-price">$12</p>
          </div>
        </div>

        <!-- Cena 6 -->
        <div class="price-item">
          <div class="price-item-image">
            <img :src="earCleaning" alt="Service 6">
          </div>
          <div class="price-item-content">
            <h2 class="price-item-title">Ear Care</h2>
            <p class="price-item-description">
              Ear maintenance is crucial for preventing infections and ensuring your pet's comfort.
              Our experienced groomers provide gentle and thorough ear cleaning tailored to your pet's needs.
              Using pet-safe solutions, we carefully clean the ears to remove dirt, wax, and debris without causing irritation.
            </p>
            <p class="price-item-price">$30</p>
          </div>
        </div>

      </div>
    
  </main>
</template>

<script setup>
import '../assets/CSS/pricesStyles.css'

import grooming from '../assets/Photos/grooming.jpg'
import haircut from '../assets/Photos/Prices/haircut.jpg'
import nailClipping from '../assets/Photos/Prices/nailClipping.jpg'
import toothBrush from '../assets/Photos/Prices/toothBrush.jpeg'
import inspection from '../assets/Photos/Prices/inspection.jpg'
import earCleaning from '../assets/Photos/Prices/earCleaning.jpg'
</script>