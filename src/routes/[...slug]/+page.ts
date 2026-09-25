import { error } from '@sveltejs/kit'
import { getLocale } from '$lib/paraglide/runtime'
import type { PageLoad } from './$types'
import { importMarkdown } from './markdown'

export const load: PageLoad = async ({ params, depends, data: serverData }) => {
	depends('paraglide:lang')
	const slug = params.slug || ''
	try {
		const locale = getLocale()
		const { default: content, metadata: meta = {} } = await importMarkdown(locale, slug)

		return {
			...serverData,
			content,
			meta,
			slug
		}
	} catch {
		throw error(404, `Could not find ${slug}`)
	}
}
