import type { Adapter, Builder } from '@sveltejs/kit'
import fs from 'fs'
import * as pagefind from 'pagefind'
import path from 'path'
import type { Post } from '../src/lib/types'

const STATIC_PATH = 'static/pagefind'

async function createPagefindIndex(prerenderedPath: string) {
	const { index, errors } = await pagefind.createIndex({
		rootSelector: 'html',
		excludeSelectors: ['[data-pagefind-ignore]']
	})
	if (!index) throw new Error(errors.toString())

	// Index dynamic pages
	const posts: Post[] = JSON.parse(fs.readFileSync(`${prerenderedPath}/api/posts`, 'utf-8'))
	for (const post of posts) {
		if (fs.existsSync(`${prerenderedPath}/${post.slug}.html`)) continue
		await index.addCustomRecord({
			url: '/' + post.slug,
			content: post.title + '. ' + (post.description ?? ''),
			language: 'es',
			meta: {
				title: post.title ?? post.slug
			}
		})
	}

	await index.addDirectory({ path: prerenderedPath })

	await index.writeFiles({ outputPath: STATIC_PATH })

	await pagefind.close()
}

/**
 * adapter-node only serves the client files it lists while adapting, so the
 * index must be added to that list instead of being copied into build/ later.
 */
export function withPagefindIndex(adapter: Adapter): Adapter {
	return {
		...adapter,
		async adapt(builder) {
			builder.log.minor('Creating pagefind index')
			const prerenderedPath = builder.getBuildDirectory('pagefind-input')
			fs.rmSync(prerenderedPath, { force: true, recursive: true })
			builder.writePrerendered(prerenderedPath)
			await createPagefindIndex(prerenderedPath)
			fs.rmSync(prerenderedPath, { force: true, recursive: true })

			const builderWithIndex = Object.create(builder, {
				writeClient: {
					value: (dest: string) => {
						const files = builder.writeClient(dest)
						fs.cpSync(STATIC_PATH, `${dest}/pagefind`, { recursive: true })
						const indexFiles = fs
							.readdirSync(`${dest}/pagefind`, { recursive: true, withFileTypes: true })
							.filter((entry) => entry.isFile())
							.map((entry) => path.relative(dest, path.join(entry.parentPath, entry.name)))
						return [...new Set([...files, ...indexFiles])]
					}
				}
			}) as Builder
			await adapter.adapt(builderWithIndex)
		}
	}
}
