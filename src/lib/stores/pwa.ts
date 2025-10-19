import { writable, readable } from 'svelte/store';
import { browser } from '$app/environment';

export const needsUpdate = writable(false);
export const offlineReady = writable(false);
export const updateAvailable = writable(false);

let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;

if (browser) {
	// Import and register service worker using vite-plugin-pwa
	import('virtual:pwa-register')
		.then(({ registerSW }) => {
			updateSW = registerSW({
				immediate: true,
				onNeedRefresh() {
					updateAvailable.set(true);
				},
				onOfflineReady() {
					offlineReady.set(true);
				},
				onRegistered(registration) {
					if (registration) {
						// Check for updates every hour
						setInterval(() => {
							registration.update();
						}, 60 * 60 * 1000);
					}
				}
			});
		})
		.catch(() => {
			// PWA not available in dev mode or registration failed
			console.log('PWA registration not available');
		});
}

export async function updateServiceWorker() {
	if (updateSW) {
		await updateSW(true);
	}
}

export async function clearCache() {
	if (!browser) return;

	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map(name => caches.delete(name)));

		// Reload the page
		window.location.reload();
	} catch (error) {
		console.error('Error clearing cache:', error);
	}
}

// Check if data cache is stale (older than 30 days)
export const cacheStatus = readable<'fresh' | 'stale' | 'none'>(
	'none',
	(set) => {
		if (!browser) return;

		(async () => {
			try {
				const cacheNames = await caches.keys();
				const dataCacheName = cacheNames.find(name => name.includes('fist-ref-data'));

				if (!dataCacheName) {
					set('none');
					return;
				}

				const dataCache = await caches.open(dataCacheName);

				// Try to find any data file to check the timestamp
				const keys = await dataCache.keys();
				if (keys.length === 0) {
					set('none');
					return;
				}

				// Check the first cached data response
				const firstResponse = await dataCache.match(keys[0]);
				if (!firstResponse) {
					set('none');
					return;
				}

				// Check the Date header from the response
				const dateHeader = firstResponse.headers.get('date');
				if (!dateHeader) {
					set('fresh'); // No date info, assume fresh
					return;
				}

				const cachedDate = new Date(dateHeader);
				const CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
				const isStale = Date.now() - cachedDate.getTime() > CACHE_EXPIRY_MS;

				set(isStale ? 'stale' : 'fresh');
			} catch (error) {
				console.error('Error checking cache status:', error);
				set('none');
			}
		})();
	}
);
