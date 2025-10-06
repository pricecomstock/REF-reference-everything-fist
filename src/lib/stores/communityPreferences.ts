import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'fist-community-enabled';

function createCommunityEnabledStore() {
	// Initialize from localStorage if in browser
	const initialValue = browser ? localStorage.getItem(STORAGE_KEY) === 'true' : false;

	const { subscribe, set, update } = writable<boolean>(initialValue);

	return {
		subscribe,
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem(STORAGE_KEY, String(value));
			}
			set(value);
		},
		update: (fn: (value: boolean) => boolean) => {
			update((current) => {
				const newValue = fn(current);
				if (browser) {
					localStorage.setItem(STORAGE_KEY, String(newValue));
				}
				return newValue;
			});
		},
		toggle: () => {
			update((current) => {
				const newValue = !current;
				if (browser) {
					localStorage.setItem(STORAGE_KEY, String(newValue));
				}
				return newValue;
			});
		}
	};
}

export const communityEnabled = createCommunityEnabledStore();
