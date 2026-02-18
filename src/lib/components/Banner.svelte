<script lang="ts">
	import X from 'lucide-svelte/icons/x'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { fade } from 'svelte/transition'

	export let contrast = false
	export let target: string | null = null
	export let id: string | null = null
	export let hidden = false
	export let fixed = false

	let bannerEl: HTMLDivElement
	let bannerHeight = 0

	function checkStoredState() {
		if (browser && id) {
			const storedState = localStorage.getItem(`banner_${id}_hidden`)
			if (storedState === 'true') {
				hidden = true
			}
		}
	}

	function closeClick() {
		hidden = true
		if (browser && id) {
			try {
				localStorage.setItem(`banner_${id}_hidden`, 'true')
			} catch (e) {
				console.error(e)
			}
		}
	}

	function updateHeight() {
		if (bannerEl) {
			bannerHeight = bannerEl.offsetHeight
		}
	}

	$: {
		const path = $page.url.pathname
		if (path === target) hidden = true
	}

	onMount(() => {
		checkStoredState()
		updateHeight()
	})
</script>

{#if !hidden}
	{#if fixed}
		<div class="banner fixed" bind:this={bannerEl} transition:fade={{ duration: 200 }}>
			<span class="content">
				<slot />
			</span>
			<button class="close" on:click={closeClick}>
				<X size="1.2em" />
				<span class="sr-only">Close</span>
			</button>
		</div>
		<div class="spacer" style="height: {bannerHeight}px" />
	{:else}
		<div class="banner" class:contrast transition:fade={{ duration: 200 }}>
			<span class="content">
				<slot />
			</span>
			<button class="close" on:click={closeClick}>
				<X size="1.2em" />
				<span class="sr-only">Close</span>
			</button>
		</div>
	{/if}
{/if}

<style>
	.banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		background-color: var(--brand);
		color: #1a1a1a;
		padding: 0.6em 1em;
		box-sizing: border-box;
		font-size: 0.9rem;
		font-weight: 500;
		letter-spacing: 0.01em;
	}

	.banner.fixed {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
	}

	.banner.contrast {
		color: white;
		background-color: black;
	}

	.banner.contrast .close:hover {
		color: var(--brand);
	}

	.banner.contrast .content::selection {
		color: black;
		background-color: var(--brand);
	}

	.banner :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.banner :global(a:hover) {
		text-decoration: underline;
	}

	.banner.contrast :global(a:hover),
	.banner.contrast .close:hover {
		color: var(--brand);
	}

	.content {
		text-align: center;
		margin-inline: 2.5rem;
	}

	@media (max-width: 40rem) {
		.content {
			margin-inline: 0.5rem 2rem;
		}
	}

	.close {
		position: absolute;
		top: 0;
		right: 0.5em;
		bottom: 0;
		display: flex;
		align-items: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5em;
		color: inherit;
		border-radius: 50%;
		opacity: 0.6;
		transition: opacity 0.15s;
	}

	.close:hover {
		opacity: 1;
	}

	.close:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
