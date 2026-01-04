<template>
  <div class="wrapper">
    <!-- MAIN PROFILE SECTION -->
    <main class="profile-section">
      <div class="profile-container">

        <!-- LEFT: Calendar & Reservation -->
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
                :class="day.classes"
                @click="selectDay(day)"
              >
                {{ day.number }}
              </div>
            </div>
          </div>
          <button class="button modal-button" style="margin-top:20px;" @click="openRoomModal">Make Reservation</button>
        </div>

        <!-- RIGHT: Pets -->
        <div class="profile-right">
          <h2>My pets</h2>
          <div id="pets-list">
            <div class="pet-card pet-add-card" @click="openPetModal()">+</div>
            <div v-for="pet in pets" :key="pet.idZvirata" class="pet-card">
              <div class="pet-image">
                <img :src="pet.imageUrl || '/Photos/default_pet.png'" alt="Pet" class="pet-img" @click.stop="selectImage(pet)">
                <input type="file" ref="fileInputs" style="display:none" @change="uploadImage($event, pet)">
              </div>
              <div class="pet-info" @click="editPet(pet)">
                <span class="pet-delete" title="Delete Pet" @click.stop="confirmDeletePet(pet)">&times;</span>
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

      </div>

      <!-- Notifications -->
      <div id="notifications" class="notifications">
        <h2>Notifications | Reservations</h2>
        <div v-for="note in notifications" :key="note.id">{{ note.text }}</div>
      </div>
    </main>

    <!-- PET MODAL -->
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

    <!-- DELETE PET MODAL -->
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

    <!-- ROOM MODAL -->
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

    <!-- TOAST NOTIFICATION -->
    <div v-if="toast.show" :class="['toast', toast.type]">{{ toast.message }}</div>

  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

