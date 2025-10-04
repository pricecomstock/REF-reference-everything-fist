<script lang="ts">
	import type { CommunityRole, Role } from '$lib/roles';

	export let role: Role | CommunityRole;
</script>

<div>
	{#if 'author' in role}
		<p class="community community-tag">[COMMUNITY ROLE]</p>
	{/if}
	<p class="effect">
		<b>{role.name}:</b>
		{role.text}
	</p>
	{#if 'author' in role}
		<p class="author">[AUTHOR: {role.author}]</p>
	{/if}
</div>

<style>
	.community-tag {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	.author {
		margin-top: 0.5rem;
		font-weight: bold;
		color: var(--color-community);
	}
</style>
