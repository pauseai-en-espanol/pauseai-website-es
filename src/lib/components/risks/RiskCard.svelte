<script lang="ts">
	import type { RiskArticle } from '../../../routes/riesgos/+page.server'

	export let risk: RiskArticle
	export let canSelect: boolean
	export let baseUrl: string
</script>

{#if risk.isPlaceholder}
	<div class="risk-card placeholder" aria-label="Próximamente">
		<img src="/favicon.png" alt="" class="placeholder-logo" />
		<h3 class="placeholder-title">{@html risk.title}</h3>
	</div>
{:else}
	<a href="{baseUrl}/{risk.slug}" class="risk-card unlocked" aria-label={risk.title}>
		{#if risk.cover}
			<img src={risk.cover} alt={risk.title} class="card-cover" />
		{/if}
	</a>
{/if}

<style>
	.risk-card {
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;
		position: relative;
		aspect-ratio: 1;
	}

	.risk-card.unlocked {
		cursor: pointer;
	}

	.risk-card.unlocked:hover {
		box-shadow: 0 6px 20px rgba(255, 148, 22, 0.4);
		transform: translateY(-3px);
	}

	.card-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.risk-card.placeholder {
		background: linear-gradient(135deg, var(--brand) 0%, #c45a00 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.placeholder-logo {
		width: 80px;
		height: 80px;
	}

	.placeholder-title {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		color: white;
		margin: 0;
		text-align: center;
	}
</style>
