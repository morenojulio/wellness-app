import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Check for saved preference or default to false
const defaultValue = false;
const initialValue = browser ? localStorage.getItem('darkMode') === 'true' : defaultValue;

// Create the store
export const darkMode = writable<boolean>(initialValue);

// Subscribe to store changes and update localStorage and DOM
if (browser) {
    darkMode.subscribe((value) => {
        localStorage.setItem('darkMode', value.toString());
        if (value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

// Function to toggle dark mode
export function toggleDarkMode() {
    darkMode.update(n => !n);
}
