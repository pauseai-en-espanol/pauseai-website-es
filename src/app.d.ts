import type { Locale } from '$lib/paraglide/runtime.js'
import type { Picture } from 'vite-imagetools'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			locale: Locale
		}
		// interface PageData {}
		interface Platform {
			context: {
				geo?: {
					country?: { code?: string; name?: string }
					subdivision?: { code?: string; name?: string }
					city?: string
					timezone?: string
					latitude?: number
					longitude?: number
				}
			}
		}
	}

	interface Twttr {
		ready: (callback: () => void) => void
		load: (element: HTMLElement) => void
	}

	interface Window {
		twttr?: Twttr
		plausible?: (event: string, options?: { props?: Record<string, string> }) => void
		selectBanners?: () => void
		applyTheme?: () => void
		/** Google Tag Manager queue (used by Banner.svelte for banner events) */
		dataLayer?: unknown[]
	}

	// vite-imagetools `?picture` shorthand — returns a Picture object
	// ({ sources, img }) for rendering a <picture> tag.
	declare module '*?picture' {
		const value: Picture
		export default value
	}
}

declare module '*.md' {
	import type { SvelteComponent } from 'svelte'

	export default class Comp extends SvelteComponent {
		$$prop_def: Record<string, never>
	}
	export const metadata: Record<string, unknown>
}
