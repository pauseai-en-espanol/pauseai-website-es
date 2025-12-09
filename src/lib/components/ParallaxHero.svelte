<script lang="ts">
	/**
	 * ParallaxHero - Scroll-locked parallax scene
	 *
	 * Implements scroll hijacking by pinning the scene while scrolling through
	 * a defined distance. Uses JS-based positioning to avoid parent overflow issues.
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
	export let scrollDistance: number = 1500

	let wrapper: HTMLElement
	let scene: HTMLElement
	let progress = 0

	// Layout state
	let state: 'start' | 'fixed' | 'end' = 'start'
	let rectWidth = 0
	let rectLeft = 0

	function updateProgress() {
		if (!wrapper) return

		const rect = wrapper.getBoundingClientRect()
		const top = rect.top

		// Capture dimensions for fixed positioning
		rectWidth = rect.width
		rectLeft = rect.left

		// Calculate progress
		// We start animating when the top of the wrapper hits the top of the viewport (top <= 0)
		const scrolled = -top
		progress = Math.min(1, Math.max(0, scrolled / scrollDistance))

		if (progress <= 0) {
			state = 'start'
		} else if (progress < 1) {
			state = 'fixed'
		} else {
			state = 'end'
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
		window.addEventListener('resize', updateProgress, { passive: true })

		return () => {
			window.removeEventListener('scroll', updateProgress)
			window.removeEventListener('resize', updateProgress)
		}
	})
</script>

<!-- The wrapper creates the scrollable space -->
<div
	class="parallax-wrapper"
	bind:this={wrapper}
	style="
		--aspect-ratio: {aspectRatio}; 
		padding-bottom: {scrollDistance}px;
	"
>
	<!-- Spacer to reserve the height of the hero in the document flow -->
	<div class="parallax-spacer"></div>

	<!-- The scene is what we pin/move -->
	<div
		class="parallax-scene"
		class:fixed={state === 'fixed'}
		class:end={state === 'end'}
		style="
			width: {state === 'fixed' ? `${rectWidth}px` : '100%'};
			left: {state === 'fixed' ? `${rectLeft}px` : 'auto'};
		"
	>
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
</div>

<style>
	.parallax-wrapper {
		position: relative;
		width: 100%;
		/* Height is determined by the spacer + padding-bottom */
	}

	.parallax-spacer {
		width: 100%;
		aspect-ratio: var(--aspect-ratio);
		pointer-events: none;
	}

	.parallax-scene {
		position: absolute;
		top: 0;
		aspect-ratio: var(--aspect-ratio);
		overflow: hidden;
		z-index: 10;
		will-change: transform, width, left;
	}

	.parallax-scene.fixed {
		position: fixed;
		top: 0;
		/* width and left are set via inline styles */
	}

	.parallax-scene.end {
		position: absolute;
		top: auto;
		bottom: 0;
		width: 100%;
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
		pointer-events: none;
	}
</style>
