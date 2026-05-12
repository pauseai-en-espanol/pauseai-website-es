import * as logic from './env'

/**
 * Server-side re-exports of env helpers. Fork's $lib/env reads process.env
 * directly inside each function, so no context object is needed.
 */
export const isDev = () => logic.isDev()
export const getDevContext = () => logic.getDevContext()
export const possiblyOverriddenLocales = (defaults: { locales: string[] }) =>
	logic.possiblyOverriddenLocales(defaults)
