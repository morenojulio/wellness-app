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

    const { subscribe, set } = writable<Language>(getInitialLanguage());

    return {
        subscribe,
        setLanguage: (lang: Language) => {
            if (browser) {
                localStorage.setItem('language', lang);
            }
            set(lang);
        },
        toggle: () => {
            subscribe((currentLang) => {
                const newLang = currentLang === 'es' ? 'en' : 'es';
                if (browser) {
                    localStorage.setItem('language', newLang);
                }
                set(newLang);
                return newLang;
            })();
        }
    };
}

export const language = createLanguageStore();
