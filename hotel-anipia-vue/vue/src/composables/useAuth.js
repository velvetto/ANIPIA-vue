import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    telefon: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  })
  const error = ref('')
  const toast = reactive({
    visible: false,
    message: '',
    type: 'success'
  })

  /*TOAST*/
  const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.visible = true
    setTimeout(() => {
      toast.visible = false
    }, 4000)
  }

  /*LOGIN*/
  const login = async () => {
    error.value = ''

    if (!form.email || !form.password) {
      error.value = 'Please fill in all fields.'
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/zakaznici/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          heslo: form.password
        })
      })

      if (!response.ok) {
        showToast('Invalid email or password', 'error')
        return
      }

      const data = await response.json()
      data.email = form.email

      if (form.rememberMe) {
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data))
      }

      showToast(`Welcome back, ${data.jmeno} ${data.prijmeni}`, 'success')
      setTimeout(() => router.push('/'), 2000)

    } catch (err) {
      console.error(err)
      showToast('Login error', 'error')
    }
  }

  /*SIGNUP*/
  const signup = async () => {
  error.value = ''

  const errors = []
  if (form.password.length < 8) errors.push('Password must be at least 8 characters.')
  if (form.password !== form.confirmPassword) errors.push('Passwords do not match.')

  if (errors.length) {
    error.value = errors.join(' ')
    return
  }

  try {
    const response = await fetch('http://localhost:8080/api/zakaznici/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jmeno: form.firstName,
        prijmeni: form.lastName,
        telefon: form.telefon || '',
        email: form.email,
        heslo: form.password
      })
    })

    if (response.ok) {
      showToast('Registration successful! Redirecting to login...', 'success')
      setTimeout(() => router.push('/login'), 2000)
    } else if (response.status === 409) { // email already exists
      showToast('User with this email already exists', 'error')
    } else {
      showToast('Registration failed', 'error')
    }
  } catch (err) {
    console.error(err)
    showToast('Server error', 'error')
  }
}
  return {
    form,
    error,
    toast,
    login,
    signup
  }
}