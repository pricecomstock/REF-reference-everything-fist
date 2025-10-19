<script lang="ts">
	import { updateAvailable, offlineReady, cacheStatus, updateServiceWorker, clearCache } from '$lib/stores/pwa';
	import { onMount } from 'svelte';

	let showUpdate = false;
	let showStaleCache = false;
	let showOfflineReady = false;

	onMount(() => {
		const unsubUpdate = updateAvailable.subscribe((available) => {
			showUpdate = available;
		});

		const unsubOffline = offlineReady.subscribe((ready) => {
			if (ready && !showOfflineReady) {
				showOfflineReady = true;
				// Auto-hide after 5 seconds
				setTimeout(() => {
					showOfflineReady = false;
				}, 5000);
			}
		});

		const unsubCache = cacheStatus.subscribe((status) => {
			showStaleCache = status === 'stale';
		});

		return () => {
			unsubUpdate();
			unsubOffline();
			unsubCache();
		};
	});

	function handleUpdate() {
		updateServiceWorker();
		showUpdate = false;
	}

	function dismissUpdate() {
		showUpdate = false;
	}

	function handleClearCache() {
		if (confirm('This will clear all cached data and reload the page. Continue?')) {
			clearCache();
		}
	}

	function dismissStaleCache() {
		showStaleCache = false;
	}
</script>

{#if showUpdate}
	<div class="notification update-notification">
		<div class="notification-content">
			<strong>Update Available</strong>
			<p>A new version of FIST Reference is available.</p>
		</div>
		<div class="notification-actions">
			<button on:click={handleUpdate} class="btn-primary">Update</button>
			<button on:click={dismissUpdate} class="btn-secondary">Later</button>
		</div>
	</div>
{/if}

{#if showStaleCache}
	<div class="notification stale-notification">
		<div class="notification-content">
			<strong>Cache Update Recommended</strong>
			<p>Your cached data is older than 30 days. Clear cache to get the latest content.</p>
		</div>
		<div class="notification-actions">
			<button on:click={handleClearCache} class="btn-primary">Clear Cache</button>
			<button on:click={dismissStaleCache} class="btn-secondary">Dismiss</button>
		</div>
	</div>
{/if}

{#if showOfflineReady}
	<div class="notification offline-notification">
		<div class="notification-content">
			<strong>Ready for Offline Use</strong>
			<p>The app is now available offline!</p>
		</div>
	</div>
{/if}

<style>
	.notification {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		max-width: 400px;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 9999;
		animation: slideIn 0.3s ease-out;
		background: var(--bg-color, #2a2a2a);
		color: var(--text-color, #ffffff);
		border: 1px solid var(--border-color, #444);
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.update-notification {
		background: #1e3a5f;
		border-color: #3b82f6;
	}

	.stale-notification {
		background: #5f4a1e;
		border-color: #f59e0b;
	}

	.offline-notification {
		background: #1e5f3a;
		border-color: #10b981;
	}

	.notification-content {
		margin-bottom: 1rem;
	}

	.notification-content strong {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 1.1rem;
	}

	.notification-content p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.notification-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	.btn-secondary {
		background: transparent;
		color: var(--text-color, #ffffff);
		border: 1px solid var(--border-color, #444);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
