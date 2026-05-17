import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

const ADMIN_EMAIL = "yefremova@gmail.com";
const API = "http://localhost:8080";

const mapPet = (p) => ({
  ...p,
  imageUrl: p.imageUrl ? `${API}${p.imageUrl}` : "/Photos/default_pet.png",
});

const buildDates = (r) => {
  const dates = [];
  const cur = new Date(r.datumOd);
  const end = new Date(r.datumDo);
  cur.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return { ...r, dates };
};

export default {
  name: "ProfilePage",
  setup() {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const user = ref(rawUser ? JSON.parse(rawUser) : null);
    const isAdmin = computed(() => user.value?.email === ADMIN_EMAIL);

    const pets          = ref([]);
    const notifications = ref([]);
    const reservations  = ref([]);
    const allReservations = ref([]);

    const toast = ref({ visible: false, message: "", type: "success" });
    const showPetModal              = ref(false);
    const showDeleteModal           = ref(false);
    const showRoomModal             = ref(false);
    const showCancelReservationModal = ref(false);
    const showReservationDetail     = ref(false);

    const editingPet          = ref(null);
    const selectedReservation = ref(null);
    const reservationToCancel = ref(null);
    const cancelReason        = ref("");
    let   petToDelete         = null;

    const petForm = reactive({ jmeno: "", druh: "", plemeno: "", vek: null, zdravotniStav: "", poznamka: "" });

    const rooms = ref([
      { id: 1, name: "Standard Room For Cats",  price: 50, image: "/Photos/catRoom1.jpg",  description: "Cozy standard room designed specifically for cats. Includes daily fresh food, clean water, and a private litter box.", selectedPetId: null },
      { id: 2, name: "Larger Room For Cats",     price: 60, image: "/Photos/catRoom2.gif",  description: "Spacious suite for multiple cats. Equipped with climbing structures, shelves, toys, and resting spots. Food, water and litter boxes refreshed daily.", selectedPetId: null },
      { id: 3, name: "Standard Cage For Dogs",   price: 70, image: "/Photos/dogRoom1.webp", description: "Comfortable kennel for small to medium dogs. Includes daily feeding, fresh water, and regular outdoor walks.", selectedPetId: null },
      { id: 4, name: "Larger Cage For Dogs",     price: 90, image: "/Photos/dogRoom2.jpg",  description: "Luxury room for dogs needing extra space. Includes food, water, daily walks, basic training and interactive play sessions.", selectedPetId: null },
    ]);

    // Calendar
    const today      = new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear  = ref(today.getFullYear());
    const selectedStart = ref(null);
    const selectedEnd   = ref(null);
    const selectedDates = ref([]);
    const calendarDays  = ref([]);
    const weekdays   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const monthName  = computed(() => monthNames[currentMonth.value]);

    // Toast
    const showToast = (message, type = "success") => {
      toast.value = { visible: true, message, type };
      setTimeout(() => { toast.value.visible = false; }, 4000);
    };

    const fetchPets = async () => {
      try {
        const res = await axios.get(`${API}/api/zvirata/by-user?zakaznikId=${user.value.idZakaznici}`);
        pets.value = res.data.map(mapPet);
      } catch (e) { console.error(e); }
    };

    const fetchReservations = async () => {
      try {
        const res = await axios.get(`${API}/api/rezervace/by-user?zakaznikId=${user.value.idZakaznici}`);
        reservations.value = res.data.map(buildDates);
        generateCalendar();
      } catch (e) { console.error(e); }
    };

    const fetchAllReservations = async () => {
      try {
        const res = await axios.get(`${API}/api/rezervace/all`);
        allReservations.value = res.data.map(buildDates);
        generateCalendar();
      } catch (e) { console.error(e); }
    };

    const fetchNotifications = async () => {
      await fetchReservations();
      notifications.value = reservations.value.map((r) => {
        const pet = pets.value.find((p) => p.idZvirata === r.petId);
        return {
          id: r.id,
          text: `${formatDate(r.datumOd)} – ${formatDate(r.datumDo)} | Pet: ${pet?.jmeno || "Unknown"} | Total: $${r.celkovaCena}`,
        };
      });
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;
    };

    const shortNote = (note) => {
      if (!note) return "";
      const w = note.split(" ");
      return w.slice(0, 3).join(" ") + (w.length > 3 ? " ..." : "");
    };

    const getCustomerName = (res) => res.customerName ?? "Unknown";

    const filteredPetsForRoom = (room) => {
      if (!room) return [];
      return pets.value.filter((p) => {
        const t = p?.druh?.toLowerCase();
        return ((room.id === 1 || room.id === 2) && t === "cat") ||
               ((room.id === 3 || room.id === 4) && t === "dog");
      });
    };

    const openPetModal = () => {
      editingPet.value = null;
      Object.assign(petForm, { jmeno: "", druh: "", plemeno: "", vek: null, zdravotniStav: "", poznamka: "" });
      showPetModal.value = true;
    };
    const closePetModal = () => { showPetModal.value = false; };

    const editPet = (pet) => { editingPet.value = pet; Object.assign(petForm, pet); showPetModal.value = true; };

    const savePet = async () => {
      try {
        if (editingPet.value) {
          const res = await axios.put(`${API}/api/zvirata/update/${editingPet.value.idZvirata}`, petForm);
          pets.value = pets.value.map((p) => p.idZvirata === res.data.idZvirata ? mapPet(res.data) : p);
        } else {
          const res = await axios.post(`${API}/api/zvirata/add?zakaznikId=${user.value.idZakaznici}`, petForm);
          pets.value.push(mapPet(res.data));
        }
        closePetModal();
      } catch (e) { console.error(e); }
    };

    const confirmDeletePet = (pet) => { petToDelete = pet; showDeleteModal.value = true; };
    const deletePet = async () => {
      try {
        await axios.delete(`${API}/api/zvirata/delete/${petToDelete.idZvirata}`);
        pets.value = pets.value.filter((p) => p.idZvirata !== petToDelete.idZvirata);
        showDeleteModal.value = false;
      } catch (e) { console.error(e); }
    };

    const selectImage = (pet) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        try {
          const res = await axios.post(`${API}/api/zvirata/upload-image/${pet.idZvirata}`, fd);
          const idx = pets.value.findIndex((p) => p.idZvirata === pet.idZvirata);
          pets.value[idx] = mapPet(res.data);
        } catch (err) { console.error(err); }
      };
      input.click();
    };

    // Calendar
    const generateCalendar = () => {
      const firstDay  = new Date(currentYear.value, currentMonth.value, 1).getDay();
      const lastDate  = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
      const todayDate = new Date(); todayDate.setHours(0,0,0,0);
      const days = [];

      for (let i = 0; i < (firstDay + 6) % 7; i++)
        days.push({ date: null, number: null, classes: "calendar-day empty" });

      for (let d = 1; d <= lastDate; d++) {
        const dateStr = `${currentYear.value}-${String(currentMonth.value+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const dayDate = new Date(dateStr); dayDate.setHours(0,0,0,0);
        let cls = "calendar-day";

        if (d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()) cls += " today";
        if (dayDate < todayDate) cls += " past";

        if (selectedStart.value) {
          const s = new Date(selectedStart.value); s.setHours(0,0,0,0);
          const e = selectedEnd.value ? new Date(selectedEnd.value) : new Date(s); e.setHours(0,0,0,0);
          if (dayDate >= s && dayDate <= e) cls += " selected";
        }

        const list = isAdmin.value ? allReservations.value : reservations.value;
        list.forEach((res) => {
          const s = new Date(res.datumOd); s.setHours(0,0,0,0);
          const e = new Date(res.datumDo); e.setHours(0,0,0,0);
          if (dayDate >= s && dayDate <= e) {
            cls += e < todayDate ? " reserved-past" : s > todayDate ? " reserved-future" : " reserved-current";
          }
        });

        days.push({ date: dateStr, number: d, classes: cls });
      }
      calendarDays.value = days;
    };

    const prevMonth = () => { if (--currentMonth.value < 0)  { currentMonth.value = 11; currentYear.value--; } generateCalendar(); };
    const nextMonth = () => { if (++currentMonth.value > 11) { currentMonth.value = 0;  currentYear.value++; } generateCalendar(); };

    const selectDay = (day) => {
      if (!day.date) return;
      const clicked  = new Date(day.date);
      const todayDate = new Date(); todayDate.setHours(0,0,0,0);
      if (clicked < todayDate) return;

      if (!selectedStart.value || selectedEnd.value) {
        selectedStart.value = day.date;
        selectedEnd.value   = null;
      } else {
        const s = new Date(selectedStart.value);
        clicked < s
          ? (selectedEnd.value = selectedStart.value, selectedStart.value = day.date)
          : (selectedEnd.value = day.date);
      }

      selectedDates.value = [];
      const cur = new Date(selectedStart.value);
      const end = selectedEnd.value ? new Date(selectedEnd.value) : new Date(cur);
      while (cur <= end) {
        selectedDates.value.push(`${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,"0")}-${String(cur.getDate()).padStart(2,"0")}`);
        cur.setDate(cur.getDate() + 1);
      }
      generateCalendar();
    };

    // Reservations
    const openRoomModal = () => { showRoomModal.value = true; };

    const reserveRoom = async (room) => {
      if (!room.selectedPetId)          { showToast("Please select a pet", "warning"); return; }
      if (selectedDates.value.length < 2) { showToast("Select at least 2 days", "warning"); return; }

      const sorted = [...selectedDates.value].sort((a, b) => new Date(a) - new Date(b));
      try {
        await axios.post(`${API}/api/rezervace/add`, {
          zakaznikId: user.value.idZakaznici,
          petId:  room.selectedPetId,
          roomId: room.id,
          datumOd: sorted[0],
          datumDo: sorted[sorted.length - 1],
          celkovaCena: room.price * sorted.length,
          poznamka: "",
        });
        showToast(`Room ${room.name} reserved!`, "success");
        showRoomModal.value = false;
        await fetchReservations();
        await fetchNotifications();
      } catch (err) { console.error(err); }
    };

    const openCancelReservation = (res) => {
      reservationToCancel.value = res;
      cancelReason.value = "";
      showCancelReservationModal.value = true;
    };

    const confirmCancelReservation = async () => {
      try {
        await axios.delete(`${API}/api/rezervace/${reservationToCancel.value.id}`, { data: { reason: cancelReason.value } });
        allReservations.value = allReservations.value.filter((r) => r.id !== reservationToCancel.value.id);
        showCancelReservationModal.value = false;
        showToast("Reservation cancelled", "success");
      } catch (e) { console.error(e); showToast("Cancel failed", "alert"); }
    };

    const openReservationDetail = (res) => { selectedReservation.value = res; showReservationDetail.value = true; };

    onMounted(async () => {
      await fetchPets();
      await fetchReservations();
      await fetchNotifications();
      generateCalendar();
      if (isAdmin.value) { await fetchAllReservations(); }
    });

    return {
      user, isAdmin, pets, notifications, allReservations, toast, rooms, weekdays, monthName, currentYear, calendarDays,
      showPetModal, editingPet, petForm, showDeleteModal, showRoomModal, showCancelReservationModal, cancelReason,
      showReservationDetail, selectedReservation, shortNote, formatDate, getCustomerName, filteredPetsForRoom, openPetModal,
      closePetModal, editPet, savePet, confirmDeletePet, deletePet, selectImage, prevMonth, nextMonth, selectDay, openRoomModal,
      reserveRoom, openCancelReservation, confirmCancelReservation, openReservationDetail
    };
  },
};