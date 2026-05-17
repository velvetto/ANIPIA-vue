<template>
  <div class="wrapper">
    <main class="profile-section">
      <div class="profile-container">

        <div class="profile-left">
          <h2>Welcome back, {{ user?.jmeno }}!</h2>
          <div id="calendar">
            <div class="calendar-header">
              <button @click="prevMonth">&lt;</button>
              <span class="calendar-title">{{ monthName }} {{ currentYear }}</span>
              <button @click="nextMonth">&gt;</button>
            </div>
            <div class="calendar-weekdays">
              <div v-for="day in weekdays" :key="day">{{ day }}</div>
            </div>
            <div class="calendar-days">
              <div 
                v-for="day in calendarDays" 
                :key="day.date" 
                :class="[day.classes, { 'admin-disabled': isAdmin }]"
                @click="!isAdmin && selectDay(day)"
              >
                {{ day.number }}
              </div>
            </div>
          </div>
          <button v-if="!isAdmin" class="button modal-button" style="margin-top:20px;" @click="openRoomModal">Make Reservation</button>
        </div>

        <div class="profile-right">

          <!-- USER -->
          <div v-if="!isAdmin">
            <h2>My pets</h2>

            <div id="pets-list">
              <div class="pet-card pet-add-card" @click="openPetModal()">+</div>

              <div v-for="pet in pets" :key="pet.idZvirata" class="pet-card">
                <div class="pet-image">
                  <img
                    :src="pet.imageUrl || '/Photos/default_pet.png'"
                    alt="Pet"
                    class="pet-img"
                    @click.stop="selectImage(pet)"
                  >

                  <input
                    type="file"
                    ref="fileInputs"
                    style="display:none"
                    @change="uploadImage($event, pet)"
                  >
                </div>

                <div class="pet-info" @click="editPet(pet)">
                  <span
                    class="pet-delete"
                    title="Delete Pet"
                    @click.stop="confirmDeletePet(pet)"
                  >
                    &times;
                  </span>

                  <p><strong>Name:</strong> {{ pet.jmeno }}</p>
                  <p><strong>Type:</strong> {{ pet.druh }}</p>
                  <p><strong>Breed:</strong> {{ pet.plemeno }}</p>
                  <p><strong>Age:</strong> {{ pet.vek }}</p>
                  <p><strong>Health:</strong> {{ pet.zdravotniStav }}</p>
                  <p><strong>Note:</strong> {{ shortNote(pet.poznamka) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ADMIN -->
          <div v-else>
            <h2>Reservations Info</h2>

            <div class="admin-reservations-list">
              <div
                v-for="res in allReservations"
                :key="res.id"
                class="admin-reservation"
                @click="openReservationDetail(res)"
              >
                <p><strong>Customer:</strong> {{ getCustomerName(res) }}</p>
                <p><strong>Pet:</strong> {{ res.petName }}</p>
                <p><strong>Date:</strong> {{ formatDate(res.datumOd) }} - {{ formatDate(res.datumDo) }}</p>
                <p><strong>Price:</strong> ${{ res.celkovaCena }}</p>

                <button @click.stop="openCancelReservation(res)">
                  Cancel reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isAdmin" id="notifications" class="notifications">
          <h2>Notifications | Reservations</h2>

          <div
            v-for="note in notifications"
            :key="note.id"
          >
            {{ note.text }}
          </div>
        </div>

        <div v-if="isAdmin" class="notifications">

          <h2>Hotel Overview</h2>

          <div class="admin-stats">

            <div class="admin-card">
              <h3>Total Reservations</h3>
              <p>{{ allReservations.length }}</p>
            </div>

            <div class="admin-card">
              <h3>Active Reservations</h3>
              <p>
                {{
                  allReservations.filter(r => {
                    const now = new Date()

                    return new Date(r.datumOd) <= now &&
                          new Date(r.datumDo) >= now
                  }).length
                }}
              </p>
            </div>

            <div class="admin-card">
              <h3>Total Revenue</h3>
              <p>
                ${{
                  allReservations.reduce((sum, r) =>
                    sum + r.celkovaCena, 0
                  )
                }}
              </p>
            </div>
          </div>

          <div class="admin-card" style="margin-top:2rem;">

            <h3>Upcoming Reservations</h3>

            <div
              v-for="res in allReservations
                .filter(r => new Date(r.datumOd) > new Date())
                .slice(0,5)"
              :key="res.id"
              style="margin-top:1rem;"
            >
              <strong>Customer:</strong> {{ res.customerName }}
              |
              <strong>Date:</strong> {{ formatDate(res.datumOd) }}
            </div>
          </div>
        </div>
    </main>

    <div v-if="showPetModal" class="modal" @click.self="closePetModal">
      <div class="modal-content">
        <span class="close" @click="closePetModal">&times;</span>
        <h3 class="modal-title">{{ editingPet ? 'Edit Pet Details' : 'Add New Pet' }}</h3>
        <form @submit.prevent="savePet" class="modal-form">
          <div class="modal-input-group">
            <label>Name</label>
            <input type="text" v-model="petForm.jmeno" required>
          </div>
          <div class="modal-input-group">
            <label>Type</label>
            <select v-model="petForm.druh" required>
              <option value="">Select type</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Small Rodent</option>
            </select>
          </div>
          <div class="modal-input-group">
            <label>Breed</label>
            <input type="text" v-model="petForm.plemeno">
          </div>
          <div class="modal-input-group">
            <label>Age</label>
            <input type="number" min="0" v-model.number="petForm.vek">
          </div>
          <div class="modal-input-group">
            <label>Health</label>
            <input type="text" v-model="petForm.zdravotniStav">
          </div>
          <div class="modal-input-group">
            <label>Note</label>
            <textarea v-model="petForm.poznamka" maxlength="250" placeholder="..."></textarea>
          </div>
          <button type="submit" class="modal-button">{{ editingPet ? 'Update' : 'Add Pet' }}</button>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal" @click.self="showDeleteModal=false">
      <div class="modal-content" style="width:400px;text-align:center;">
        <span class="close" @click="showDeleteModal=false">&times;</span>
        <h3 style="color: #333;">Do you really want to delete this pet?</h3>
        <div style="margin-top:2rem;display:flex;justify-content:center;gap:1rem;">
          <button class="modal-button" style="background-color:#6b1d1d" @click="deletePet">Yes</button>
          <button class="modal-button" style="background-color:#888" @click="showDeleteModal=false">No</button>
        </div>
      </div>
    </div>

    <div v-if="showRoomModal" class="modal" @click.self="showRoomModal=false">
      <div class="modal-content" style="width:600px;">
        <span class="close" @click="showRoomModal=false">&times;</span>
        <h3>Room Reservation</h3>
        <div v-for="room in rooms" :key="room.id" class="room-card">
          <img :src="room.image" :alt="room.name">
          <div class="room-info">
            <p><strong>{{ room.name }}</strong></p>
            <p class="room-desc">{{ room.description }}</p>
            <p>Price: ${{ room.price }}</p>
            <label>Select pet:</label>
            <select v-model="room.selectedPetId">
  <option value=""> </option>
  <option 
    v-for="pet in filteredPetsForRoom(room)" 
    :key="pet.idZvirata" 
    :value="pet.idZvirata"
  >
    {{ pet.jmeno }}
  </option>
</select>
            <button class="reserve-room-btn" @click="reserveRoom(room)">Reserve</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="toast.visible"
      :class="['toast', toast.type, { show: toast.visible }]"
    >
      {{ toast.message }}
    </div>
  </div>

  <div v-if="showCancelReservationModal" class="modal" @click.self="showCancelReservationModal=false">
    <div class="modal-content" style="width:40rem;text-align:center;">

      <span class="close" @click="showCancelReservationModal=false">&times;</span>

      <h3>Cancel reservation</h3>

      <p style="color:#666; margin:1rem 0;">
        Write reason for cancellation:
      </p>

      <textarea
        v-model="cancelReason"
        placeholder="Reason..."
        style="width:100%; min-height:100px; padding:10px; border-radius:10px;"
      ></textarea>

      <div style="display:flex; gap:1rem; justify-content:center; margin-top:1.5rem;">
        <button class="modal-button" style="background:#6b1d1d" @click="confirmCancelReservation">
          Yes, cancel
        </button>

        <button class="modal-button" style="background:#888" @click="showCancelReservationModal=false">
          No
        </button>
      </div>

    </div>
  </div>

  <div v-if="showReservationDetail" class="modal" @click.self="showReservationDetail = false">
    <div class="reservation-detail-modal">

      <span
        class="close"
        @click="showReservationDetail = false"
      >
        &times;
      </span>

      <div class="reservation-header">
        <h2>Reservation Details</h2>

        <div class="reservation-badge">
          #{{ selectedReservation.id }}
        </div>
      </div>

      <div v-if="selectedReservation" class="reservation-body">
        <div class="detail-section">
          <h3>Customer</h3>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="label">Customer</span>
              <span class="value">
                {{ selectedReservation.customerName }}
              </span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>Pet</h3>

          <div class="detail-grid">

            <div class="detail-card">
              <span class="label">Name</span>
              <span class="value">
                {{ selectedReservation.petName }}
              </span>
            </div>

            <div class="detail-card">
              <span class="label">Type</span>
              <span class="value">
                {{ selectedReservation.petType }}
              </span>
            </div>

            <div class="detail-card">
              <span class="label">Breed</span>
              <span class="value">
                {{ selectedReservation.petBreed }}
              </span>
            </div>

            <div class="detail-card">
              <span class="label">Age</span>
              <span class="value">
                {{ selectedReservation.petAge }} y.o.
              </span>
            </div>

            <div class="detail-card full">
              <span class="label">Health</span>
              <span class="value">
                {{ selectedReservation.petHealth || 'No health info' }}
              </span>
            </div>

            <div class="detail-card full">
              <span class="label">Note</span>
              <span class="value">
                {{ selectedReservation.petNote || 'No note' }}
              </span>
            </div>

          </div>
        </div>

        <div class="detail-section">
          <h3>Reservation Information</h3>

          <div class="detail-grid">

            <div class="detail-card">
              <span class="label">From</span>
              <span class="value">
                {{ formatDate(selectedReservation.datumOd) }}
              </span>
            </div>

            <div class="detail-card">
              <span class="label">To</span>
              <span class="value">
                {{ formatDate(selectedReservation.datumDo) }}
              </span>
            </div>

            <div class="detail-card full total-price">
              <span class="label">Total Price</span>
              <span class="price">
                ${{ selectedReservation.celkovaCena }}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import profilePage from "../composables/profilePage.js";
export default profilePage;
</script>

<style scoped>
@import url("../assets/CSS/profileStyles.css");
</style>