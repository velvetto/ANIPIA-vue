<template>
  <div class="service-item">
    <div class="service-image-wrap">
      <img :src="img" :alt="title" class="service-image" />
    </div>

    <h3 class="service-title">{{ title }}</h3>
    <p class="service-description">{{ desc }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    desc: String,
    img: String
  }
};
</script>

<style scoped>
.service-item {
  background-color: #3c552d21;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.service-item:hover {
  transform: translateY(-15px);
}

.service-image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10; /* fixní velikost */
  overflow: hidden;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-title {
  font-size: 2rem;
  color: #3C552D;
  margin-bottom: 1rem;
}

.service-description {
  font-size: 1.4rem;
  color: #333;
  padding-bottom: 1.5rem;
}
</style>
