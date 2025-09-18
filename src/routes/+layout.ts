import type { LayoutLoad } from './$types';

// Client-side guard only (Firebase auth is client).
// Redirect unauthenticated users away from protected routes before page renders.
export const load: LayoutLoad = async ({ url }) => {
  const pathname = url.pathname;
  const protectedPaths = ['/', '/resultados'];

  if (typeof window !== 'undefined') {
    // Defer check to next microtask to allow auth listener to populate.
    queueMicrotask(() => {
      import('$lib/stores/auth').then(({ authStore }) => {
        const unsubscribe = authStore.subscribe((s) => {
          if (!s.loading) {
            if (!s.user && protectedPaths.includes(pathname)) {
              window.location.href = '/auth';
            }
            if (s.user && pathname === '/auth') {
              window.location.href = '/';
            }
            unsubscribe();
          }
        });
      });
    });
  }

  return {};
};
