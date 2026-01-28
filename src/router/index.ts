import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '@/stores/auth'; // Adjust path as needed

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: 'public', title: 'Home'},
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { layout: 'public', title: 'About' },
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { layout: 'public', title: 'Auth' },
  },

  // App routes (show toolbar)
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/CalendarView.vue'),
    meta: { layout: 'app', title: 'Calendar', requiresAuth: true },
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('@/views/InsightsView.vue'),
    meta: { layout: 'app', title: 'Insights', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { layout: 'app', title: 'Settings'  , requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authStore.isAuthenticated; // Get the auth status

  if (requiresAuth && !isAuthenticated) {
    // If the route requires auth and the user is not authenticated, redirect to the login page
    next({ name: 'auth' });
  } else if (to.name === 'auth' && isAuthenticated) {
    // Optional: Prevent logged-in users from accessing the login page
    next({ name: 'calendar' });
  } else {
    // Otherwise, allow navigation to proceed
    next();
  }
});
