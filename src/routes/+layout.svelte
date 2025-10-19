<script lang="ts">
	import { page } from '$app/stores';
	import SearchBox from '$components/SearchBox.svelte';
	import PWAUpdateNotification from '$components/PWAUpdateNotification.svelte';
	import { isSearching } from '$lib/stores/search';
	import '../reset.css';
	import '../styles.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import Nav from './Nav.svelte';
	import { onNavigate } from '$app/navigation';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onNavigate((navigation) => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
		if (
			// @ts-ignore
			!document?.startViewTransition ||
			prefersReducedMotion
		)
			return;

		return new Promise<void>((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>FISTREF - {$page.data.title ?? 'Online Fist Reference'}</title>
	{@html webManifestLink}
	<meta name="theme-color" content="#1a1a1a" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="FIST Ref" />
</svelte:head>

<div class="layout">
	<SearchBox />
	<Header />
	<Nav />
	<div class="page">
		<slot><!-- optional fallback --></slot>
	</div>
	<div class="footer">
		<Footer />
	</div>
	<PWAUpdateNotification />
</div>

<style>
	.page {
		max-width: 100%;
		margin: 1rem 1rem 5rem 1rem;
	}

	.footer {
		padding: 1rem;
		text-align: center;
	}

	/* Page Transitions */
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes scale-in {
		from {
			transform: scale(0.7);
		}
	}

	@keyframes scale-out {
		to {
			transform: scale(0.7);
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation: 50ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			150ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 50ms both fade-in,
			150ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
