<template>
  <div class="features-wrapper">
    <div class="features">
      <div class="item" v-for="f in list" :key="f.title">
        <div class="icon-circle">
          <span class="icon">{{ f.icon }}</span>
        </div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const list = [
  { 
    icon: "🥦", 
    title: "Thực phẩm tươi sạch", 
    desc: "100% đạt chuẩn VietGAP & an toàn" 
  },
  { 
    icon: "🚀", 
    title: "Giao hàng hỏa tốc", 
    desc: "Nhận hàng tận tay chỉ trong 2 giờ" 
  },
  { 
    icon: "🏷️", 
    title: "Siêu sale mỗi ngày", 
    desc: "Hàng ngàn ưu đãi & mã giảm giá sốc" 
  },
  { 
    icon: "🔄", 
    title: "Đổi trả dễ dàng", 
    desc: "Hỗ trợ đổi trả tận nhà trong 48h" 
  },
];
</script>

<style scoped>
.features-wrapper {
  padding: 60px 20px;
  background-color: #f0f4f7;
}

.features {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 25px;
}

.item {
  background: #ffffff;
  padding: 40px 25px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(22, 70, 104, 0.05); 
  transition: all 0.3s ease;
  border: 1px solid rgba(22, 70, 104, 0.05);
  position: relative;
  overflow: hidden;
}


.item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 4px;
  background: #164668;
  transition: width 0.3s ease;
}

.item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(22, 70, 104, 0.12);
}

.item:hover::after {
  width: 100%;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: #f0f4f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: background 0.3s ease;
}

.item:hover .icon-circle {
  background: rgba(22, 70, 104, 0.1); 
}

.icon {
  font-size: 40px;
}

h3 {
  font-size: 1.2rem;
  color: #164668; 
  margin-bottom: 12px;
  font-weight: 700;
}

p {
  font-size: 0.95rem;
  color: #5a6a75;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .features-wrapper {
    padding: 40px 15px;
  }
  .item {
    padding: 30px 20px;
  }
}
</style>