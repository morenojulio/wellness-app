import type { LayoutLoad } from './$types';

// Centralized client-side auth guard.
// Remains subscribed to react to future auth changes (logout/login without full reload).
export const load: LayoutLoad = async ({ url }) => {
  const protectedPaths = ['/', '/resultados'];

  if (typeof window !== 'undefined') {
    queueMicrotask(() => {
      Promise.all([
        import('$lib/stores/auth'),
        import('$app/navigation'),
        import('$app/stores')
      ]).then(([{ authStore }, { goto }, { page }]) => {
        let lastPath = url.pathname;
        const unsubscribe = authStore.subscribe((s) => {
          const current = page?.subscribe ? lastPath : window.location.pathname; // fallback
          if (s.loading) return;

          // If not authenticated on a protected path -> go auth
          if (!s.user && protectedPaths.includes(window.location.pathname)) {
            goto('/auth');
            return;
          }
          // If authenticated on auth page -> go home
            if (s.user && window.location.pathname === '/auth') {
            goto('/');
            return;
          }
        });

        // Track path changes (SvelteKit navigation) to update lastPath (optional)
        const pageUnsub = page.subscribe(($p: any) => { lastPath = $p.url.pathname; });

        // Expose cleanup on window for HMR (dev only)
        if (import.meta.hot) {
          (import.meta as any).hot.dispose(() => { unsubscribe(); pageUnsub(); });
        }
      });
    });
  }

  return {};
};
