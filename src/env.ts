import { defineEnvVars } from '@sveltejs/kit/env'

/** Unset in local development and wherever the feature reading it isn't used */
const optional = (value: string | undefined) => value

export const variables = defineEnvVars({
	AIRTABLE_API_KEY: { schema: optional },
	AIRTABLE_WRITE_API_KEY: { schema: optional },
	ANTHROPIC_API_KEY_FOR_WRITE: { schema: optional },
	CLOUDINARY_API_KEY: { schema: optional },
	CLOUDINARY_API_SECRET: { schema: optional },
	MAILERSEND_API_KEY: { schema: optional },
	OPENAI_KEY: { schema: optional },
	PUBLIC_CLOUDINARY_CLOUD_NAME: { schema: optional },
	PUBLIC_YOUTUBE_CHANNEL_ID: { schema: optional }
})
