<script lang="ts">
	import RiskGrid from '$lib/components/risks/RiskGrid.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const baseUrl = '/riesgos'
</script>

<svelte:head>
	<title>Riesgos de la IA - PauseAI</title>
	<meta
		name="description"
		content="Descubre los riesgos de la Inteligencia Artificial y por qué es urgente actuar."
	/>
</svelte:head>

<div class="page-container">
	<header class="page-header">
		<h1>Riesgos de la IA</h1>
		<p class="subtitle">
			Explora con nosotros los riesgos que plantea la Inteligencia Artificial, y sus daños actuales
		</p>
	</header>

	<RiskGrid risks={data.risks} {baseUrl} />
</div>

<style>
	.page-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: var(--spacing-md);
	}

	.page-header {
		text-align: center;
		padding: var(--spacing-md) var(--spacing-md);
	}

	.page-header p {
		margin-bottom: 0;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: 3rem;
		color: var(--brand);
		margin: 0 0 var(--spacing-sm) 0;
		text-transform: uppercase;
	}

	.subtitle {
		font-size: 1.2rem;
		color: var(--text);
		margin: 0 0 var(--spacing-md) 0;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.page-container {
			padding: var(--spacing-sm);
		}

		.page-header {
			padding: var(--spacing-md) var(--spacing-sm);
		}

		h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}
</style>
