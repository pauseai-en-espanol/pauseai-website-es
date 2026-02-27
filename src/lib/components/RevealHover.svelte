<script lang="ts">
	/**
	 * RevealHover - Two-layer image reveal effect
	 *
	 * Top image covers a hidden image underneath. Hovering or touching
	 * creates a soft-edged spotlight that reveals the hidden layer.
	 * Fades back when interaction ends.
	 */
	import { onDestroy } from 'svelte'
	import { browser } from '$app/environment'

	export let title: string = ''
	/** Image shown on top (the cover) */
	export let topImage: string = ''
	/** Image hidden underneath (revealed on hover/touch) */
	export let bottomImage: string = ''
	/** Reveal radius as % of the component's smaller dimension */
	export let revealSize: number = 30
	/** Alt text for top image */
	export let topAlt: string = ''
	/** Alt text for bottom image */
	export let bottomAlt: string = ''

	/** How fast trail points shrink per frame (0-1, lower = longer trail) */
	export let trailDecay: number = 0.97

	interface TrailPoint {
		x: number
		y: number
		r: number
	}

	let container: HTMLElement
	let mx = 50
	let my = 50
	let currentR = 0
	let targetR = 0
	let animating = false
	let raf: number
	let trail: TrailPoint[] = []
	/** Suppress synthetic mouse events after touch */
	let touchActive = false

	function getRadiusPx(): number {
		if (!container) return 0
		const rect = container.getBoundingClientRect()
		return (revealSize / 100) * Math.min(rect.width, rect.height)
	}

	function onMove(cx: number, cy: number) {
		if (!container) return
		const rect = container.getBoundingClientRect()
		mx = ((cx - rect.left) / rect.width) * 100
		my = ((cy - rect.top) / rect.height) * 100
		targetR = getRadiusPx()
		if (!animating) {
			animating = true
			tick()
		}
	}

	function onLeave() {
		targetR = 0
	}

	function tick() {
		const diff = targetR - currentR
		const speed = diff > 0 ? 0.35 : 0.12
		currentR += diff * speed

		// Decay trail points
		for (let i = trail.length - 1; i >= 0; i--) {
			trail[i].r *= trailDecay
			if (trail[i].r < 1) trail.splice(i, 1)
		}

		// Drop a trail point at current cursor if reveal is active
		if (currentR > 5) {
			const last = trail[trail.length - 1]
			if (!last || Math.abs(last.x - mx) > 1.5 || Math.abs(last.y - my) > 1.5) {
				trail.push({ x: mx, y: my, r: currentR })
			}
		}

		// Trigger Svelte reactivity
		trail = trail

		// Stop only when everything has faded
		if (targetR === 0 && currentR < 0.5 && trail.length === 0) {
			currentR = 0
			animating = false
			return
		}

		raf = requestAnimationFrame(tick)
	}

	function grad(x: number, y: number, r: number): string {
		return `radial-gradient(circle ${r}px at ${x}% ${y}%, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 75%, black 100%)`
	}

	function handleMouseMove(e: MouseEvent) {
		if (touchActive) return
		onMove(e.clientX, e.clientY)
	}
	function handleMouseLeave() {
		if (touchActive) return
		onLeave()
	}
	function handleTouchStart(e: TouchEvent) {
		touchActive = true
		if (e.touches.length) onMove(e.touches[0].clientX, e.touches[0].clientY)
	}
	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length) onMove(e.touches[0].clientX, e.touches[0].clientY)
	}
	function handleTouchEnd() {
		onLeave()
		// Allow synthetic mouse events to be ignored for a short window
		setTimeout(() => {
			touchActive = false
		}, 400)
	}

	onDestroy(() => {
		if (browser && raf) cancelAnimationFrame(raf)
	})

	let maskStyle = ''
	$: {
		const grads: string[] = []
		if (currentR > 0) grads.push(grad(mx, my, currentR))
		for (const p of trail) grads.push(grad(p.x, p.y, p.r))

		if (grads.length === 0) {
			maskStyle = ''
		} else if (grads.length === 1) {
			maskStyle = `-webkit-mask-image: ${grads[0]}; mask-image: ${grads[0]};`
		} else {
			const joined = grads.join(', ')
			const comp = Array(grads.length - 1)
				.fill('intersect')
				.join(', ')
			const wComp = Array(grads.length - 1)
				.fill('source-in')
				.join(', ')
			maskStyle = `-webkit-mask-image: ${joined}; mask-image: ${joined}; mask-composite: ${comp}; -webkit-mask-composite: ${wComp};`
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="reveal-wrap"
	bind:this={container}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	on:touchcancel={handleTouchEnd}
>
	<!-- Sizing image: in flow so the container gets its height from the image -->
	{#if bottomImage}
		<img src={bottomImage} alt="" class="reveal-sizer" aria-hidden="true" />
	{/if}

	<!-- Bottom layer: hidden image (revealed on hover/touch) -->
	<div class="reveal-bottom">
		{#if bottomImage}
			<img src={bottomImage} alt={bottomAlt} class="reveal-img" />
		{/if}
	</div>

	<!-- Top layer: cover image + title, with mask hole -->
	<div class="reveal-top" style={maskStyle}>
		{#if topImage}
			<img src={topImage} alt={topAlt} class="reveal-img" />
		{/if}
		{#if title}
			<div class="reveal-title">
				<h1>{title}</h1>
			</div>
		{/if}
	</div>
</div>

<style>
	.reveal-wrap {
		position: relative;
		width: 100%;
		overflow: hidden;
		cursor: crosshair;
	}

	.reveal-bottom,
	.reveal-top {
		position: absolute;
		inset: 0;
	}

	.reveal-bottom {
		z-index: 1;
	}

	.reveal-top {
		z-index: 2;
	}

	.reveal-sizer {
		width: 100%;
		display: block;
		visibility: hidden;
	}

	.reveal-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.reveal-title {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		pointer-events: none;
	}

	.reveal-title h1 {
		color: white;
		text-shadow:
			0 4px 30px rgba(0, 0, 0, 0.8),
			0 0 10px rgba(0, 0, 0, 0.5);
		text-align: center;
		padding: 0 2rem;
		max-width: 80%;
	}
</style>
