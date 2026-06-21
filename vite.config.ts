import { enhancedImages } from '@sveltejs/enhanced-img'
import { sveltekit } from '@sveltejs/kit/vite'
import dotenv from 'dotenv'
import { FontaineTransform } from 'fontaine'
import fs from 'fs'
import path from 'path'
import discardDuplicates from 'postcss-discard-duplicates'
import { defineConfig } from 'vite'
import { MARKDOWN_L10NS } from './src/lib/l10n'
import inlangSettings from './project.inlang/settings.json' with { type: 'json' }

function getLocaleExcludePatterns(): RegExp[] {
	const md = path.resolve(MARKDOWN_L10NS)
	const reposLocales = fs.existsSync(md)
		? fs.readdirSync(md).filter((item) => fs.statSync(path.join(md, item)).isDirectory())
		: [] // the directory may not exist when running tests
	//  console.debug(`📁 Locale directories found in repos: ${reposLocales.join(', ')}`)
	const locales: readonly string[] = inlangSettings.locales
	const toExclude = reposLocales.filter((locale) => !locales.includes(locale))
	//  console.debug(`🚫 Excluding locales from build: [${toExclude.join(', ')]}`)

	return toExclude.map((locale) => {
		const pattern = new RegExp(`${MARKDOWN_L10NS}/${locale}/`)
		//      console.debug(`📋 Created exclude pattern: ${pattern}`)
		return pattern
	})
}

export default defineConfig(() => {
	// Guarantees server can see .env (on e.g. hot restart)
	dotenv.config({ override: true })

	return {
		server: {
			port: 37572,
			fs: {
				// Allow serving files from l10n-cage directory
				allow: [MARKDOWN_L10NS]
			}
		},

		css: {
			// Fontaine generates one fallback @font-face per src URL × unicode-range
			// subset, which are metric-identical copies; collapse them.
			postcss: {
				plugins: [discardDuplicates()]
			}
		},

		// Improve build performance and reduce log output
		build: {
			// Do not output sizes for every chunk
			reportCompressedSize: false,
			// Increase warning limit to reduce output
			chunkSizeWarningLimit: 5000,
			// Improve cache usage
			cssCodeSplit: true,
			sourcemap: true,
			// Exclude repos locale paths not in runtime.locales
			rollupOptions: {
				external: getLocaleExcludePatterns()
			}
		} as const,
		plugins: [
			enhancedImages(),
			// Generates "<font> fallback" @font-face rules whose metrics match the webfonts,
			// so text doesn't shift when they swap in (see --font-* variables in styles.css).
			// Each list needs fonts that resolve via src:local() across platforms —
			// Tinos/Arimo/Noto cover Linux, where Times/Georgia/Arial don't exist.
			FontaineTransform.vite({
				fallbacks: {
					'Roboto Slab': ['Georgia', 'Times New Roman', 'Tinos', 'Noto Serif'],
					'Saira Condensed': ['Arial', 'Arimo', 'Noto Sans']
				}
			}),
			sveltekit()
		]
	}
})
