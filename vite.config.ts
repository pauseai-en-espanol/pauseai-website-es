import adapter from '@sveltejs/adapter-node'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import dotenv from 'dotenv'
import { FontaineTransform } from 'fontaine'
import fs from 'fs'
import { mdsvex, type MdsvexOptions } from 'mdsvex'
import { fileURLToPath } from 'node:url'
import path from 'path'
import discardDuplicates from 'postcss-discard-duplicates'
import rehypeSlug from 'rehype-slug'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkHeadingId from 'remark-heading-id'
import remarkToc from 'remark-toc'
import type { Warning } from 'svelte/compiler'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import remarkCollectImages from './plugins/remark-collect-images.js'
import { withPagefindIndex } from './scripts/create-pagefind-index'
import { imageFormats, imageWidths, metaImageWidth, imageQuality } from './src/lib/image-config'
import { MARKDOWN_L10NS } from './src/lib/l10n'
import inlangSettings from './project.inlang/settings.json' with { type: 'json' }

const mdsvexOptions: MdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: fileURLToPath(new URL('./src/mdsvex.svelte', import.meta.url))
	},
	// mdsvex's plugin types predate the unified version these plugins are written against
	remarkPlugins: [
		remarkCollectImages,
		[remarkToc, { tight: true }],
		remarkHeadingId
	] as unknown as MdsvexOptions['remarkPlugins'],
	rehypePlugins: [rehypeUnwrapImages, rehypeSlug] as unknown as MdsvexOptions['rehypePlugins']
}

const skipWarnings: [string, ((warning: Warning) => boolean)?][] = [
	['a11y_missing_attribute', (warning) => warning.message.includes('title')], // Skip warnings about missing title attributes on iframes
	['a11y_no_noninteractive_tabindex'] // Skip warnings about tabindex on non-interactive elements (like iframes)
]

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
			// Additional imagetools instance: the `?picture` shorthand returns a JS
			// object ({ sources, img }) for rendering a <picture> tag with avif +
			// webp <source>s and a jpeg/png fallback (png when alpha is present).
			// Default widths match NetlifyImage's defaults for consistent srcset sizing.
			imagetools({
				defaultDirectives: (url) => {
					if (url.searchParams.has('picture')) {
						return new URLSearchParams({
							as: 'picture',
							format: imageFormats.join(';'),
							w: imageWidths.join(';')
						})
					}
					if (url.searchParams.has('meta')) {
						return new URLSearchParams({
							url: 'true',
							w: String(metaImageWidth),
							format: 'jpg',
							quality: String(imageQuality)
						})
					}
					return new URLSearchParams()
				}
			}),
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
			sveltekit({
				extensions: ['.svelte', '.md'],
				preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
				// Custom warning handler to selectively filter out specific a11y warnings
				onwarn(warning, handler) {
					// Skip specific accessibility warnings
					for (const [code, filter] of skipWarnings) {
						if (warning.code === code && (!filter || filter(warning))) {
							return
						}
					}
					// Call the default handler for all other warnings
					handler(warning)
				},
				adapter: withPagefindIndex(
					adapter({
						precompress: true
					})
				),
				alias: {
					// SvelteKit 3 replaced $lib with #lib; keeping $lib leaves upstream merges conflict-free
					$lib: 'src/lib',
					$assets: 'src/assets',
					$api: 'src/routes/api'
				},
				prerender: {
					// Allows dead links to be rendered
					handleHttpError: 'warn',
					// Handle missing anchor IDs by warning instead of failing
					handleMissingId: 'warn',
					entries: ['*', ...inlangSettings.locales.map((locale) => `/${locale}` as const)]
				},
				experimental: {
					remoteFunctions: true
				}
			})
		]
	}
})
