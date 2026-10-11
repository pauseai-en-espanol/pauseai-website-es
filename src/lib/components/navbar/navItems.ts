export interface NavItem {
	label: string
	href?: string
	/** Link points outside the site; skip locale rewriting and open in a new tab. */
	external?: boolean
	/** Render as a call-to-action (brand-coloured) link or dropdown trigger. */
	c2a?: boolean
	/** Show a leading mail icon; the newsletter / updates entry. */
	mail?: boolean
	/** Sub-items shown in a dropdown (desktop) / accordion (mobile). */
	children?: NavItem[]
}

/**
 * The top navigation menu. This fork is Spanish-only, so labels are plain
 * strings (as in header.svelte) rather than localized message getters.
 */
export function getNavItems(): NavItem[] {
	return [
		{ label: 'Nosotros', href: '/nosotros' },
		{
			label: 'El debate',
			children: [
				{ label: 'La pausa', href: '/pausa' },
				{ label: 'IA con ñ', href: '/debate' }
			]
		},
		{ label: 'Riesgos', href: '/riesgos' },
		{ label: 'Noticias', href: 'https://pauseaispanish.substack.com', external: true, mail: true },
		{
			label: 'Más info',
			children: [
				// Served by nginx next to this app, not by SvelteKit, so it must be a
				// full page load rather than a client-side navigation.
				{ label: 'Presentaciones', href: 'https://pauseai.es/presentaciones/', external: true },
				{ label: 'Podcast', href: 'https://www.youtube.com/@pauseai-es', external: true }
			]
		},
		{
			label: 'Actúa',
			c2a: true,
			children: [
				{ label: 'Únete', href: '/inscripcion' },
				{ label: 'Eventos', href: 'https://lu.ma/pauseai-es', external: true }
				// TODO: add 'Grupos locales' once that page exists.
			]
		}
	]
}
