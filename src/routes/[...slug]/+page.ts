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

type PostMetadata = {
	title?: string
	description?: string
	date?: string
	image?: string
	author?: string
	hideTitle?: boolean
}

type MarkdownModule = {
	default: import('svelte').ComponentType
	metadata?: PostMetadata
}

const posts = import.meta.glob<MarkdownModule>('../../posts/**/*.md')

async function importMarkdown(locale: string, slug: string): Promise<MarkdownModule> {
	const postPath = `../../posts/${slug}.md`

	if (posts[postPath]) {
		return await posts[postPath]()
	}

	if (import.meta.env.DEV) {
		return {
			default: (() => `## Couldn't import content!`) as unknown as import('svelte').ComponentType,
			metadata: {}
		}
	}

	throw new Error(`Could not find ${slug}`)
}
