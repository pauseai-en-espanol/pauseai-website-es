<script lang="ts">
	import Block from '$lib/components/Block.svelte'
	import LatestNews from '$lib/components/LatestNews.svelte'
	import UpcomingEvents from '$lib/components/UpcomingEvents.svelte'
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte'
	import PostMeta from '$lib/components/PostMeta.svelte'
	import PreloadFonts from '$lib/components/PreloadFonts.svelte'
	import QuotesCarousel from '$lib/components/QuotesCarousel.svelte'
	import PressLogos from '$lib/components/PressLogos.svelte'
	import Stats from '$lib/components/Stats.svelte'
	import robotoSlabLatin700 from '@fontsource/roboto-slab/files/roboto-slab-latin-700-normal.woff2'

	const title = 'Tenemos que pausar la IA'
	const description =
		'Nos arriesgamos a la extinción de la humanidad. Tenemos que pausar el desarrollo de IA, ahora mismo.'
</script>

<PreloadFonts urls={[robotoSlabLatin700]} />

<PostMeta {title} {description} />
<!-- The Hero image is in `+layout.svelte` -->
<div style="height: 4rem;"></div>

<LatestNews />
<div class="divider"></div>
<UpcomingEvents />
<div class="divider"></div>
<QuotesCarousel />
<div class="divider"></div>

<Stats />
<div class="divider"></div>
<PressLogos />
<div class="divider"></div>
<section>
	<Block linkText="Conoce los riesgos" href="/riesgos">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- static content -->
		{#snippet title()}{@html 'Nos arriesgamos a <u>perder el control</u>'}{/snippet}
		La IA puede tener enormes beneficios, pero también podría erosionar nuestra democracia,
		desestabilizar nuestra economía y servir para crear potentes ciberarmas.
	</Block>
	<Block linkText="Lee la propuesta" href="/pausa">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- static content -->
		{#snippet title()}{@html 'Necesitamos una <u>pausa</u>'}{/snippet}
		Detener el desarrollo de los sistemas de IA general más potentes hasta que sepamos cómo
		hacerlos seguros. Esto tiene que ocurrir a nivel internacional, y tiene que ocurrir pronto.
	</Block>
	<Block linkText="Pasa a la acción" href="/action">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- static content -->
		{#snippet title()}{@html '<u>TÚ</u> PUEDES AYUDAR'}{/snippet}
		Demasiada poca gente está bien informada sobre los posibles riesgos de la IA. Informa a otras
		personas y ayuda a detener esta carrera al abismo.
	</Block>
</section>

<NewsletterSignup
	headingText="Suscríbete a nuestro boletín"
	descriptionText="Mantente al día sobre nuestros esfuerzos por una IA segura."
	placeholderText="Tu correo electrónico"
	buttonText="Suscribirse"
/>

<style>
	.divider {
		content: '';
		display: block;
		height: 0.1rem;
		margin: 5rem 0;
		background: var(--bg-subtle);
		width: 100%;
	}
</style>
