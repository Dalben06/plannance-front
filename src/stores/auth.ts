import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export const useAuthStore = defineStore('auth', () => {
  // Stub user (replace with real auth later)
  // const user = ref<AppUser | null>({
  //   id: 'demo',
  //   name: 'Leonardo',
  //   email: 'leonardo@plannance.app',
  // });
   const user = ref<AppUser | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  function setUser(next: AppUser | null) {
    user.value = next;
  }

  function logout() {
    user.value = null;
  }

  function loginAsDemo() {
    user.value = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@plannance.app',
    };
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
    loginAsDemo,
  };
});
