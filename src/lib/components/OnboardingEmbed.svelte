<script lang="ts">
	import { onMount } from 'svelte'

	interface Props {
		/** Prefills the form's country of residence. Left unset by default: this site
		 *  serves Spanish speakers in many countries, not one. */
		country?: string
		/** Background colour, so the embed blends into the host page. */
		bg?: string
		/** Language for the form's own copy. */
		locale?: string
		/** Height before the embed reports its own. */
		height?: number
	}

	let { country = '', bg = 'fff', locale = 'es', height = 900 }: Props = $props()

	// Null until the embed reports its own height, so the `height` prop stays
	// authoritative until then rather than being snapshotted once.
	let reported = $state<number | null>(null)
	const current = $derived(reported ?? height)
	let iframe: HTMLIFrameElement | undefined = $state()

	const params = $derived(
		new URLSearchParams({
			...(country && { country }),
			...(bg && { bg }),
			...(locale && { locale })
		})
	)
	// No trailing slash before the query: the slashed form 308-redirects, costing
	// every visitor a round-trip before the form loads.
	const src = $derived(`https://pauseai.info/embed/onboarding-form?${params}`)
	const cardBg = $derived(/^[0-9a-f]{3,8}$/i.test(bg) ? `#${bg}` : bg)

	// The form reports its rendered height on every step change; without this
	// listener the iframe keeps its initial height and later steps are cut off.
	onMount(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== 'https://pauseai.info') return
			if (event.source !== iframe?.contentWindow) return
			const h = event.data?.height
			if (typeof h === 'number' && Number.isFinite(h) && h > 0) reported = h
		}
		window.addEventListener('message', onMessage)
		return () => window.removeEventListener('message', onMessage)
	})
</script>

<div class="onboarding-embed" style="background-color: {cardBg};">
	<iframe
		bind:this={iframe}
		{src}
		title="Únete a PauseAI"
		referrerpolicy="no-referrer-when-downgrade"
		style="width: 100%; height: {current}px; border: 0;"
	></iframe>
</div>

<p class="onboarding-embed-fallback">
	¿No se carga el formulario? <a href="https://pauseai.info/join">Ábrelo en pauseai.info</a>.
</p>

<style>
	.onboarding-embed {
		margin: 2rem 0 0.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	.onboarding-embed-fallback {
		margin: 0 0 2rem;
		font-size: 0.875rem;
		text-align: center;
		opacity: 0.75;
	}
</style>
