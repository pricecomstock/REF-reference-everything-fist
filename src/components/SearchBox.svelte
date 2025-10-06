<script lang="ts">
	import { isSearching, searchQuery, searchResults, includeCommunity } from '$lib/stores/search';
	import { Sparkle, X, Zap, UserPen } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import NumberBlock from './NumberBlock.svelte';
	import CommunityToggle from './CommunityToggle.svelte';
	import { afterNavigate } from '$app/navigation';

	import { fade } from 'svelte/transition';

	let dialogElement: HTMLDialogElement;
	let searchInputElement: HTMLInputElement;

	let unsubscribe: () => void;

	onMount(() => {
		unsubscribe = isSearching.subscribe((value) => {
			if (value) {
				dialogElement.showModal();
				dialogElement.classList.remove('closed');
				dialogElement.classList.add('open');
			} else {
				searchQuery.set('');
				dialogElement.close();
				dialogElement.classList.remove('open');
				dialogElement.classList.add('closed');
			}
		});
	});

	afterNavigate(() => {
		isSearching.set(false);
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	$: allResults = [
		...$searchResults.roles,
		...$searchResults.traits,
		...$searchResults.communityRoles,
		...$searchResults.communityTraits
	];
	$: resultCount =
		$searchResults.traits.length +
		$searchResults.roles.length +
		$searchResults.communityTraits.length +
		$searchResults.communityRoles.length;

	let highlightedResultIndex = -1;

	/** an object that maps from role or trait number to the HTML element*/
	let resultElementsObject: Record<number, HTMLElement> = {};

	const setFocus = (index: number) => {
		highlightedResultIndex = index;
	};

	const updateFocus = () => {
		// Use -1 for the search box
		if (highlightedResultIndex === -1) {
			searchInputElement.focus();
			return;
		}

		// Need to do 2 step lookup because binding directly to array was causing problems when results were removed
		// when more characters were typed.

		// Get the search result element from allResults array. Then get the role or trait number from that element.
		// Then look up the element in the resultElementsObject using that number.
		let el = resultElementsObject[allResults[highlightedResultIndex].number];
		if (el) {
			el.focus();
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			setFocus(Math.min(resultCount - 1, highlightedResultIndex + 1));
			updateFocus();

			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			setFocus(Math.max(-1, highlightedResultIndex - 1));
			updateFocus();

			return;
		}
		if (
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ArrowLeftArrowRightBackspace'.includes(
				e.key
			)
		) {
			setFocus(-1);
			updateFocus();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />
<dialog bind:this={dialogElement} class={`${$isSearching ? 'open' : 'closed'}`}>
	<div class="query-bar">
		<input
			type="text"
			name="query"
			id="query"
			autocomplete="off"
			bind:value={$searchQuery}
			bind:this={searchInputElement}
			on:change={() => setFocus(-1)}
			on:focus={() => setFocus(-1)}
			placeholder="Search..."
		/>
		<button aria-label="Close" on:click={() => isSearching.set(false)}><X /></button>
	</div>
	<div class="community-toggle-wrapper">
		<CommunityToggle />
	</div>
	<div class="results">
		{#if $searchResults.roles.length}
			<div class="section-header">
				<Sparkle size={32} /> Roles
			</div>
		{/if}
		{#each $searchResults.roles as role, index (role.number)}
			{@const overallIndex = index}
			<a
				href={`/role/${role.name.toLowerCase()}`}
				class="search-result"
				in:fade={{ delay: overallIndex * 40, duration: 100 }}
				out:fade={{ duration: 100 }}
				on:focus={() => setFocus(overallIndex)}
				on:mouseover={() => {
					setFocus(overallIndex);
					updateFocus();
				}}
				bind:this={resultElementsObject[role.number]}
			>
				<NumberBlock showLink={false} {role} />
			</a>
		{/each}
		{#if $searchResults.traits.length}
			<div class="section-header" in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
				<Zap size={32} /> Traits
			</div>
		{/if}
		{#each $searchResults.traits as trait, index (trait.number)}
			{@const overallIndex = index + +$searchResults.roles.length}
			<a
				href={`/trait/${trait.name.toLowerCase()}`}
				class="search-result"
				in:fade={{ delay: overallIndex * 40, duration: 100 }}
				out:fade={{ duration: 100 }}
				on:focus={() => setFocus(overallIndex)}
				on:mouseover={() => {
					setFocus(overallIndex);
					updateFocus();
				}}
				bind:this={resultElementsObject[trait.number]}
			>
				<NumberBlock showLink={false} {trait} />
			</a>
		{/each}
		{#if $searchResults.communityRoles.length}
			<div
				class="section-header community"
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
			>
				<UserPen size={32} /> Community Roles
			</div>
		{/if}
		{#each $searchResults.communityRoles as role, index (role.number)}
			{@const overallIndex = index + $searchResults.roles.length + $searchResults.traits.length}
			<a
				href={`/role/${role.slug}`}
				class="search-result"
				in:fade={{ delay: overallIndex * 40, duration: 100 }}
				out:fade={{ duration: 100 }}
				on:focus={() => setFocus(overallIndex)}
				on:mouseover={() => {
					setFocus(overallIndex);
					updateFocus();
				}}
				bind:this={resultElementsObject[role.number]}
			>
				<NumberBlock showLink={false} {role} />
			</a>
		{/each}
		{#if $searchResults.communityTraits.length}
			<div
				class="section-header community"
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
			>
				<UserPen size={32} /> Community Traits
			</div>
		{/if}
		{#each $searchResults.communityTraits as trait, index (trait.number)}
			{@const overallIndex =
				index +
				$searchResults.roles.length +
				$searchResults.traits.length +
				$searchResults.communityRoles.length}
			<a
				href={`/trait/${trait.slug}`}
				class="search-result"
				in:fade={{ delay: overallIndex * 40, duration: 100 }}
				out:fade={{ duration: 100 }}
				on:focus={() => setFocus(overallIndex)}
				on:mouseover={() => {
					setFocus(overallIndex);
					updateFocus();
				}}
				bind:this={resultElementsObject[trait.number]}
			>
				<NumberBlock showLink={false} {trait} />
			</a>
		{/each}
		{#if $searchResults.roles.length === 0 && $searchResults.traits.length === 0 && $searchResults.communityRoles.length === 0 && $searchResults.communityTraits.length === 0}
			{#if $searchQuery.length < 3}
				<div class="message" in:fade={{ duration: 100 }}>AWAITING QUERY...</div>
			{:else}
				<div class="message" in:fade={{ duration: 100 }}>NO RESULTS</div>
			{/if}
		{/if}
	</div>
</dialog>

<style>
	dialog {
		background-color: var(--background);
		border-radius: var(--border-radius);
		border: 2px solid var(--gray);

		position: absolute;

		width: min(90vw, 47.5rem);

		padding: 0;

		min-height: 15rem;
		max-height: 90svh;

		overflow-y: hidden;
	}

	dialog.open {
		animation: enter 0.2s ease-in-out;
	}

	@keyframes enter {
		from {
			opacity: 0;
			transform: translateY(15rem);
		}
		to {
			opacity: 1;
		}
	}

	input {
		display: block;
		width: 100%;
		font-size: 1.5rem;
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 0;

		outline: none;
		background-color: var(--gray);

		text-transform: uppercase;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.35);
	}

	.results {
		overflow: auto;
		max-height: 90svh;
	}

	.query-bar {
		display: flex;
		position: relative;
	}

	.community-toggle-wrapper {
		display: flex;
		justify-content: center;
		padding: 0.5rem;
		background-color: var(--gray);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		gap: 0.25rem;

		margin: 0.5rem;
	}

	.section-header.community {
		color: var(--color-community);
	}

	.message {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;

		margin: 0.5rem auto;
		height: 10rem;
	}

	.search-result {
		display: block;
		/* margin: 0.5rem 0; */
		padding: 1rem 0.5rem;

		text-decoration: none;
		cursor: pointer;

		transition: background-color 0.2s ease, max-height 0.5s ease;
	}

	.search-result.cropped {
		max-height: 10rem;
		overflow: hidden;

		--mask: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 1) 0,
				rgba(0, 0, 0, 1) 65%,
				rgba(0, 0, 0, 0) 98%,
				rgba(0, 0, 0, 0) 0
			)
			100% 50% / 100% 100% repeat-x;

		-webkit-mask: var(--mask);
		mask: var(--mask);
	}

	.search-result:focus {
		/* impossibly tall max height */
		/* max-height: 200rem; */
		/* --mask: none; */
		--accent: var(--text);
		background-color: var(--gray);
		outline: none;
	}

	button {
		background-color: var(--gray);
		border: none;
		padding: 0.25rem 0.5rem;

		cursor: pointer;
	}

	::backdrop {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
