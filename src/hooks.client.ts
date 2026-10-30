import type { HandleClientError } from '@sveltejs/kit/hooks'

export const handleError: HandleClientError = ({ error, kind }) => {
	// SvelteKit 3 also passes errors thrown with error(...); keep their status and message
	if (kind === 'app') return
	console.error(error)
	return { message: 'An unexpected error occurred.' }
}
