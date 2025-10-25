<script lang="ts">
	import {
		updateAvailable,
		offlineReady,
		cacheStatus,
		updateServiceWorker,
		clearCache
	} from '$lib/stores/pwa';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Reactive online status
	const isOnline = writable(navigator.onLine ?? true);

	// Automatically update when a new version is available
	onMount(() => {
		// Listen for online/offline events
		const handleOnline = () => isOnline.set(true);
		const handleOffline = () => isOnline.set(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		const unsubUpdate = updateAvailable.subscribe((available) => {
			if (available) {
				// Auto-update after a short delay to allow user to see the status
				setTimeout(() => {
					updateServiceWorker();
				}, 2000);
			}
		});

		// Automatically clear cache when stale (only if online)
		const unsubCache = cacheStatus.subscribe((status) => {
			if (status === 'stale' && $isOnline) {
				// Auto-clear stale cache after a short delay
				setTimeout(() => {
					clearCache();
				}, 2000);
			}
		});

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			unsubUpdate();
			unsubCache();
		};
	});
</script>

<a
	href="/pwa"
	class={clsx(
		{
			offline: !$isOnline && !$updateAvailable,
			online: $isOnline
		},
		'status'
	)}
>
	{#if $updateAvailable}
		[TRANSMISSION INCOMING - APP UPDATING]
	{:else if $offlineReady && $cacheStatus !== 'stale'}
		<!-- "fresh" or "none" -->
		[ONLINE - OFFLINE READY]
	{:else if $offlineReady && $cacheStatus === 'stale'}
		[ONLINE - CACHE OUTDATED]
	{:else if !$isOnline && $cacheStatus !== 'none'}
		[OFFLINE - USING CACHED DATA]
	{:else if !$isOnline}
		[OFFLINE]
	{:else}
		[ONLINE]
		<!-- isOnline: {$isOnline} / cacheStatus: {$cacheStatus} / updateAvailable: {$updateAvailable} -->
	{/if}
</a>

<style>
	.offline {
		color: var(--color-frc);
	}

	a {
		text-decoration: none;
	}
	/* 
	.online {
		color: var(--color-rfx);
	} */

	.status {
		font-weight: bold;
	}
</style>
