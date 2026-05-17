<template>
  <div>
    <main>
      <section class="about-us">
        <div class="wrapper">
          <h2 class="about-us-title">What we do</h2>
          <p class="about-us-description">
            At Anipia, we are more than just a pet hotel. We are a second home for your furry family members, offering premium care, personalized attention,
            and an environment where pets can thrive while you're away. Our philosophy centers around ensuring that every pet in our care feels comfortable,
            safe, and enriched. Whether your pet is staying with us for a day or a longer period, we are dedicated to providing the best experience possible.
          </p>

          <div class="about-us-icons">
            <div v-for="(icon, index) in icons" :key="index" class="icon-item">
              <img :src="icon.img" :alt="icon.title" />
              <h3>{{ icon.title }}</h3>
              <p>{{ icon.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="our-team">
        <div class="wrapper">
        <h2 class="our-team-title">Our Caring Team</h2>

            <div class="team-grid">
            <div 
                v-for="(member, index) in team" 
                :key="index" 
                class="team-member"
            >
                <img :src="member.img" :alt="member.name" />

                <h3>{{ member.name }}</h3>
                <p>{{ member.role }}</p>

                <!-- Social icons -->
                <div class="icons">
                <a v-for="(icon, i) in member.icons" :key="i" :href="icon.link">
                    <img :src="icon.img" :alt="icon.alt" />
                </a>
                </div>
            </div>
            </div>
        </div>
       </section>

      <section class="contact-form-section">
  <div class="contact-form-container">
    <h2 class="contact-form-title">Contact Us</h2>

    <form class="contact-form" @submit.prevent="submitForm">
      <div class="form-row">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="form.name" type="text" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" placeholder="@"/>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group full-width">
          <label for="message">Message</label>
          <textarea id="message" v-model="form.message" placeholder="..."></textarea>
        </div>
      </div>

      <div class="form-row">
        <button id="formButton" type="submit">Submit</button>
      </div>
    </form>

    <div
      v-if="toast.visible"
      :class="['toast', toast.type, { show: toast.visible }]"
    >
      {{ toast.message }}
    </div>
  </div>
</section>

    </main>
  </div>
</template>

<script>
import '../assets/CSS/aboutStyles.css'
import { ref } from 'vue'
import { onMounted } from 'vue'


import hotel from '../assets/Photos/About/hotel.png'
import care from '../assets/Photos/About/care.png'
import playtime from '../assets/Photos/About/playtime.png'
import veterinary from '../assets/Photos/About/veterinary.png'
import staff from '../assets/Photos/About/staff.png'
import grooming from '../assets/Photos/About/grooming.png'

import facebook from '../assets/Photos/Icons/facebook.png'
import linkedin from '../assets/Photos/Icons/linkedin.png'
import whatsapp from '../assets/Photos/Icons/whatsapp.png'

import director from '../assets/Photos/About/director.webp'
import manager from '../assets/Photos/About/manager.jpg'
import vet from '../assets/Photos/About/veterinarian.webp'

export default {

  setup() {
      onMounted(() => {
        const storedUser =
          JSON.parse(localStorage.getItem('user')) ||
          JSON.parse(sessionStorage.getItem('user'))

        if (storedUser) {
          form.value.name = `${storedUser.jmeno} ${storedUser.prijmeni}`
          form.value.email = storedUser.email
        }
      })
    const icons = [
      {
        img: hotel,
        title: 'Comfortable Accommodations',
        desc: 'Your pets stay in spacious, clean, and cozy rooms with plenty of natural light, soft bedding, and climate-controlled environments to ensure they’re comfortable and happy.'
      },
      {
        img: care,
        title: 'Personalized Care',
        desc: 'We understand that each pet has unique needs. Our trained staff provides customized attention, including special diets, medical care, and personalized playtime routines.'
      },
      {
        img: playtime,
        title: 'Fun & Enrichment Activities',
        desc: 'Our daily schedule includes a variety of stimulating activities to keep your pet entertained and engaged, from play sessions to socialization opportunities, ensuring they get physical exercise.'
      },
      {
        img: veterinary,
        title: 'Veterinary Support',
        desc: 'Your pet’s health is our priority. We work closely with local veterinarians to provide any necessary medical care and can offer on-call vet services in case of emergency.'
      },
      {
        img: staff,
        title: '24/7 Supervision',
        desc: 'At Anipia, your pets are never alone. Our dedicated staff monitors your pets around the clock, ensuring they are always safe, secure, and well-cared for.'
      },
      {
        img: grooming,
        title: 'Grooming & Pampering',
        desc: 'We offer grooming services, including baths, nail trims, and fur brushing, so your pet returns home looking and feeling their best.'
      }
    ]

    const team = [
      {
        img: director,
        name: 'John Taylor',
        role: 'Director',
        icons: [
          { img: facebook, alt: 'Facebook', link: '#' },
          { img: linkedin, alt: 'LinkedIn', link: '#' },
          { img: whatsapp, alt: 'WhatsApp', link: '#' }
        ]
      },
      {
        img: manager,
        name: 'David Smith',
        role: 'Manager',
        icons: [
          { img: facebook, alt: 'Facebook', link: '#' },
          { img: linkedin, alt: 'LinkedIn', link: '#' },
          { img: whatsapp, alt: 'WhatsApp', link: '#' }
        ]
      },
      {
        img: vet,
        name: 'Jane Abrams',
        role: 'Chief Veterinarian',
        icons: [
          { img: facebook, alt: 'Facebook', link: '#' },
          { img: linkedin, alt: 'LinkedIn', link: '#' },
          { img: whatsapp, alt: 'WhatsApp', link: '#' }
        ]
      }
    ]

    const form = ref({
      name: '',
      email: '',
      message: ''
    })

    const toast = ref({
      visible: false,
      message: '',
      type: 'success'
    })

    const showToast = (message, type = 'success') => {
      toast.value.message = message
      toast.value.type = type
      toast.value.visible = true

      setTimeout(() => {
        toast.value.visible = false
      }, 4000)
    }

    const submitForm = async () => {
      if (!form.value.name || !form.value.email || !form.value.message) {
        showToast('Please fill in all fields', 'warning')
        return
      }

       showToast("Your message has been sent successfully", "success");
      fetch("http://localhost:8080/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form.value)
      }).catch(error => {
        console.error("Background error:", error);
      });

      form.value = {
        name: "",
        email: "",
        message: ""
      };
    };

    return {
      icons,
      team,
      form,
      toast,
      submitForm
    }
  }
}
</script>
