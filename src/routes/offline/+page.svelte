<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isOnline = false;

	onMount(() => {
		isOnline = navigator.onLine;

		const handleOnline = () => {
			isOnline = true;
			// Auto-redirect when back online
			setTimeout(() => {
				goto('/');
			}, 1000);
		};

		const handleOffline = () => {
			isOnline = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
</script>

<svelte:head>
	<title>Offline - FIST Reference</title>
</svelte:head>

<div class="offline-container">
	{#if isOnline}
		<div class="status-icon online">✓</div>
		<h1>Back Online!</h1>
		<p>Redirecting you back to the app...</p>
	{:else}
		<div class="status-icon offline">⚠</div>
		<h1>You're Offline</h1>
		<p>This page isn't available in your cache yet.</p>
		<p class="hint">
			Try visiting the pages you want to access offline while you have an internet connection.
		</p>

		<div class="tips">
			<h2>What works offline:</h2>
			<ul>
				<li>Previously visited pages</li>
				<li>Cached traits and roles data</li>
				<li>Random generators (if data is cached)</li>
				<li>Dice table</li>
			</ul>
		</div>

		<button on:click={() => goto('/')}>Go to Home</button>
	{/if}
</div>

<style>
	.offline-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.status-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.status-icon.offline {
		background: rgba(245, 158, 11, 0.2);
		color: #f59e0b;
	}

	.status-icon.online {
		background: rgba(16, 185, 129, 0.2);
		color: #10b981;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		opacity: 0.9;
	}

	.hint {
		font-size: 0.95rem;
		opacity: 0.7;
		font-style: italic;
	}

	.tips {
		margin-top: 2rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 0.5rem;
		text-align: left;
	}

	.tips h2 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.tips ul {
		list-style-position: inside;
		margin: 0;
	}

	.tips li {
		margin-bottom: 0.5rem;
	}

	button {
		margin-top: 2rem;
		padding: 0.75rem 2rem;
		font-size: 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #2563eb;
	}
</style>
