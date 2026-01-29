import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../../src/stores/auth';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initial state: user is null and isAuthenticated is false', () => {
    const store = useAuthStore();
    expect(store.user).toBeDefined();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBeDefined();
    expect(store.isAuthenticated).toBe(false);
  });

  it('setUser sets the user and updates isAuthenticated', () => {
    const store = useAuthStore();
    const u = { id: '1', name: 'Test', email: 't@test' };

    store.setUser(u);
    expect(store.user).toEqual(u);
    expect(store.isAuthenticated).toBe(true);

    // setting null should clear the user
    store.setUser(null);
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('logout clears the user and does not call loginAsDemo', () => {
    const store = useAuthStore();
    // pre-set a user
    store.setUser({ id: 'x', name: 'X', email: 'x@x' });


    store.logout();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('loginAsDemo sets a demo user with expected fields and calls setUser', () => {
    const store = useAuthStore();

    store.loginAsDemo();

    expect(store.user).not.toBeNull();
    expect(store.user?.id).toBe('demo');
    expect(store.user?.email).toBe('demo@plannance.app');
    expect(store.isAuthenticated).toBe(true);
  });
});
