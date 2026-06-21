import { Calendar } from '$lib/clients/luma'
import { generateCacheControlRecord } from '$lib/utils'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// PauseAI en español public Luma calendar (cal-WkYLEl4u2moAjGV from the
// calendar's manage URL). Override via env if the calendar changes.
const CALENDAR_API_ID = 'cal-WkYLEl4u2moAjGV'

export type EventItem = {
	apiId: string
	name: string
	/** Luma event URL */
	url: string
	/** Cover image URL */
	image?: string
	/** ISO start datetime */
	startAt: string
	/** ISO end datetime, if known */
	endAt?: string
	/** Human-readable location (city or "Online") */
	location?: string
	isVirtual: boolean
}

export type EventsApiResponse = {
	events: EventItem[]
}

async function getUpcomingEvents(limit: number): Promise<EventItem[]> {
	try {
		const data = await Calendar.getItems({
			calendarApiId: CALENDAR_API_ID,
			period: 'future',
			paginationLimit: limit
		})

		return data.entries
			.map((entry): EventItem => {
				const event = entry.event
				const geo = event.geo_address_info
				const isVirtual = event.location_type !== 'offline'
				return {
					apiId: event.api_id,
					name: event.name,
					// Luma returns event.url as a bare slug (e.g. "d7vlb6o5").
					url: /^https?:\/\//.test(event.url) ? event.url : `https://lu.ma/${event.url}`,
					image: event.cover_url || undefined,
					startAt: new Date(event.start_at).toISOString(),
					endAt: event.end_at ? new Date(event.end_at).toISOString() : undefined,
					location: isVirtual ? 'En línea' : (geo?.city ?? geo?.full_address ?? undefined),
					isVirtual
				}
			})
			.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
	} catch (error) {
		console.error('Failed to fetch Luma calendar:', error)
		return []
	}
}

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const limit = Math.max(1, Math.min(20, parseInt(url.searchParams.get('limit') || '6', 10)))
	const events = await getUpcomingEvents(limit)

	setHeaders(generateCacheControlRecord({ public: true, maxAge: 60 * 30 }))
	return json({ events } satisfies EventsApiResponse)
}
