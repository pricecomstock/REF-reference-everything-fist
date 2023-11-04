<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import { isSearching } from '$lib/stores/search';

	let isMac = false;

	onMount(() => {
		isMac = navigator?.platform?.includes('Mac');
	});

	const toggleSearch = () => {
		isSearching.update((current) => !current);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			isSearching.set(false);
		}

		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			e.stopPropagation();

			toggleSearch();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="search" aria-roledescription="btn" on:click={toggleSearch}>
	<Search />
	SEARCH
	<div class="hotkey">
		<kbd>{isMac ? 'CMD' : 'CTRL'}</kbd> + <kbd>K</kbd>
	</div>
</div>

<style>
	div.search {
		background-color: var(--background);
		padding: 0.25rem 0.5rem;
		border-radius: 10rem;
		border: 2px solid var(--gray);

		display: flex;
		align-items: center;
		gap: 0.5rem;

		cursor: text;
	}

	@media screen and (max-width: 450px) {
		.hotkey {
			display: none;
		}
	}

	kbd {
		border-radius: var(--border-radius);
		/* border: 2px solid var(--gray); */
		padding: 0.2rem 0.3rem;
		background-color: var(--background-light);
		color: var(--text-light);
		box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
	}
</style>
