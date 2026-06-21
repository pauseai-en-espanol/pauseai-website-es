import type { NewsItem } from '$lib/types'
import { generateCacheControlRecord } from '$lib/utils'
import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { PostsApiResponse } from '$api/posts/+server.js'
import type { RequestHandler } from './$types'

export type NewsApiResponse = {
	items: NewsItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

async function getInternalNews(localFetch: typeof fetch): Promise<NewsItem[]> {
	const posts = (await localFetch('/api/posts').then((res) => res.json())) as PostsApiResponse
	const items: NewsItem[] = []

	for (const post of posts) {
		if (post.news && post.date) {
			items.push({
				title: post.title ?? 'Untitled',
				subtitle: post.description || '',
				date: post.date,
				image: post.image,
				href: `/${post.slug}`,
				source: 'internal'
			})
		}
	}

	return items
}

async function getSubstackNews(): Promise<NewsItem[]> {
	try {
		const response = await fetch('https://pauseaispanish.substack.com/feed')
		const xml = await response.text()
		const items: NewsItem[] = []

		// Parse RSS items using regex (lightweight, no XML parser dependency)
		const itemRegex = /<item>([\s\S]*?)<\/item>/g
		let match

		while ((match = itemRegex.exec(xml)) !== null) {
			const itemXml = match[1]

			const title = extractCdata(itemXml, 'title') || extractTag(itemXml, 'title') || ''
			const description =
				extractCdata(itemXml, 'description') || extractTag(itemXml, 'description') || ''
			const link = extractTag(itemXml, 'link') || ''
			const pubDate = extractTag(itemXml, 'pubDate') || ''
			const enclosureMatch = itemXml.match(/<enclosure\s+url="([^"]*)"/)
			const image = enclosureMatch ? enclosureMatch[1] : undefined

			if (title && link) {
				items.push({
					title: decodeHtmlEntities(title),
					subtitle: decodeHtmlEntities(description),
					date: pubDate ? new Date(pubDate).toISOString() : '',
					image,
					href: link,
					source: 'substack'
				})
			}
		}

		return items
	} catch (error) {
		console.error('Failed to fetch Substack RSS feed:', error)
		return []
	}
}

// --- YouTube ----------------------------------------------------------------
// @pauseai-es channel. The Atom feed needs the UC… channel id, not the handle,
// so we resolve it once from the channel page and cache it. PUBLIC_YOUTUBE_
// CHANNEL_ID can be set to skip the lookup.
const YOUTUBE_HANDLE = '@pauseai-es'
let cachedChannelId: string | null = null

async function resolveYoutubeChannelId(): Promise<string | null> {
	if (cachedChannelId) return cachedChannelId
	if (env.PUBLIC_YOUTUBE_CHANNEL_ID) {
		cachedChannelId = env.PUBLIC_YOUTUBE_CHANNEL_ID
		return cachedChannelId
	}
	try {
		const res = await fetch(`https://www.youtube.com/${YOUTUBE_HANDLE}`, {
			headers: {
				// Bypass the EU consent interstitial so the channel HTML is returned.
				Cookie: 'CONSENT=YES+1',
				'Accept-Language': 'es-ES,es;q=0.9',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
			}
		})
		const html = await res.text()
		const match =
			html.match(/"channelId":"(UC[0-9A-Za-z_-]{22})"/) ||
			html.match(/\/channel\/(UC[0-9A-Za-z_-]{22})/)
		cachedChannelId = match ? match[1] : null
		return cachedChannelId
	} catch (error) {
		console.error('Failed to resolve YouTube channel id:', error)
		return null
	}
}

async function getYoutubeNews(): Promise<NewsItem[]> {
	try {
		const channelId = await resolveYoutubeChannelId()
		if (!channelId) return []

		const response = await fetch(
			`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
		)
		const xml = await response.text()
		const items: NewsItem[] = []

		// YouTube uses Atom: <entry>…</entry>, not RSS <item>.
		const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
		let match
		while ((match = entryRegex.exec(xml)) !== null) {
			const entry = match[1]
			const title = extractTag(entry, 'title') || ''
			const videoId = extractTag(entry, 'yt:videoId') || ''
			const published = extractTag(entry, 'published') || ''
			const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/)
			const link = linkMatch
				? linkMatch[1]
				: videoId
					? `https://www.youtube.com/watch?v=${videoId}`
					: ''
			// media:group > media:description / media:thumbnail
			const description = extractTag(entry, 'media:description') || ''
			const thumbMatch = entry.match(/<media:thumbnail[^>]*url="([^"]*)"/)
			const image = thumbMatch
				? thumbMatch[1]
				: videoId
					? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
					: undefined

			if (title && link) {
				items.push({
					title: decodeHtmlEntities(title),
					subtitle: decodeHtmlEntities(description).split('\n')[0].slice(0, 160),
					date: published ? new Date(published).toISOString() : '',
					image,
					href: link,
					outlet: 'YouTube',
					source: 'youtube'
				})
			}
		}

		return items
	} catch (error) {
		console.error('Failed to fetch YouTube feed:', error)
		return []
	}
}

function decodeHtmlEntities(text: string): string {
	return text
		.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
		.replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&')
}

function extractTag(xml: string, tag: string): string | null {
	const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))
	return match ? match[1] : null
}

function extractCdata(xml: string, tag: string): string | null {
	const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([^\\]]*?)\\]\\]></${tag}>`))
	return match ? match[1] : null
}

export const GET: RequestHandler = async ({ fetch, url, setHeaders }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
	const pageSize = Math.max(1, Math.min(12, parseInt(url.searchParams.get('pageSize') || '6', 10)))

	const [internal, substack, youtube] = await Promise.all([
		getInternalNews(fetch),
		getSubstackNews(),
		getYoutubeNews()
	])

	const allNews = [...internal, ...substack, ...youtube].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	)

	const total = allNews.length
	const totalPages = Math.ceil(total / pageSize)
	const start = (page - 1) * pageSize
	const items = allNews.slice(start, start + pageSize)

	const headersRecord = {
		...generateCacheControlRecord({ public: true, maxAge: 60 * 60 }),
		'Netlify-Vary': 'query'
	}
	setHeaders(headersRecord)
	return json({ items, total, page, pageSize, totalPages } satisfies NewsApiResponse)
}
