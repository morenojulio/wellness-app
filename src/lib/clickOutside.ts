// Svelte action: dispatches a typed `outside` event when a pointerdown or click
// occurs outside the bound element. Also closes on Escape key for accessibility.
export interface ClickOutsideOptions {
  enabled?: boolean;
  escape?: boolean; // listen for Escape key (default true)
}

export function clickOutside(node: HTMLElement, options: ClickOutsideOptions = {}) {
  let { enabled = true, escape = true } = options;

  function onPointerDown(event: PointerEvent) {
    if (!enabled) return;
    if (!node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent('outside'));
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!enabled || !escape) return;
    if (event.key === 'Escape') {
      node.dispatchEvent(new CustomEvent('outside'));
    }
  }

  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('keydown', onKeyDown, true);

  return {
    update(newOptions: ClickOutsideOptions = {}) {
      enabled = newOptions.enabled ?? true;
      escape = newOptions.escape ?? true;
    },
    destroy() {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    }
  };
}
