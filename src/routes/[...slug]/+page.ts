import { error } from '@sveltejs/kit'
import { getLocale } from '$lib/paraglide/runtime'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
	depends('paraglide:lang')
	const slug = params.slug || ''
	try {
		const locale = getLocale()
		const { default: content, metadata: meta = {} } = await importMarkdown(locale, slug)

		return {
			content,
			meta,
			slug
		}
	} catch {
		throw error(404, `Could not find ${slug}`)
	}
}

const posts = import.meta.glob('../../posts/**/*.md')

async function importMarkdown(locale: string, slug: string) {
	const postPath = `../../posts/${slug}.md`

	if (posts[postPath]) {
		return await posts[postPath]()
	}

	if (import.meta.env.DEV) {
		return {
			default: `## Couldn't import content!\n(This is only tolerated in development mode.)`
		}
	}

	throw new Error(`Could not find ${slug}`)
}
