import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params

	try {
		const modules = import.meta.glob('/src/posts/riesgos/*.md', { eager: true })

		for (const path in modules) {
			const module = modules[path] as any
			const metadata = module.metadata || {}

			const filename = path.split('/').pop()?.replace('.md', '') || ''
			const effectiveSlug = metadata.slug || filename

			if (effectiveSlug === slug) {
				const match = path.match(/dia-(\d+)\.md$/)
				const id = match ? parseInt(match[1], 10) : null

				return {
					id,
					title: metadata.title || `Riesgo ${id}`,
					brief: metadata.brief || '',
					slug: effectiveSlug,
					date: metadata.date,
					image: metadata.image,
					hideTitle: metadata.hideTitle
				}
			}
		}

		throw error(404, `No se encontró el riesgo: ${slug}`)
	} catch (e: any) {
		if (e.status) throw e
		throw error(404, `No se pudo cargar el riesgo: ${slug}`)
	}
}
