<script lang="ts">
	import PostMeta from '$lib/components/PostMeta.svelte'
	import TallyEmbed from '$lib/components/TallyEmbed.svelte'
	import { meta } from './meta'
	import Signatory from './signatory.svelte'

	export let data

	const { signatories, totalCount } = data
	const { title, description, date } = meta

	// Variable to control how many signatories are shown
	const shortListN = 5
	let showAll = false
	let expandAllBios = false
	// Reactive variable to determine the list of signatories to display
	$: visibleSignatories = showAll ? signatories : signatories.slice(0, shortListN)
	// Function to toggle between limited and full list and bios
	function toggleShowAll() {
		showAll = !showAll
		expandAllBios = showAll
	}

	// Milestone goals for signatures
	const milestones = [2000, 2500, 3000, 4000, 5000, 10000, 15000, 20000, 25000, 30000]
	// Find the next milestone goal
	const nextGoal = milestones.find((goal) => totalCount < goal) || milestones[milestones.length - 1]
</script>

<PostMeta {title} {description} {date} />

<h1>{title}</h1>

<p class="intro">
	Esta declaración resume lo que los voluntarios y simpatizantes de PauseAI buscan a través de la
	Campaña PauseAI. Firma a continuación para sumar tu voz y fortalecer nuestra fuerza colectiva.
</p>

<blockquote class="statement">
	Hacemos un llamado a los gobiernos del mundo para que firmen un tratado internacional que
	implemente una pausa en el entrenamiento de los sistemas de IA general más poderosos, hasta que
	sepamos cómo desarrollarlos de manera segura y mantenerlos bajo control democrático.
</blockquote>

<!-- Signatories Counter and Goal -->
<div class="signatories-counter">
	<p>
		Hemos recolectado {totalCount} firmas hasta ahora. ¡Ayúdanos a alcanzar nuestra próxima meta de {nextGoal}!
	</p>
</div>

<TallyEmbed formId="q4GG7k" />

<div class="signatories-header">
	<h2>Firmas ({totalCount})</h2>
	<button class="expand-all" on:click={toggleShowAll} aria-label="Expandir todas las firmas">
		{showAll ? 'Contraer todo' : 'Expandir todo'}
	</button>
</div>

<section data-pagefind-ignore>
	{#if visibleSignatories.length === 0}
		<p>No se encontraron firmas</p>
	{/if}
	<ul class="signatories">
		{#each visibleSignatories as { name, country, bio }}
			<Signatory {name} {country} {bio} {expandAllBios} />
		{/each}
	</ul>

	<!-- Button to toggle between limited and full list -->
	<button on:click={toggleShowAll}>
		{showAll ? 'Mostrar menos' : 'Mostrar todas las firmas'}
	</button>
</section>

<style>
	/* Style for the intro paragraph */
	.intro {
		margin: 1rem auto 1.5rem auto;
		font-size: 1.2rem;
		line-height: 1.75;
		color: var(--text);
		font-weight: 200;
		text-align: left;
		max-width: 800px;
	}

	/* Style for the statement */
	.statement {
		margin: 1rem 0;
		padding: 0.7rem 1.8rem;
		font-weight: normal;
		border-left: 4px solid var(--brand);
		background-color: var(--text-subtle);
		font-size: 1rem;
		line-height: 1.8;
		color: var(--text);
	}

	@media (min-width: 600px) {
		.statement {
			font-size: 1.5rem;
		}
	}

	/* Style for the signatories counter */
	.signatories-counter {
		font-family: 'Arial', sans-serif;
		margin: 2rem 0;
		text-align: center;
		font-size: 1.2rem;
		/*border: 1px solid #ccc;
		padding: 1rem;
		background-color: #fff;
		border-radius: 8px;
		color: #444;*/
	}

	.signatories-counter p {
		margin: 0;
		font-weight: bold;
	}
	.signatories {
		display: grid;
		gap: 1rem;
	}

	button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: var(--brand);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: var(--brand-dark);
	}

	.signatories-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.expand-all {
		margin-left: 1rem;
		padding: 0.4rem 1rem;
		background-color: var(--brand);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		float: right;
	}
	.expand-all:hover {
		background-color: var(--brand-dark);
	}
</style>
