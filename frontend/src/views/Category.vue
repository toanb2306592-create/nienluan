<template>
  <div class="container">
    <h2>Danh mục sản phẩm</h2>

    <div class="product-grid">
      <div class="product-card" v-for="p in products" :key="p._id">
        <img :src="p.image" />
        <h3>{{ p.name }}</h3>
        <p class="price">{{ p.price }} đ</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getProductsByCategory } from "@/services/product";

const route = useRoute();
const products = ref([]);

const loadProducts = async () => {
  const id = route.params.id;
  const res = await getProductsByCategory(id);
  products.value = res.data;
};

onMounted(loadProducts);
watch(() => route.params.id, loadProducts);
</script>

<style scoped>
.container {
  padding: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.price {
  color: red;
  font-weight: bold;
}
</style>