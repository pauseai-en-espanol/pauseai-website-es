import { error } from '@sveltejs/kit'
import type { PageLoad, EntryGenerator } from './$types'

export const load: PageLoad = async ({ params }) => {
	const { slug } = params

	try {
		// Import all markdown files to find the one with matching slug
		const modules = import.meta.glob('/src/posts/riesgos/*.md', { eager: true })

		let matchedModule: any = null
		let id: number | null = null

		for (const path in modules) {
			const module = modules[path] as any
			const metadata = module.metadata || {}

			// Derive slug from filename if not in metadata
			const filename = path.split('/').pop()?.replace('.md', '') || ''
			const effectiveSlug = metadata.slug || filename

			// Check if slug matches
			if (effectiveSlug === slug) {
				matchedModule = module
				// Extract id from filename if possible
				const match = path.match(/dia-(\d+)\.md$/)
				if (match) {
					id = parseInt(match[1], 10)
				}
				break
			}
		}

		if (!matchedModule) {
			throw error(404, `No se encontró el riesgo: ${slug}`)
		}

		const metadata = matchedModule.metadata || {}

		return {
			id,
			title: metadata.title || `Riesgo ${id}`,
			brief: metadata.brief || '',
			slug: metadata.slug || slug,
			date: metadata.date,
			image: metadata.image,
			hideTitle: metadata.hideTitle,
			content: matchedModule.default
		}
	} catch (e: any) {
		if (e.status) throw e // Re-throw SvelteKit errors
		throw error(404, `No se pudo cargar el riesgo: ${slug}`)
	}
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
