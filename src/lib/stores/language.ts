import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'es' | 'en';

function createLanguageStore() {
    // Get initial language from localStorage or default to Spanish
    const getInitialLanguage = (): Language => {
        if (browser) {
            const stored = localStorage.getItem('language');
            if (stored === 'es' || stored === 'en') {
                return stored;
            }
            // Detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('en')) {
                return 'en';
            }
        }
        return 'es'; // Default to Spanish
    };

    const store = writable<Language>(getInitialLanguage());
    const { subscribe, set, update } = store;

    if (browser) {
        // Keep <html lang="..."> in sync
        subscribe((lang) => {
            document.documentElement.setAttribute('lang', lang);
        });
    }

    return {
        subscribe,
        setLanguage: (lang: Language) => {
            if (browser) {
                localStorage.setItem('language', lang);
            }
            set(lang);
        },
        toggle: () => {
            update((currentLang) => {
                const newLang = currentLang === 'es' ? 'en' : 'es';
                if (browser) {
                    localStorage.setItem('language', newLang);
                }
                return newLang;
            });
        }
    };
}

export const language = createLanguageStore();
