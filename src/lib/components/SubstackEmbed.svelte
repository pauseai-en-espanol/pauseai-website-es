<script lang="ts">
	export let publicationUrl: string = 'https://pauseaispanish.substack.com'
	export let title: string = 'PauseAI Español'
	export let width: string = '100%'
	export let height: number = 320
	export let style: string = 'border:1px solid #EEE; background:white; border-radius: 8px;'
</script>

<div class="substack-embed">
	<iframe
		src="{publicationUrl}/embed"
		{width}
		{height}
		{style}
		frameborder="0"
		scrolling="no"
		{title}
	></iframe>
</div>

<style>
	.substack-embed {
		display: flex;
		justify-content: center;
		margin: var(--spacing-md) 0;
	}

	iframe {
		max-width: 480px;
	}
</style>
