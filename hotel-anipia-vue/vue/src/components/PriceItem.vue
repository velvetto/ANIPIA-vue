<template>
  <div class="price-list-item" @click="$emit('open-modal')">
    <img :src="img" :alt="title" />
    <h3>{{ title }}</h3>
    <p class="price">{{ price }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    price: String,
    img: String
  }
};
</script>
