import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ProductList from "../views/ProductList.vue";
import Cart from "../views/Cart.vue";
import Login from "../views/Login.vue";
import Category from "../views/Category.vue";
import Admin from "../admin/Admin.vue";
import Order from "../views/Order.vue"; 

const routes = [
  { path: "/", component: Home },
  { path: "/products", component: ProductList },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/orders',
    name: 'UserOrders',
    component: Order 
  },
  {
    path: '/status-history',
    name: 'StatusHistory',
    component: () => import('@/views/StatusHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/cart",
    component: Cart,
    meta: { requiresAuth: true },
  },
  { path: "/login", component: Login },
  { path: "/category/:id", component: Category },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    localStorage.removeItem("user");
  }

  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  if (to.meta.requiresAdmin) {
    if (!user || user.role !== "admin") {
      return next("/");
    }
  }
  next();
});

export default router;