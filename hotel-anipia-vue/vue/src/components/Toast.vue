<template>
  <div :class="['toast', type]">{{ message }}</div>
</template>

<script>
export default {
  props: { message: String, type: { type: String, default: 'success' } }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  opacity: 0.9;
  transition: opacity 0.3s;
}
.toast.warning { background-color: orange; }
.toast.error { background-color: red; }
</style>
