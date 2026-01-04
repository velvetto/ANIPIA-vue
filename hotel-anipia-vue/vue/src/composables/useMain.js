import { ref, onMounted } from 'vue'

export function useMain() {
  // Hamburger menu
  const isMenuActive = ref(false)
  function toggleMenu() {
    isMenuActive.value = !isMenuActive.value
  }
  function closeMenu() {
    isMenuActive.value = false
  }

  // Modaly pro mazlíčky
  const activePetModal = ref(null)
  function openPetModal(index) { activePetModal.value = index }
  function closePetModal() { activePetModal.value = null }

  // Kontakt formulář
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const toast = ref('')

  function submitForm() {
    if (!name.value || !email.value || !message.value) {
      showToast("Fill in all the fields")
      return
    }

    const contactFormData = {
      name: name.value,
      email: email.value,
      message: message.value
    }

    fetch("http://localhost:8080/contact/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactFormData)
    })
    .then(() => {
      showToast("Your message has been sent successfully")
      name.value = ''
      email.value = ''
      message.value = ''
    })
    .catch(err => console.error(err))
  }

  function showToast(msg) {
    toast.value = msg
    setTimeout(() => { toast.value = '' }, 4000)
  }

  // Odhlášení a předvyplnění
  const user = ref(null)

  onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"))
    if (user.value) {
      name.value = `${user.value.jmeno || ''} ${user.value.prijmeni || ''}`.trim()
      email.value = user.value.email || ''
    }
  })

  function logout() {
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    showToast("You have been logged out")
    setTimeout(() => { window.location.href = "/" }, 1500)
  }

  return {
    isMenuActive,
    toggleMenu,
    closeMenu,
    activePetModal,
    openPetModal,
    closePetModal,
    name,
    email,
    message,
    toast,
    submitForm,
    user,
    logout
  }
}
