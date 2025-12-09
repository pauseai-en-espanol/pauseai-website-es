<script lang="ts">
	/**
	 * ParallaxHero - Scroll-locked parallax scene
	 *
	 * Animation triggers as hero scrolls up. No scroll hijacking.
	 * The animation plays based on how far the hero has scrolled past the top.
	 */
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	type Direction = 'left' | 'right' | 'up' | 'down'

	interface Layer {
		src: string
		from?: Direction
		travel?: number
		zIndex?: number
		alt?: string
	}

	export let title: string = ''
	export let aspectRatio: string = '16/9'
	export let titleFade: [number, number] = [0, 0.5]
	export let layers: Layer[] = []

	let scene: HTMLElement
	let progress = 0

	function updateProgress() {
		if (!scene) return

		const rect = scene.getBoundingClientRect()

		// Animation based on scroll position relative to initial position
		// progress = 0 at initial scroll (scrollY = 0)
		// progress = 1 when hero top reaches viewport top (rect.top = 0)

		if (rect.top <= 0) {
			// Hero at or past top - animation complete
			progress = 1
		} else {
			// Calculate progress based on how close hero top is to viewport top
			// initialTop is where the hero starts when page loads (approx rect.top + scrollY at load)
			const initialTop = scene.offsetTop
			const currentScroll = window.scrollY
			const scrollNeeded = initialTop // scroll needed for hero top to reach viewport top

			if (scrollNeeded <= 0) {
				progress = 1
			} else {
				progress = Math.min(1, Math.max(0, currentScroll / scrollNeeded))
			}
		}
	}

	function getTransform(from: Direction, travel: number, prog: number): string {
		const offset = (1 - prog) * travel * 100

		switch (from) {
			case 'left':
				return `translate3d(${-offset}%, 0, 0)`
			case 'right':
				return `translate3d(${offset}%, 0, 0)`
			case 'up':
				return `translate3d(0, ${-offset}%, 0)`
			case 'down':
				return `translate3d(0, ${offset}%, 0)`
			default:
				return 'translate3d(0, 0, 0)'
		}
	}

	function getTitleOpacity(prog: number, fade: [number, number]): number {
		const [showAt, hideAt] = fade
		if (prog <= showAt) return 1
		if (prog >= hideAt) return 0
		return 1 - (prog - showAt) / (hideAt - showAt)
	}

	onMount(() => {
		if (!browser) return

		updateProgress()
		window.addEventListener('scroll', updateProgress, { passive: true })

		return () => {
			window.removeEventListener('scroll', updateProgress)
		}
	})
</script>

<div class="parallax-scene" bind:this={scene} style="--aspect-ratio: {aspectRatio};">
	{#each layers as layer, i}
		{@const from = layer.from ?? 'left'}
		{@const travel = layer.travel ?? 1}
		{@const zIndex = layer.zIndex ?? i + 1}
		<div
			class="parallax-layer"
			style="
				z-index: {zIndex};
				transform: {getTransform(from, travel, progress)};
			"
		>
			<img src={layer.src} alt={layer.alt ?? ''} />
		</div>
	{/each}

	{#if title}
		{@const opacity = getTitleOpacity(progress, titleFade)}
		<div class="parallax-title" style="opacity: {opacity};" aria-hidden={opacity === 0}>
			<h1>{title}</h1>
		</div>
	{/if}
</div>

<style>
	.parallax-scene {
		position: relative;
		width: 100%;
		aspect-ratio: var(--aspect-ratio);
		overflow: hidden;
	}

	.parallax-layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.parallax-layer img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
	}

	.parallax-title {
		position: absolute;
		z-index: 100;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		will-change: opacity;
	}
</style>
