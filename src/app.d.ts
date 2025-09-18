// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Typed custom event for clickOutside action
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:outside'?: (event: CustomEvent<any>) => void;
		}
	}
}

export {};
