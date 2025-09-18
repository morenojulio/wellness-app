// Svelte action to manage focus and keyboard navigation for a simple menu popup.
// Assumptions:
// - Applied to a wrapper element that contains the trigger button and the menu container.
// - Menu container has role="menu" and menu items have role="menuitem" (or are buttons inside it).
// - The trigger button has data-menu-trigger attribute for identification.
// Behavior:
// - On menu open (aria-expanded="true" on trigger), focus first menuitem.
// - Arrow Down/Up cycle items; Home/End jump; Escape closes and returns focus to trigger.
// - Tab/Shift+Tab will close the menu naturally (do not trap, just restore focus if leaving backward).
// - When menu closes (aria-expanded becomes false or Escape/outside), focus returns to trigger.
// This action listens to attribute changes via a MutationObserver to detect open/close state changes.

interface MenuA11yOptions {
  // Optional selector for menu items (defaults to '[role="menuitem"]')
  itemSelector?: string;
}

export function menuA11y(node: HTMLElement, options: MenuA11yOptions = {}) {
  const itemSelector = options.itemSelector || '[role="menuitem"]';
  let trigger: HTMLElement | null = null;
  let menu: HTMLElement | null = null;

  function findParts() {
    trigger = node.querySelector('[data-menu-trigger]') as HTMLElement | null;
    // The menu is the element with role="menu" inside node
    menu = node.querySelector('[role="menu"]') as HTMLElement | null;
  }

  function getItems(): HTMLElement[] {
    if (!menu) return [];
    return Array.from(menu.querySelectorAll<HTMLElement>(itemSelector))
      .filter(el => !el.hasAttribute('disabled'));
  }

  function focusFirst() {
    const items = getItems();
    if (items.length) items[0].focus();
  }

  function focusLast() {
    const items = getItems();
    if (items.length) items[items.length - 1].focus();
  }

  function isOpen() {
    return !!trigger && trigger.getAttribute('aria-expanded') === 'true' && !!menu;
  }

  function closeMenu(focusTrigger = true) {
    if (trigger && isOpen()) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    if (focusTrigger && trigger) trigger.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!isOpen()) return;
    const items = getItems();
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex === -1 || currentIndex === items.length - 1) {
          items[0].focus();
        } else {
          items[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex <= 0) {
          items[items.length - 1].focus();
        } else {
          items[currentIndex - 1].focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        items[0].focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu(true);
        break;
      case 'Tab':
        // Let tab proceed but close menu and restore focus if shift-tabbing from first or tabbing from last
        if (e.shiftKey && currentIndex === 0) {
          closeMenu(false); // allow focus to move before trigger
        } else if (!e.shiftKey && currentIndex === items.length - 1) {
          closeMenu(false); // allow focus to move after menu
        }
        break;
    }
  }

  function onDocumentPointerDown(e: PointerEvent) {
    if (!isOpen()) return;
    if (!node.contains(e.target as Node)) {
      closeMenu(false);
    }
  }

  function onMutation(mutations: MutationRecord[]) {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.target === trigger && m.attributeName === 'aria-expanded') {
        if (isOpen()) {
          // Delay to ensure menu items rendered
          requestAnimationFrame(focusFirst);
        } else {
          // Menu closed
          requestAnimationFrame(() => trigger && trigger.focus());
        }
      }
    }
  }

  findParts();
  const observer = new MutationObserver(onMutation);
  if (node) {
    observer.observe(node, { subtree: true, attributes: true, attributeFilter: ['aria-expanded'] });
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);

  return {
    update(newOptions: MenuA11yOptions = {}) {
      if (newOptions.itemSelector && newOptions.itemSelector !== itemSelector) {
        // No dynamic change currently; would require re-query logic
      }
      findParts();
    },
    destroy() {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
    }
  };
}
