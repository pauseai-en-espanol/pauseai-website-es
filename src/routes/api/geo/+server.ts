import { generateCacheControlRecord } from '$lib/utils'
import { json } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import type { RequestHandler } from './$types'

export type GeoApiResponse = NonNullable<App.Platform['context']>['geo']

export const prerender = false

export const GET: RequestHandler = ({ platform, setHeaders, url }) => {
	const lat = url.searchParams.get('lat')
	const lon = url.searchParams.get('lon')
	const country = url.searchParams.get('country')

	if (lat != null && lon != null) {
		const geo: GeoApiResponse = {
			latitude: parseFloat(lat),
			longitude: parseFloat(lon),
			country: { code: country || 'US' }
		}
		setHeaders(generateCacheControlRecord({ private: true, maxAge: 60 * 60 }))
		return json(geo)
	}

	const geo: GeoApiResponse = platform?.context?.geo
	if (!geo) {
		console.warn('Skipping geo lookup, Platform not available in this environment')
		return new Response('Geo lookup is not available in this environment', {
			status: StatusCodes.NOT_IMPLEMENTED
		})
	}
	setHeaders(generateCacheControlRecord({ private: true, maxAge: 60 * 60 }))
	return json(geo)
}
