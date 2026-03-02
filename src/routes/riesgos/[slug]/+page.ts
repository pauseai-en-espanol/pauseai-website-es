import { error } from '@sveltejs/kit'
import type { PageLoad, EntryGenerator } from './$types'

export const load: PageLoad = async ({ params }) => {
	const { slug } = params

	const modules = import.meta.glob('/src/posts/riesgos/*.md', { eager: true })

	for (const path in modules) {
		const module = modules[path] as any
		const metadata = module.metadata || {}

		const filename = path.split('/').pop()?.replace('.md', '') || ''
		const effectiveSlug = metadata.slug || filename

		if (effectiveSlug === slug) {
			return {
				content: module.default
			}
		}
	}

	throw error(404, `No se encontró el riesgo: ${slug}`)
}

export const entries: EntryGenerator = async () => {
	const modules = import.meta.glob('/src/posts/riesgos/*.md', { eager: true })
	const entries = []

	for (const path in modules) {
		const module = modules[path] as any
		const metadata = module.metadata || {}

		const filename = path.split('/').pop()?.replace('.md', '') || ''
		const effectiveSlug = metadata.slug || filename

		if (effectiveSlug) {
			entries.push({ slug: effectiveSlug })
		}
	}

	return entries
}
