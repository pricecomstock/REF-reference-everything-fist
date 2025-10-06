import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const ENABLED_KEY = 'fist-community-enabled';
const UNLOCKED_KEY = 'fist-community-unlocked';

function createCommunityEnabledStore() {
	// Initialize from localStorage if in browser
	const initialValue = browser ? localStorage.getItem(ENABLED_KEY) === 'true' : false;

	const { subscribe, set, update } = writable<boolean>(initialValue);

	return {
		subscribe,
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem(ENABLED_KEY, String(value));
				// Unlock community content when enabled for the first time
				if (value) {
					localStorage.setItem(UNLOCKED_KEY, 'true');
					communityUnlocked.set(true);
				}
			}
			set(value);
		},
		update: (fn: (value: boolean) => boolean) => {
			update((current) => {
				const newValue = fn(current);
				if (browser) {
					localStorage.setItem(ENABLED_KEY, String(newValue));
					// Unlock community content when enabled for the first time
					if (newValue) {
						localStorage.setItem(UNLOCKED_KEY, 'true');
						communityUnlocked.set(true);
					}
				}
				return newValue;
			});
		},
		toggle: () => {
			update((current) => {
				const newValue = !current;
				if (browser) {
					localStorage.setItem(ENABLED_KEY, String(newValue));
					// Unlock community content when enabled for the first time
					if (newValue) {
						localStorage.setItem(UNLOCKED_KEY, 'true');
						communityUnlocked.set(true);
					}
				}
				return newValue;
			});
		}
	};
}

function createCommunityUnlockedStore() {
	// Initialize from localStorage if in browser
	const initialValue = browser ? localStorage.getItem(UNLOCKED_KEY) === 'true' : false;

	const { subscribe, set } = writable<boolean>(initialValue);

	return {
		subscribe,
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem(UNLOCKED_KEY, String(value));
			}
			set(value);
		},
		unlock: () => {
			if (browser) {
				localStorage.setItem(UNLOCKED_KEY, 'true');
			}
			set(true);
		}
	};
}

export const communityEnabled = createCommunityEnabledStore();
export const communityUnlocked = createCommunityUnlockedStore();
