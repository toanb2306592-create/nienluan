
import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import ProductList from "../views/ProductList.vue";
import Cart from "../views/Cart.vue";
import Login from "../views/Login.vue";
import Category from "../views/Category.vue";
import Admin from "../admin/Admin.vue";

const routes = [
  { path: "/", component: Home },

  { path: "/products", component: ProductList },

  {
    path: "/cart",
    component: Cart,
    meta: { requiresAuth: true }, // 🔐 cần login
  },

  { path: "/login", component: Login },

  { path: "/category/:id", component: Category },

  // 👑 ADMIN
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 ROUTER GUARD
router.beforeEach((to, from, next) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    localStorage.removeItem("user");
  }

  // 🔐 cần đăng nhập
  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  // 👑 cần admin
  if (to.meta.requiresAdmin) {
    if (!user || user.role !== "admin") {
      return next("/");
    }
  }

  next();
});

export default router;

