<script lang="ts">
	import type { GeoApiResponse } from '$api/geo/+server'
	import { browser } from '$app/environment'
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import Banner from '$lib/components/Banner.svelte'
	import Hero from '$lib/components/Hero.svelte'
	import NearbyEvent from '$lib/components/NearbyEvent.svelte'
	import PreloadFonts from '$lib/components/PreloadFonts.svelte'
	import SearchModal from '$lib/components/SearchModal.svelte'
	import Toc from '$lib/components/Toc.svelte'
	import { searchOpen } from '$lib/stores/searchModal'
	import { deLocalizeHref } from '$lib/paraglide/runtime'
	import '@fontsource/roboto-slab/300.css'
	import '@fontsource/roboto-slab/500.css'
	import '@fontsource/roboto-slab/700.css'
	import robotoSlabLatin300 from '@fontsource/roboto-slab/files/roboto-slab-latin-300-normal.woff2'
	import '@fontsource/saira-condensed/700.css'
	import sairaCondensedLatin700 from '@fontsource/saira-condensed/files/saira-condensed-latin-700-normal.woff2'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { Cookie, SetCookie } from '@remix-run/headers'
	import { onMount } from 'svelte'
	import { Toaster } from 'svelte-french-toast'
	import '../styles/print.css'
	import '../styles/styles.css'
	import Footer from './footer.svelte'
	import Header from './header.svelte'
	import PageTransition from './transition.svelte'
	import themeSelection from './theme-selection.js?raw'
	import hydrationAwareClick from './hydration-aware-click.js?raw'
	import bannerSelection from './banner-selection.js?raw'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
		children?: import('svelte').Snippet
	}

	let { data, children }: Props = $props()

	let eventFound: boolean = $state(false)
	let geoForNearbyEvent: GeoApiResponse | null = $state(null)
	let hero = $derived(deLocalizeHref(page.url.pathname) === '/')

	onMount(async () => {
		document.documentElement.removeAttribute('data-waiting')

		const searchString = window.location.search
		const response = await fetch('/api/geo' + searchString)
		if (!response.ok) return
		const geo = (await response.json()) as GeoApiResponse

		// Keep geo cookie in sync with actual location.
		// Re-run selectBanners if country changed or cookie not yet set.
		const geoCountryCookie = new Cookie(document.cookie).get('geo_country')

		// geo.country is an object { code: 'US' } from Netlify, SetCookie needs a string
		const countryString = (
			typeof geo?.country === 'object' ? geo?.country?.code : geo?.country
		) as string

		if (countryString && countryString !== geoCountryCookie) {
			document.cookie = new SetCookie({
				name: 'geo_country',
				value: countryString,
				path: '/',
				maxAge: 31536000,
				sameSite: 'Lax'
			}).toString() // 1 year
			window.selectBanners?.()
		}

		// Don't show NearbyEvent if a geo banner is active (geo banners take priority)
		if (!document.documentElement.dataset.isActiveBannerGeo) {
			geoForNearbyEvent = geo
		}
	})

	// NearbyEvent overrides the main banner
	$effect(() => {
		if (browser && eventFound) {
			delete document.documentElement.dataset.activeBanner
		}
	})

	// Track client-side navigations with Plausible.
	// Skip initial load (from === null) since the script auto-tracks it.
	afterNavigate(({ from }) => {
		if (from && typeof window !== 'undefined' && window.plausible) {
			window.plausible('pageview')
		}
	})

	function sanitizeScript(code: string) {
		return code
			.replaceAll(/\/\*[\s\S]*?\*\//g, '') // remove block comments
			.replaceAll(/\/\/[^"'`\n]*?$/gm, '') // remove line comments
			.replaceAll(/\n\s*(?=\n)/g, '') // remove empty lines
	}
</script>

<svelte:head>
	<script>
		// No active campaigns on the Spanish site right now. Leaving these
		// empty keeps banner-selection.js happy (it reads these globals).
		var mainBannerRules = []
		var campaignBannerRules = []
	</script>

	<!-- eslint-disable-next-line svelte/no-at-html-tags not vulnerable against XSS -->
	{@html `<${'script'}>${sanitizeScript(themeSelection)}</script>`}

	<!-- eslint-disable-next-line svelte/no-at-html-tags not vulnerable against XSS -->
	{@html `<${'script'}>${sanitizeScript(hydrationAwareClick)}</script>`}

	<!-- eslint-disable-next-line svelte/no-at-html-tags not vulnerable against XSS -->
	{@html `<${'script'}>${sanitizeScript(bannerSelection)}</script>`}
</svelte:head>

<PreloadFonts urls={[robotoSlabLatin300, sairaCondensedLatin700]} />

<h2 style="width: 0; height: 0; margin: 0; padding: 0; visibility: hidden;" data-pagefind-ignore>
	(Top)
</h2>

<div class="page-top" class:hero-page={hero}>
	<!-- Dev-only locale mismatch warning. No id when isDev, so not affected by banner orchestration CSS. -->
	{#if data.localeAlert}
		<Banner
			contrast={data.localeAlert.isDev}
			id={data.localeAlert.isDev ? undefined : 'locale-switch'}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags not vulnerable against XSS -->
			{@html data.localeAlert.message}
		</Banner>
	{/if}

	<NearbyEvent contrast={hero} bind:eventFound geo={geoForNearbyEvent} />

	{#if hero}
		<div class="hero-section">
			<Hero />
			<Header inverted />
		</div>
	{/if}
</div>

<div class="layout" class:hero-page={hero}>
	{#if !hero}
		<Header />
	{/if}

	<main>
		<PageTransition url={page.url.pathname}>
			{@render children?.()}
		</PageTransition>
	</main>

	<Footer />
</div>

<SearchModal bind:open={$searchOpen} />

<Toaster
	toastOptions={{
		style: 'background-color: var(--bg-subtle); color: var(--text)',
		iconTheme: {
			primary: 'var(--brand)',
			secondary: 'white'
		}
	}}
/>

{#if !['/', '/outcomes', '/pdoom', '/quotes', '/dear-sir-demis-2025'].includes(deLocalizeHref(page.url.pathname))}
	<Toc />
{/if}

<ProgressBar color="var(--brand)" />

<style>
	/* Hide all orchestrated banners by default.
	   Each Banner self-registers its reveal rule via <svelte:head>. */
	:global([data-banner-id]),
	:global([data-campaign-banner-id]) {
		display: none !important;
	}

	:global(:root) {
		--gutter-max: 3rem;
		--gutter-min: 0.5rem;
		--page-gutter: var(--gutter-max);
		/* Wider than --page-width: the centered hero nav needs room for the
		   (wordier) Spanish labels so they stay on a single row. */
		--nav-width: 56rem;
	}

	/* Linearly interpolate from gutter-max (at 600px) down to gutter-min */
	@media (max-width: 600px) {
		:global(:root) {
			--page-gutter: clamp(
				var(--gutter-min),
				calc(var(--gutter-min) + (100% - 600px + 2 * (var(--gutter-max) - var(--gutter-min))) / 2),
				var(--gutter-max)
			);
		}
	}

	.page-top.hero-page {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	.page-top.hero-page > :global(.banner) {
		flex-shrink: 0;
	}

	.page-top.hero-page .hero-section {
		flex: 1;
		min-height: var(--hero-min-height);
		display: flex;
		flex-direction: column;
	}

	.hero-section {
		position: relative;
	}

	.hero-section :global(nav) {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: min(var(--nav-width), 100% - 2 * var(--page-gutter));
		margin-inline: auto;
		z-index: 1;
	}

	.layout {
		height: 100%;
		position: relative;
		max-inline-size: var(--page-width);
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-auto-columns: 100%;
		margin-inline: auto;
		padding: 0 var(--page-gutter);
	}

	.layout.hero-page {
		grid-template-rows: 1fr auto;
	}

	main {
		padding-block: 1rem;
		margin-bottom: 5rem;
	}

	@media (max-width: 600px) {
		main {
			margin-bottom: 2rem;
		}
	}
</style>
