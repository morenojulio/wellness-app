import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { app } from '$lib/firebase';
import { language, type Language } from '$lib/stores/language';
import { translations } from '$lib/translations';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null; // human readable / localized
  mode: 'signin' | 'signup';
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentLang: Language = 'en';
language.subscribe((l) => { currentLang = l; });

function mapError(code?: string): string {
  const lang = currentLang || 'en';
  const errMap = (translations as any)[lang].auth.errors as Record<string, string>;
  if (!code) return errMap.generic;
  if (errMap[code]) return errMap[code];
  if (import.meta?.env?.DEV) {
    return `${errMap.generic} (${code})`;
  }
  return errMap.generic;
}

function createAuthStore() {
  const { subscribe, update } = writable<AuthState>({ user: null, loading: true, error: null, mode: 'signin' });

  onAuthStateChanged(auth, (user) => {
    update((s) => ({ ...s, user, loading: false }));
  });

  return {
    subscribe,
    toggleMode() { update((s) => ({ ...s, mode: s.mode === 'signin' ? 'signup' : 'signin', error: null })); },
    async signInWithGoogle() {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        await signInWithPopup(auth, provider);
      } catch (e: any) {
        if (import.meta?.env?.DEV) {
          console.error('[auth] signInWithGoogle error', e?.code, e?.message);
        }
        update((s) => ({ ...s, error: mapError(e?.code) }));
      } finally {
        update((s) => ({ ...s, loading: false }));
      }
    },
    async signUpEmail(email: string, password: string, confirm?: string) {
      if (confirm !== undefined && password !== confirm) {
        update((s) => ({ ...s, error: mapError('password-mismatch') }));
        return;
      }
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        if (import.meta?.env?.DEV) {
          // Temporary dev logging to diagnose signup issues
          console.error('[auth] signUpEmail error', e?.code, e?.message);
        }
        update((s) => ({ ...s, error: mapError(e?.code) }));
      } finally { update((s) => ({ ...s, loading: false })); }
    },
    async signInEmail(email: string, password: string) {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        if (import.meta?.env?.DEV) {
          console.error('[auth] signInEmail error', e?.code, e?.message);
        }
        update((s) => ({ ...s, error: mapError(e?.code) }));
      } finally { update((s) => ({ ...s, loading: false })); }
    },
    async signOut() {
      update((s) => ({ ...s, loading: true }));
      try { await signOut(auth); } catch (e: any) {
        if (import.meta?.env?.DEV) {
          console.error('[auth] signOut error', e?.code, e?.message);
        }
        update((s) => ({ ...s, error: mapError(e?.code) }));
      } finally { update((s) => ({ ...s, loading: false })); }
    }
  };
}

export const authStore = createAuthStore();
