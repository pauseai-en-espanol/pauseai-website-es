<script lang="ts">
	import RiskCard from './RiskCard.svelte'
	import type { RiskArticle } from '../../../routes/riesgos/+page.server'

	export let risks: RiskArticle[] = []
	export let baseUrl: string
</script>

<div class="risk-grid">
	<div class="grid-layout">
		{#each risks as risk (risk.id)}
			<RiskCard {risk} {baseUrl} canSelect={false} />
		{/each}
	</div>
</div>

<style>
	.risk-grid {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.grid-layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	@media (max-width: 768px) {
		.risk-grid {
			padding: 0;
		}

		.grid-layout {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.grid-layout {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1025px) {
		.grid-layout {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
