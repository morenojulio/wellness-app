import { derived } from 'svelte/store';
import { language, type Language } from '$lib/stores/language';
import { translations } from '$lib/translations';

// Helper function to get nested translation value
function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

// Create a derived store for translations
export const t = derived(
    language,
    ($language: Language) => {
        return (key: string): string => {
            return getNestedValue(translations[$language], key);
        };
    }
);

// Helper function for date formatting based on language
export function formatDate(date: Date, lang: Language): string {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