export default {
  name: "ProfilePage",
  setup() {
        const user = ref(JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")));
        const pets = ref([]);
        const notifications = ref([]);
        const reservations = ref([]);

        const filteredPetsForRoom = (room) => {
      if (!room) return [];
      return pets.value.filter(pet => {
        if (!pet || !pet.druh) return false;
        const type = pet.druh.toLowerCase();
        if ((room.id === 1 || room.id === 2) && type === 'cat') return true;
        if ((room.id === 3 || room.id === 4) && type === 'dog') return true;
        return false;
      });
    };
    // PET MODAL
    const showPetModal = ref(false);
    const editingPet = ref(null);
    const petForm = reactive({
      jmeno: '',
      druh: '',
      plemeno: '',
      vek: null,
      zdravotniStav: '',
      poznamka: ''
    });

    // DELETE PET
    const showDeleteModal = ref(false);
    let petToDelete = null;

    // ROOM MODAL
    const showRoomModal = ref(false);
    const rooms = ref([
      {id:1,name:"Standard Room For Cats",price:50,image:"/Photos/catRoom1.jpg",description:"Cozy standard room designed specifically for cats. Includes daily fresh food, clean water, and a private litter box.", selectedPetId:null},
      {id:2,name:"Larger Room For Cats",price:60,image:"/Photos/catRoom2.gif",description:"Spacious suite suitable for multiple cats from the same household. Equipped with climbing structures, shelves, toys, and multiple resting spots. Fresh food and water are provided daily, and litter boxes are cleaned frequently.", selectedPetId:null},
      {id:3,name:"Standard Cage For Dogs",price:70,image:"/Photos/dogRoom1.webp",description:"Comfortable kennel designed for small to medium-sized dogs. The price includes daily feeding, fresh water, and regular outdoor walks.", selectedPetId:null},
      {id:4,name:"Larger Cage For Dogs",price:90,image:"/Photos/dogRoom2.jpg",description:"Larger, luxury room for dogs who need extra space and attention. In addition to fresh food, water, and daily walks, this package also includes basic training and interactive play sessions with our staff.", selectedPetId:null}
    ]);

    // CALENDAR
    const today = new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear = ref(today.getFullYear());
    const selectedDates = ref([]);
    const calendarDays = ref([]);
    const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const monthName = computed(()=> monthNames[currentMonth.value]);

    const toast = reactive({ show:false, message:'', type:'success' });

    // ------------ METHODS ------------

    const fetchPets = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/zvirata/by-user?zakaznikId=${user.value.idZakaznici}`);
    pets.value = res.data.map(p => ({
      ...p,
      // pokud je imageUrl, přidej serverovou doménu, jinak default obrázek
      imageUrl: p.imageUrl ? `http://localhost:8080${p.imageUrl}` : '/Photos/default_pet.png'
    }));
  } catch(e){ console.error(e); }
};

    const fetchReservations = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/rezervace/by-user?zakaznikId=${user.value.idZakaznici}`);
    reservations.value = res.data.map(r => {
      const start = new Date(r.datumOd);
      const end = new Date(r.datumDo);
      let dates = [];
      let current = new Date(start);
      while(current <= end){
        const d = new Date(current);
        d.setHours(0,0,0,0); // důležité pro přesné porovnání
        dates.push(d);
        current.setDate(current.getDate()+1);
      }
      return {...r, dates};
    });

    // Aktualizujeme kalendář, aby se zobrazily zarezervované dny
    generateCalendar();

  } catch(e){ console.error(e); }
};

    const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const fetchNotifications = async () => {
  await fetchReservations();
  notifications.value = reservations.value.map(r => {
    const pet = pets.value.find(p => p.idZvirata === r.petId);
    return { 
      id: r.id, 
      text: `${formatDate(r.datumOd)} - ${formatDate(r.datumDo)} | Pet: ${pet?.jmeno || 'Unknown'} | Total price: $${r.celkovaCena}` 
    };
  });
};

    const shortNote = (note) => {
      if(!note) return '';
      const words = note.split(' ');
      return words.slice(0,3).join(' ') + (words.length>3 ? ' ...' : '');
    };

    const openPetModal = () => { showPetModal.value = true; editingPet.value = null; Object.assign(petForm, { jmeno:'', druh:'', plemeno:'', vek:null, zdravotniStav:'', poznamka:'' }); };
    const closePetModal = () => showPetModal.value=false;

    const editPet = (pet) => {
      editingPet.value = pet;
      Object.assign(petForm, pet);
      showPetModal.value = true;
    };

    const savePet = async () => {
  try {
    if(editingPet.value){
      const res = await axios.put(`http://localhost:8080/api/zvirata/update/${editingPet.value.idZvirata}`, petForm);
      pets.value = pets.value.map(p => p.idZvirata === res.data.idZvirata ? {
        ...res.data,
        imageUrl: res.data.imageUrl ? `http://localhost:8080${res.data.imageUrl}` : '/Photos/default_pet.png'
      } : p);
    } else {
      const res = await axios.post(`http://localhost:8080/api/zvirata/add?zakaznikId=${user.value.idZakaznici}`, petForm);
      pets.value.push({
        ...res.data,
        imageUrl: res.data.imageUrl ? `http://localhost:8080${res.data.imageUrl}` : '/Photos/default_pet.png'
      });
    }
    closePetModal();
  } catch(e){ console.error(e); }
};
    const confirmDeletePet = (pet) => { petToDelete = pet; showDeleteModal.value = true; };
    const deletePet = async () => {
      try{
        await axios.delete(`http://localhost:8080/api/zvirata/delete/${petToDelete.idZvirata}`);
        pets.value = pets.value.filter(p=>p.idZvirata!==petToDelete.idZvirata);
        showDeleteModal.value=false;
      }catch(e){ console.error(e);}
    };

    const selectImage = (pet) => { const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=e=>uploadImage({target:e.target}, pet); input.click(); };
    const uploadImage = async (e, pet) => {
  const file = e.target.files[0];
  if(!file) return;
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`http://localhost:8080/api/zvirata/upload-image/${pet.idZvirata}`, formData);
    const idx = pets.value.findIndex(p=>p.idZvirata===pet.idZvirata);
    pets.value[idx] = {
      ...res.data,
      imageUrl: res.data.imageUrl ? `http://localhost:8080${res.data.imageUrl}` : '/Photos/default_pet.png'
    };
  } catch(err){ console.error(err); }
};
    // CALENDAR
    const selectedStart = ref(null);
