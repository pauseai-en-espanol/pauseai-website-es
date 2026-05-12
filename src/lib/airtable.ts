import { isDev, getDevContext } from '$lib/env'
import { env } from '$env/dynamic/private'

const AIRTABLE_API_KEY = env.AIRTABLE_API_KEY || ''
const AIRTABLE_WRITE_API_KEY = env.AIRTABLE_WRITE_API_KEY || ''

/** Fetch options for getting data from Airtable */
const OPTIONS = {
	method: 'GET',
	headers: {
		Authorization: `Bearer ${AIRTABLE_API_KEY}`,
		'Content-Type': 'application/json'
	}
}

export type AirtableRecord<T> = {
	id: string
	fields: T
}

type AirtableResponse<T> = {
	records: AirtableRecord<T>[]
	offset: number
}

/**
 * Fetches all pages from Airtable API (which is limited to 100 items per page)
 * @template T The type of the records' fields
 * @param customFetch The fetch function
 * @param url The Airtable API URL
 * @param fallbackData Optional data to return if the fetch fails (only used in development mode)
 * @returns All records from all pages, or fallbackData if in development mode and fetch fails
 */
export async function fetchAllPages<T = Record<string, unknown>>(
	customFetch: typeof fetch,
	url: string,
	fallbackData: AirtableRecord<T>[] = [],
	query: { filterByFormula?: string } = {}
): Promise<AirtableRecord<T>[]> {
	let allRecords: AirtableRecord<T>[] = []
	// https://airtable.com/developers/web/api/list-records#query-pagesize
	let offset

	// Check if we have the API key configured
	const apiKeyConfigured =
		OPTIONS.headers.Authorization &&
		OPTIONS.headers.Authorization !== 'Bearer undefined' &&
		OPTIONS.headers.Authorization !== 'Bearer '

	// If API key is not configured
	if (!apiKeyConfigured) {
		console.warn(`⚠️ Airtable API key not configured in ${getDevContext()}`)
		if (isDev()) {
			console.log('...but using fallback data in development mode.')
			return fallbackData
		} else {
			throw new Error('Airtable API key is required in production')
		}
	}

	try {
		do {
			const params = new URLSearchParams()
			if (offset) params.set('offset', String(offset))
			if (query.filterByFormula) params.set('filterByFormula', query.filterByFormula)
			const qs = params.toString()
			const fullUrl = qs ? `${url}?${qs}` : url
			if (isDev()) console.log('Fetching from URL:', fullUrl)

			const response = await customFetch(fullUrl, OPTIONS)
			if (!response.ok) {
				const errorText = await response.text()
				console.error(
					`${getDevContext()} Airtable API error:`,
					response.status,
					response.statusText,
					errorText
				)

				if (isDev() && fallbackData.length > 0) {
					console.warn('⚠️ Using fallback data in development mode due to Airtable API error')
					return fallbackData
				}
				throw new Error(
					`Failed to fetch data from Airtable: ${response.statusText}. Details: ${errorText}`
				)
			}

			const data: AirtableResponse<T> = await response.json()
			allRecords = allRecords.concat(data.records)
			offset = data.offset
		} while (offset)

		return allRecords
	} catch (error) {
		console.error('Error in fetchAllPages:', error)

		if (isDev() && fallbackData.length > 0) {
			console.warn('⚠️ Using fallback data in development mode due to error')
			return fallbackData
		}

		throw error
	}
}

/**
 * Creates a record in an Airtable table. Soft-fails (logs + swallows) so callers
 * don't crash the whole request if Airtable is unreachable.
 */
export async function createRecord(
	baseId: string,
	tableId: string,
	fields: Record<string, unknown>
): Promise<void> {
	if (!AIRTABLE_WRITE_API_KEY) {
		console.warn(`⚠️ Airtable write API key not configured. Skipping record creation.`)
		return
	}
	try {
		const url = `https://api.airtable.com/v0/${baseId}/${tableId}`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${AIRTABLE_WRITE_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ records: [{ fields }] })
		})
		if (!response.ok) {
			const errorText = await response.text()
			console.error(
				`Airtable createRecord ${tableId} error:`,
				response.status,
				response.statusText,
				errorText
			)
			return
		}
		console.log(`Successfully created record in Airtable table ${tableId}`)
	} catch (error) {
		console.error(`Error creating Airtable record in ${tableId}:`, error)
	}
}
