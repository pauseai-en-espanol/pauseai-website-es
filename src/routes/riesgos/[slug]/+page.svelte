<script lang="ts">
	import PostMeta from '$lib/components/PostMeta.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PostMeta title={data.title} description={data.brief} date={data.date} />

<article>
	<a href="/riesgos">Volver a Riesgos</a>

	{#if !data.hideTitle}
		<hgroup>
			<h1>{data.title}</h1>
		</hgroup>
	{/if}

	<div class="prose">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;
		text-align: justify;
	}
</style>
