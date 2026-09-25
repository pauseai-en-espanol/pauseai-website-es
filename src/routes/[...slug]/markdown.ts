import { dev } from '$app/environment'
import type { DescriptiveFrontmatterMeta } from '$lib/types'

export type MarkdownModule = {
	default: import('svelte').Component
	metadata: DescriptiveFrontmatterMeta
}

const posts = import.meta.glob<MarkdownModule>('../../posts/**/*.md')

/**
 * Imports the compiled markdown module for a slug (nested slugs allowed).
 *
 * Shared between `+page.server.ts` (to read `metadata._images` and resolve
 * Picture objects) and `+page.ts` (to render the content). This fork is
 * single-locale, so posts are read straight from `src/posts`.
 */
export async function importMarkdown(_locale: string, slug: string): Promise<MarkdownModule> {
	const load = posts[`../../posts/${slug}.md`]
	if (load) return await load()

	if (dev) {
		return {
			default: (() => `## Couldn't import content!`) as unknown as MarkdownModule['default'],
			metadata: {} as DescriptiveFrontmatterMeta
		}
	}

	throw new Error(`Could not find ${slug}`)
}
