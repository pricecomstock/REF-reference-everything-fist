<script lang="ts">
	import clsx from 'clsx';
	import { loadAllCommunityContent } from '$lib/community';
	import { communityEnabled } from '$lib/stores/communityPreferences';

	export let checked: boolean | undefined = undefined;
	export let disabled: boolean = false;
	export let onToggle: ((checked: boolean) => void | Promise<void>) | undefined = undefined;

	let isLoading = false;

	// Use the global store if no checked value is bound
	$: effectiveChecked = checked !== undefined ? checked : $communityEnabled;

	async function handleChange() {
		const newValue = effectiveChecked;

		if (newValue && !isLoading) {
			isLoading = true;
			try {
				await loadAllCommunityContent();
				if (onToggle) {
					await onToggle(newValue);
				}
			} finally {
				isLoading = false;
			}
		} else if (onToggle) {
			await onToggle(newValue);
		}

		// Update the global store if not bound to a local variable
		if (checked === undefined) {
			communityEnabled.set(newValue);
		}
	}

	$: effectiveDisabled = disabled || isLoading;
</script>

<label class="community-toggle">
	<input
		type="checkbox"
		role="switch"
		bind:checked={effectiveChecked}
		on:change={handleChange}
		disabled={effectiveDisabled}
	/>
	<span class={clsx({ community: effectiveChecked, bold: effectiveChecked })}
		>[INCLUDE COMMUNITY CONTENT]</span
	>
</label>

<style>
	.community-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
	}

	.community-toggle input[type='checkbox'] {
		cursor: pointer;
		width: 1.2rem;
		height: 1.2rem;
		accent-color: var(--color-community);
	}

	.community-toggle input[type='checkbox']:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
