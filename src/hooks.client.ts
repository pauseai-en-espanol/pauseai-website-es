import type { HandleClientError } from '@sveltejs/kit'

export const handleError: HandleClientError = ({ error }) => {
	console.error(error)
	return { message: 'An unexpected error occurred.' }
}
