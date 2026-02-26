import { redirect } from '@sveltejs/kit'

const REDIRECTS: Record<string, string> = {
	'/2025-feb': '/2025-february',
	'/collages/manual_bootstrap.jpg': '/api/images/collages/manual_bootstrap.jpg',
	'/selfie': '/sayno',
	'/people': '/about',
	'/about-us': '/about',
	'/act': '/action',
	'/actions': '/action',
	'/local': '/communities',
	'/local-communities': '/communities',
	'/local-chapters': '/communities',
	'/local-groups': '/communities',
	'/events': '/communities#events',
	'/groups': '/communities',
	'/map': '/communities',
	'/national': 'national-groups',
	'/national-communities': '/national-groups',
	'/national-chapters': '/national-groups',
	'/email': '/email-builder',
	'/dangers': '/risks',
	'/polls': '/polls-and-surveys',
	'/surveys': '/polls-and-surveys',
	'/stipends': '/volunteer-stipends',
	'/volunteer-vacancies': '/join#volunteer-vacancies',
	'/contact': '/contact-us',

	'/riesgos/secretismo': '/riesgos/la-carrera',

	// Spanish <-> English redirects
	// English -> Spanish
	'/about': '/nosotros',
	'/join': '/inscripcion',
	'/risks': '/riesgos',

	// Spanish -> English
	'/accion': '/action',
	'/comunidades': '/communities',
	'/donar': '/donate',
	'/eventos': '/events',
	'/preguntas-frecuentes': '/faq',
	'/aprender': '/learn',
	'/prensa': '/press',
	'/privacidad': '/privacy',
	'/propuesta': '/proposal',
	'/declaracion': '/statement',
	'/cumbre': '/summit',
	'/equipos': '/teams',
	'/urgencia': '/urgency',
	'/valores': '/values',
	'/vacantes': '/vacancies',
	'/riesgo-existencial': '/xrisk',
	'/plantilla': '/email-builder',
	'/plantilla-de-emails': '/email-builder',
	'/plantilla-de-correos': '/email-builder',
	'/plantilla-de-correos-electronicos': '/email-builder',
	'/constructor-de-emails': '/email-builder',
	'/constructor-de-correos': '/email-builder',
	'/constructor-de-correos-electronicos': '/email-builder'
}

export function handleRedirects(path: string) {
	const target = REDIRECTS[path]
	if (target) throw redirect(301, target)
}
