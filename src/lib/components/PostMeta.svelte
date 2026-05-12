<script lang="ts">
	import { url, title as siteName } from '$lib/config'
	export let title: string | undefined = undefined
	export let description: string | undefined = undefined
	export let date: string | undefined = undefined
	/** URL or relative path to cover / preview image */
	export let image: string | undefined = undefined
	$: _image = image || '/Cover.jpg'
	$: imageUrl = _image.startsWith('/') ? `${url}${_image}` : _image

	$: schemaOrgMarkup = {
		'@context': 'https://schema.org/',
		'@type': 'BlogPosting',
		headline: title,
		abstract: description,
		datePublished: date,
		image: {
			'@type': 'ImageObject',
			url: imageUrl
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:site_name" content={siteName} />
	{#if date}
		<meta property="article:published_time" content={date} />
	{/if}
	<meta name="twitter:title" content={title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:site" content="@pauseai_es" />
	<meta name="twitter:creator" content="@pauseai_es" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags (static content) @typescript-eslint/no-unused-expressions (false positive) -->
	{@html '<script type="application/ld+json">' + JSON.stringify(schemaOrgMarkup) + '</script>'}
</svelte:head>

<div style="display: none;" data-pagefind-index-attrs="data-content" data-content={description} />
