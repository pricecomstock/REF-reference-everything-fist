<script lang="ts">
	import communityMetadata from '$lib/json/community_metadata.json';
	import { format } from 'date-fns/format';

	const lastSyncDate = new Date(communityMetadata.lastSyncedAt);
	const formattedDate = format(lastSyncDate, 'dd MMM yyyy').toUpperCase();
</script>

<div class="footer">
	<a href="https://claymorerpgs.itch.io/fist"
		><img src="/img/fist-compatiblity-mark.png" alt="compatible with fist" /></a
	>
	<div>
		<p>
			<b>FIST</b> is a tabletop RPG of paranormal mercenaries by CLAYMORE and is available
			<a href="https://claymorerpgs.itch.io/fist">here</a>.
		</p>
		<p>
			This tool manufactured with <i>extreme</i> precision by
			<a href="https://price.town/about">PC</a>.
		</p>
		<p>JSON data compiled by <a href="https://ululu.itch.io/fist-json-data">lulu.</a></p>
		<p>
			Community traits and roles by the community &lt;3 and parsed from <a
				href="https://docs.google.com/document/d/1ZkZ7bVUg7W-zASTg2ql7Hrdz0dcTiWKg2R2qt0fOCQY/edit?tab=t.0"
				>The Community Index</a
			>
			(synced {formattedDate})
		</p>
	</div>
</div>

<style>
	img {
		max-width: min(14rem, 30vw);
		margin: 0.5rem;
	}

	p {
		margin-bottom: 0.25rem;
	}

	div.footer {
		display: flex;
		justify-content: center;
		align-items: center;

		text-align: left;
		font-size: 0.85rem;

		gap: 0.5rem;

		view-transition-name: footer;
	}
</style>