const selectedEnd = ref(null);
    const generateCalendar = () => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const lastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const days = [];

  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);

  // prázdné dny na začátku měsíce
  for(let i=0; i<(firstDay+6)%7; i++) days.push({date:null, number:null, classes:'calendar-day empty'});

  for(let d=1; d<=lastDate; d++){
    const dateStr = `${currentYear.value}-${String(currentMonth.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayDate = new Date(dateStr);
    dayDate.setHours(0,0,0,0);
    let classes = 'calendar-day';

    if(d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()) {
      classes += ' today';
    }

    if(dayDate < todayDate){
      classes += ' past';
    }

    // vybrané dny
    if (selectedStart.value) {
      const startDate = new Date(selectedStart.value);
      const endDate = selectedEnd.value ? new Date(selectedEnd.value) : startDate;
      startDate.setHours(0,0,0,0);
      endDate.setHours(0,0,0,0);
      if(dayDate >= startDate && dayDate <= endDate){
        classes += ' selected';
      }
    }

    // již rezervované dny
    reservations.value.forEach(res => {
      res.dates.forEach(resDate => {
        const resDay = new Date(resDate);
        resDay.setHours(0,0,0,0);
        if(dayDate.getTime() === resDay.getTime()) {
          classes += ' reserved';
        }
      });
    });

    days.push({date: dateStr, number: d, classes});
  }

  calendarDays.value = days;
};

    const prevMonth = ()=>{ currentMonth.value--; if(currentMonth.value<0){currentMonth.value=11; currentYear.value--; } generateCalendar(); };
    const nextMonth = ()=>{ currentMonth.value++; if(currentMonth.value>11){currentMonth.value=0; currentYear.value++; } generateCalendar(); };

    const selectDay = (day) => {
  if (!day.date) return;

  const clickedDate = new Date(day.date);
  const todayDate = new Date();
  todayDate.setHours(0,0,0,0); // ignorujeme čas

  if (clickedDate < todayDate) return;

  if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
    selectedStart.value = day.date;
    selectedEnd.value = null;
  } else if (!selectedEnd.value) {
    const startDate = new Date(selectedStart.value);
    if (clickedDate < startDate) {
      selectedEnd.value = selectedStart.value;
      selectedStart.value = day.date;
    } else {
      selectedEnd.value = day.date;
    }
  }

  // Aktualizujeme selectedDates podle start a end
  selectedDates.value = [];
  if (selectedStart.value) {
    const start = new Date(selectedStart.value);
    const end = selectedEnd.value ? new Date(selectedEnd.value) : start;
    let current = new Date(start);
    while (current <= end) {
      const dStr = `${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,'0')}-${String(current.getDate()).padStart(2,'0')}`;
      selectedDates.value.push(dStr);
      current.setDate(current.getDate()+1);
    }
  }

  generateCalendar();
};

    const matchPetRoom = (pet, room) => {
  if(!pet || !pet.druh) return false;  // <-- ochrana proti undefined
  const type = pet.druh.toLowerCase();
  if((room.id===1||room.id===2) && type==='cat') return true;
  if((room.id===3||room.id===4) && type==='dog') return true;
  return false;
};

    const openRoomModal = () => showRoomModal.value=true;
    const reserveRoom = async (room) => {
  if(!room.selectedPetId) return alert("Select pet");
  if(selectedDates.value.length < 2) return alert("Select at least 2 days");

  // seřadíme pole podle data
  const sortedDates = selectedDates.value.sort((a,b)=> new Date(a) - new Date(b));

  const datumOd = sortedDates[0];
  const datumDo = sortedDates[sortedDates.length - 1];
  const days = sortedDates.length;

  const celkovaCena = room.price * days;

  try {
    await axios.post("http://localhost:8080/api/rezervace/add", {
      zakaznikId: user.value.idZakaznici,
      petId: room.selectedPetId,
      roomId: room.id,
      datumOd,
      datumDo,
      celkovaCena,
      poznamka: ""
    });

    toast.message = `Room ${room.name} reserved!`;
    toast.type = 'success';
    toast.show = true;
    setTimeout(() => toast.show = false, 2000);

    showRoomModal.value = false;
    await fetchReservations();
    await fetchNotifications();
  } catch(err) {
    console.error(err);
  }
};

    const logout = ()=>{
      localStorage.removeItem('user'); sessionStorage.removeItem('user'); window.location.href="/login";
    };

    onMounted(async ()=>{
      await fetchPets();
      await fetchReservations();
      await fetchNotifications();
      generateCalendar();
    });

    return { 
  user, pets, notifications, showPetModal, editingPet, petForm, showDeleteModal, showRoomModal, rooms, shortNote,
  openPetModal, closePetModal, editPet, savePet, confirmDeletePet, deletePet,
  selectImage, uploadImage, weekdays, monthName, currentYear, calendarDays, prevMonth, nextMonth, selectDay,
  matchPetRoom, openRoomModal, reserveRoom, toast, logout,filteredPetsForRoom};
  }
}
</script>

<style scoped>
@import url("../assets/CSS/profileStyles.css");
</style>
