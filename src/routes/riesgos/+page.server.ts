import type { PageServerLoad } from './$types'

export interface RiskArticle {
	id: number
	title: string
	cover: string
	gradient: string
	brief: string
	slug?: string
	content?: string
	isPlaceholder?: boolean
}

const TOTAL_RISKS = 3

export const load: PageServerLoad = async () => {
	// Load all risk markdown files
	const risks = await loadRiskArticles()

	return {
		risks
	}
}

async function loadRiskArticles(): Promise<RiskArticle[]> {
	// Import all markdown files from the riesgos directory
	const modules = import.meta.glob('/src/posts/riesgos/*.md', { eager: true })

	const risks: RiskArticle[] = []
	const usedIds = new Set<number>()

	for (const path in modules) {
		const module = modules[path] as any
		const metadata = module.metadata || {}

		if (metadata.hidden) continue

		let id = 0
		const match = path.match(/dia-(\d+)\.md$/)
		if (match) {
			id = parseInt(match[1], 10)
		} else if (metadata.id) {
			id = metadata.id
		} else {
			id = 1
		}

		if (usedIds.has(id)) {
			// simple collision handling: find next free id
			while (usedIds.has(id)) id++
		}
		usedIds.add(id)

		const filename = path.split('/').pop()?.replace('.md', '') || ''

		risks.push({
			id: id,
			title: metadata.title || `Riesgo ${id}`,
			brief: metadata.brief || '',
			cover: metadata.cover || '',
			gradient: metadata.gradient || '',
			slug: metadata.slug || filename
		})
	}

	// Sort by id
	risks.sort((a, b) => a.id - b.id)

	const FUTURE_RISKS: Record<number, string> = {}

	// Fill with placeholders
	for (let i = 1; i <= TOTAL_RISKS; i++) {
		if (!usedIds.has(i)) {
			risks.push({
				id: i,
				title: FUTURE_RISKS[i] || 'Próximamente',
				brief: '',
				gradient: '',
				cover: '',
				isPlaceholder: true
			})
			usedIds.add(i)
		}
	}

	// Sort again to ensure placeholders are in correct positions
	risks.sort((a, b) => a.id - b.id)

	return risks.slice(0, TOTAL_RISKS)
}
