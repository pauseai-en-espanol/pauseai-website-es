<script lang="ts">
	import type { EventItem, EventsApiResponse } from '$api/events/+server'
	import { onMount } from 'svelte'

	let events = $state<EventItem[]>([])
	let loaded = $state(false)

	const dateFmt = new Intl.DateTimeFormat('es-ES', {
		weekday: 'short',
		day: 'numeric',
		month: 'short'
	})
	const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })

	function formatDate(iso: string): string {
		const d = new Date(iso)
		return `${dateFmt.format(d)} · ${timeFmt.format(d)}`
	}

	onMount(async () => {
		try {
			const res = await fetch('/api/events?limit=6')
			const data = (await res.json()) as EventsApiResponse
			events = data.events
		} catch (error) {
			console.error('Failed to load events:', error)
		} finally {
			loaded = true
		}
	})
</script>

<!-- Only render the section once we have events, so it doesn't flash an empty heading. -->
{#if !loaded || events.length > 0}
	<section class="events" data-pagefind-ignore>
		<h2 class="section-title toc-exclude">Próximos eventos</h2>

		{#if loaded}
			<ul class="events-grid">
				{#each events as event (event.apiId)}
					<li class="event-card">
						<a href={event.url} target="_blank" rel="noopener noreferrer">
							<span class="event-date">{formatDate(event.startAt)}</span>
							<span class="event-name">{event.name}</span>
							{#if event.location}
								<span class="event-location">
									{#if event.isVirtual}🖥️{:else}📍{/if}
									{event.location}
								</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
			<a class="events-all" href="https://lu.ma/pauseai-es" target="_blank" rel="noopener noreferrer">
				Ver el calendario completo →
			</a>
		{:else}
			<ul class="events-grid">
				{#each Array.from({ length: 3 }) as _unused}
					<li class="event-card skeleton"></li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

<style>
	.events {
		margin-block: 2rem;
	}
	.section-title {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}
	.events-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	@media (max-width: 850px) {
		.events-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 500px) {
		.events-grid {
			grid-template-columns: 1fr;
		}
	}
	.event-card {
		border: 1px solid var(--bg-subtle);
		border-radius: 8px;
		overflow: hidden;
		transition: border-color 0.15s;
	}
	.event-card:hover {
		border-color: var(--brand);
	}
	.event-card a {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1rem;
		text-decoration: none;
		color: var(--text);
		height: 100%;
	}
	.event-date {
		font-family: var(--font-heading);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.8rem;
		color: var(--brand);
	}
	.event-name {
		font-weight: 600;
		line-height: 1.25;
	}
	.event-location {
		font-size: 0.85rem;
		opacity: 0.75;
		margin-top: auto;
	}
	.events-all {
		display: inline-block;
		margin-top: 1.25rem;
		font-family: var(--font-heading);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.85rem;
		color: var(--brand);
		text-decoration: none;
	}
	.events-all:hover {
		text-decoration: underline;
	}
	.event-card.skeleton {
		height: 7rem;
		background: var(--bg-subtle);
		opacity: 0.5;
		animation: pulse 1.5s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
