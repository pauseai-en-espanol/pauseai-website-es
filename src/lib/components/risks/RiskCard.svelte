<script lang="ts">
	import type { RiskArticle } from '../../../routes/riesgos/+page.server'

	export let risk: RiskArticle
	export let canSelect: boolean
	export let baseUrl: string
</script>

{#if risk.isPlaceholder}
	<div
		class="risk-card placeholder"
		aria-label="Próximamente"
		style="background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(245,148,25, 0.8)), url('/favicon.png')"
	>
		<div class="card-content centered">
			<h3 class="card-title">{@html risk.title}</h3>
		</div>
	</div>
{:else}
	<a
		href="{baseUrl}/{risk.slug}"
		class="risk-card unlocked"
		aria-label={risk.title}
		style="background-image: {risk.gradient}, url('{risk.cover}')"
	>
		<div class="card-content">
			<h3 class="card-title">{risk.title}</h3>
			{#if risk.brief}
				<p class="card-brief">{risk.brief}</p>
			{/if}
		</div>
	</a>
{/if}

<style>
	.risk-card {
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
		border: 2px solid var(--brand);
		border-radius: 8px;
		padding: var(--spacing-sm);
		background-color: var(--bg);
		transition: all 0.3s ease;
		min-height: 163px;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		position: relative;
	}

	.risk-card.unlocked {
		cursor: pointer;
	}

	.risk-card.unlocked:hover {
		box-shadow: 0 4px 12px rgba(255, 148, 22, 0.3);
		transform: translateY(-2px);
		color: inherit;
	}

	.risk-card.placeholder {
		background-size: cover;
		opacity: 0.9;
		border-color: var(--text-subtle);
		cursor: default;
		justify-content: center;
		align-items: center;
	}

	.card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
	}

	.card-content.centered {
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--text);
	}

	.card-brief {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--text);
		font-size: 0.95rem;
		line-height: 1.5;
	}
</style>
