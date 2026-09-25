export interface NavItem {
	label: string
	href?: string
	/** Link points outside the site; skip locale rewriting and open in a new tab. */
	external?: boolean
	/** Render as a call-to-action (brand-coloured) link. */
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
			label: 'Aprende',
			children: [
				{ label: 'Riesgos', href: '/riesgos' },
				{ label: 'La pausa', href: '/pausa' },
				{ label: 'IA con ñ', href: '/debate' },
				{ label: 'Preguntas frecuentes', href: '/faq' }
			]
		},
		{
			label: 'Comunidad',
			children: [
				{ label: 'Encuentra tu grupo local', href: '/communities' },
				{ label: 'Asiste a un evento', href: 'https://lu.ma/pauseai-es', external: true }
			]
		},
		{
			label: 'Participa',
			children: [
				{ label: 'Únete', href: '/inscripcion' },
				{ label: 'Crea un grupo local', href: '/national-groups' },
				{ label: 'Dona', href: '/donate' }
			]
		},
		{ label: 'Noticias', href: 'https://pauseaispanish.substack.com', external: true, mail: true },
		{ label: 'Únete', href: '/inscripcion', c2a: true }
	]
}
