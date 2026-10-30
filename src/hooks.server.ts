import { type Handle, type HandleServerError } from '@sveltejs/kit/hooks'
import { paraglideMiddleware } from '$lib/paraglide/server.js'

const handle: Handle = ({ event, resolve }) =>
	// event.request is read-only in SvelteKit 3; with only `es` there is no URL to delocalize anyway
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		})
	})

export { handle }

export const handleError: HandleServerError = ({ error, kind }) => {
	// SvelteKit 3 also passes errors thrown with error(...); keep their status and message
	if (kind === 'app') return
	console.error(error)
	return { message: 'An unexpected error occurred.' }
}
