import type { Locale } from '$lib/paraglide/runtime.js'

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
	}
}

declare module '*.md' {
	import type { SvelteComponent } from 'svelte'

	export default class Comp extends SvelteComponent {
		$$prop_def: Record<string, never>
	}
	export const metadata: Record<string, unknown>
}
