import { writable, get } from 'svelte/store';
import { authStore } from '$lib/stores/auth';
import { db } from '$lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface TimeSettings {
  morningUnlock: string; // HH:MM 24h
  afternoonUnlock: string; // HH:MM 24h
  eveningUnlock: string; // HH:MM 24h
}

interface TimeSettingsState {
  settings: TimeSettings;
  isLoading: boolean;
  isInitialized: boolean;
  error: string;
  saving: boolean;
}

const DEFAULT_SETTINGS: TimeSettings = {
  morningUnlock: '09:00',
  afternoonUnlock: '18:00',
  eveningUnlock: '21:00'
};

function createTimeSettingsStore() {
  const { subscribe, update, set } = writable<TimeSettingsState>({
    settings: DEFAULT_SETTINGS,
    isLoading: true,
    isInitialized: false,
    error: '',
    saving: false,
  });

  let authUnsub: (() => void) | null = null;
  let started = false;
  let currentUid: string | null = null;

  async function load(uid: string) {
    update(s => ({ ...s, isLoading: true, error: '' }));
    try {
      const ref = doc(db, 'users', uid, 'settings', 'time-settings');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        update(s => ({ ...s, settings: {
          morningUnlock: data.morningUnlock || DEFAULT_SETTINGS.morningUnlock,
          afternoonUnlock: data.afternoonUnlock || DEFAULT_SETTINGS.afternoonUnlock,
            eveningUnlock: data.eveningUnlock || DEFAULT_SETTINGS.eveningUnlock,
        }, isLoading: false, isInitialized: true }));
      } else {
        update(s => ({ ...s, settings: DEFAULT_SETTINGS, isLoading: false, isInitialized: true }));
      }
    } catch (e: any) {
      console.error('[timeSettings] load error', e);
      update(s => ({ ...s, error: e?.message || String(e), isLoading: false, isInitialized: true }));
    }
  }

  return {
    subscribe,
    init() {
      if (started) return;
      started = true;
      authUnsub = authStore.subscribe(a => {
        const uid = a.user?.uid || null;
        if (uid === currentUid) return;
        currentUid = uid;
        if (!uid) {
          set({ settings: DEFAULT_SETTINGS, isLoading: false, isInitialized: true, error: '', saving: false });
          return;
        }
        load(uid);
      });
    },
    destroy() {
      if (authUnsub) { authUnsub(); authUnsub = null; }
      currentUid = null;
      started = false;
      set({ settings: DEFAULT_SETTINGS, isLoading: true, isInitialized: false, error: '', saving: false });
    },
    async save(newSettings: TimeSettings) {
      const { user } = get(authStore) as any;
      if (!user) {
        update(s => ({ ...s, error: 'Not authenticated' }));
        return { success: false, error: 'Not authenticated' };
      }
      update(s => ({ ...s, saving: true, error: '' }));
      try {
        const ref = doc(db, 'users', user.uid, 'settings', 'time-settings');
        await setDoc(ref, newSettings, { merge: true });
        update(s => ({ ...s, settings: newSettings, saving: false }));
        return { success: true };
      } catch (e: any) {
        console.error('[timeSettings] save error', e);
        update(s => ({ ...s, error: e?.message || String(e), saving: false }));
        return { success: false, error: e?.message || String(e) };
      }
    }
  };
}

export const timeSettings = createTimeSettingsStore();
