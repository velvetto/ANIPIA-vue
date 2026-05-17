import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export function useLogin() {
  const router = useRouter()

  const form = reactive({
    email: '',
    password: '',
    rememberMe: false
  })

  const toast = reactive({
    visible: false,
    message: '',
    type: 'success'
  })

  const error = reactive({ value: '' })

  const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.visible = true
    setTimeout(() => (toast.visible = false), 4000)
  }

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

    import { ADMIN_EMAIL } from '@/config/admin'
    const data = await response.json()
    data.email = form.email
    data.isAdmin = data.email === ADMIN_EMAIL

    if (form.rememberMe) {
      localStorage.setItem('user', JSON.stringify(data))
    } else {
      sessionStorage.setItem('user', JSON.stringify(data))
    }

    showToast(`Welcome back, ${data.jmeno} ${data.prijmeni}`, 'success')
    setTimeout(() => router.push('/'), 2000)

  } catch (err) {
    console.error(err)
    showToast('Server is not responding', 'error')
  }
}

  return { form, toast, error, login }
}