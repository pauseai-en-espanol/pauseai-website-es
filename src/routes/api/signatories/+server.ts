import type { Signatory } from '$lib/types.js'
import { json } from '@sveltejs/kit'
import { generateCacheControlRecord } from '$lib/utils'
import type { RequestHandler } from './$types'

/** PauseAI's public list of verified signatories, already anonymised and sorted oldest first. */
const SIGNATORIES_URL = 'https://pauseai.info/api/signatories'

export type SignatoriesApiResponse = {
	signatories: Signatory[]
	totalCount: number
}

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	setHeaders(generateCacheControlRecord({ public: true, maxAge: 60 * 60 }))

	try {
		const res = await fetch(SIGNATORIES_URL)
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		const { signatories, totalCount } = (await res.json()) as SignatoriesApiResponse
		// A totalCount of 0 means pauseai.info couldn't read its list, and its rows are placeholders.
		const response: SignatoriesApiResponse = {
			signatories: totalCount === 0 ? [] : signatories,
			totalCount
		}
		return json(response)
	} catch (e) {
		console.error('Error fetching signatories:', e)

		// Same as an unavailable list from pauseai.info: the page says the list is unavailable.
		const response: SignatoriesApiResponse = { signatories: [], totalCount: 0 }
		return json(response)
	}
}
