<script lang="ts">
	import Link from '$lib/components/Link.svelte'
	import { COUNTRIES } from '$lib/countries'
	import { onMount, tick } from 'svelte'

	// Contract: https://github.com/PauseAI/pauseai-website/blob/main/docs/statement-signing-api.md
	const SIGN_URL = 'https://pauseai.info/api/statement/sign'
	// PauseAI's public key: the endpoint only accepts tokens from its own widget, and only on
	// hostnames PauseAI has added to it.
	const TURNSTILE_SITE_KEY = '0x4AAAAAAF6esahvQaB9M1wg'
	const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

	type TurnstileApi = {
		render: (el: HTMLElement, options: Record<string, unknown>) => string
		reset: (widgetId: string) => void
		remove: (widgetId: string) => void
	}
	type Field = 'name' | 'email' | 'country' | 'bio'
	type FieldProblem = 'required' | 'invalid' | 'too_long'
	type SignResponse = { ok?: boolean; error?: string; fields?: Record<string, string> }

	const FIELDS: Field[] = ['name', 'email', 'country', 'bio']
	const MAX_LENGTH = { name: 200, email: 254, bio: 2000 }
	const INVALID: Record<Field, string> = {
		name: 'Escribe tu nombre sin enlaces ni caracteres especiales.',
		email: 'Escribe una dirección de correo electrónico válida.',
		country: 'Elige un país de la lista.',
		bio: 'El texto contiene caracteres no permitidos.'
	}
	const GENERIC_ERROR = 'Algo ha salido mal. Vuelve a intentarlo.'
	// For refusals a retry won't fix: they mean this site's setup is wrong.
	const BROKEN_ERROR =
		'Ahora mismo no se puede firmar desde esta página. Escríbenos a contact@pauseai.info para avisarnos.'

	let name = $state('')
	let email = $state('')
	let country = $state('')
	let bio = $state('')
	let anonymous = $state(false)
	let honeypot = $state('')

	let signed = $state(false)
	let submitting = $state(false)
	let errorMessage = $state('')
	let fieldErrors = $state<Partial<Record<Field, string>>>({})
	let retryAt = $state(0)
	let now = $state(Date.now())
	const retrySeconds = $derived(Math.ceil((retryAt - now) / 1000))

	let turnstileToken = $state('')
	let turnstileFailed = $state(false)
	let turnstileContainer = $state<HTMLDivElement>()
	let turnstile: TurnstileApi | undefined
	let widgetId: string | undefined

	let errorSummary = $state<HTMLElement>()
	let thanks = $state<HTMLElement>()

	const rateLimited = $derived(retryAt > now)
	const waitingForTurnstile = $derived(!submitting && turnstileToken === '')
	const canSubmit = $derived(!submitting && !waitingForTurnstile && !rateLimited)

	function loadTurnstile(): Promise<TurnstileApi> {
		const existing = (window as unknown as { turnstile?: TurnstileApi }).turnstile
		if (existing) return Promise.resolve(existing)
		return new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.src = TURNSTILE_SCRIPT
			script.async = true
			script.onload = () => {
				const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile
				if (api) resolve(api)
				else reject(new Error('Turnstile script loaded without its API'))
			}
			script.onerror = () => reject(new Error('Turnstile script failed to load'))
			document.head.appendChild(script)
		})
	}

	onMount(() => {
		let cancelled = false
		loadTurnstile()
			.then((api) => {
				if (cancelled || !turnstileContainer) return
				turnstile = api
				widgetId = api.render(turnstileContainer, {
					sitekey: TURNSTILE_SITE_KEY,
					language: 'es',
					theme: 'auto',
					callback: (token: string) => {
						turnstileToken = token
						turnstileFailed = false
					},
					'error-callback': () => {
						turnstileToken = ''
						turnstileFailed = true
					},
					'expired-callback': () => {
						turnstileToken = ''
					}
				})
			})
			.catch(() => {
				turnstileFailed = true
			})
		const clock = setInterval(() => (now = Date.now()), 1000)
		return () => {
			cancelled = true
			clearInterval(clock)
			if (turnstile && widgetId) turnstile.remove(widgetId)
		}
	})

	function fieldMessage(field: Field, problem: FieldProblem): string {
		if (problem === 'required') return 'Este campo es obligatorio.'
		if (problem === 'too_long' && field !== 'country')
			return `El límite es de ${MAX_LENGTH[field]} caracteres.`
		return INVALID[field]
	}

	function errorFor(body: SignResponse) {
		switch (body.error) {
			case 'validation_failed': {
				const fields: Partial<Record<Field, string>> = {}
				for (const [field, problem] of Object.entries(body.fields ?? {})) {
					if ((FIELDS as string[]).includes(field))
						fields[field as Field] = fieldMessage(field as Field, problem as FieldProblem)
				}
				fieldErrors = fields
				return Object.keys(fields).length > 0 ? 'Revisa los campos marcados.' : GENERIC_ERROR
			}
			case 'turnstile_failed':
				return 'La verificación antispam ha fallado o ha caducado. Espera a que se complete de nuevo y vuelve a firmar.'
			case 'rate_limited':
				return 'Se han enviado demasiadas firmas desde tu conexión. Espera un poco y vuelve a intentarlo.'
			case 'save_failed':
				return 'No hemos podido guardar tu firma. Vuelve a intentarlo.'
			case 'signing_unavailable':
				return 'Ahora mismo no se puede firmar. Inténtalo más tarde o escribe a contact@pauseai.info.'
			case 'turnstile_unavailable':
				return 'No hemos podido completar la verificación antispam. Vuelve a intentarlo y, si el problema persiste, escribe a contact@pauseai.info.'
			case 'payload_too_large':
				return 'Tu texto es demasiado largo. Acórtalo y vuelve a firmar.'
			case 'origin_not_allowed':
			case 'unsupported_media_type':
			case 'invalid_json':
				return BROKEN_ERROR
			default:
				// No error code: the request failed, or the answer wasn't the endpoint's JSON (a CORS
				// refusal reaches us as a failed request).
				return body.error === undefined ? BROKEN_ERROR : GENERIC_ERROR
		}
	}

	async function focusFirstError() {
		await tick()
		const field = FIELDS.find((key) => fieldErrors[key])
		const target = field ? document.getElementById(`statement-${field}`) : errorSummary
		target?.focus()
	}

	async function sign(event: SubmitEvent) {
		event.preventDefault()
		if (!canSubmit) return
		submitting = true
		errorMessage = ''
		fieldErrors = {}

		let body: SignResponse = {}
		try {
			const response = await fetch(SIGN_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					country,
					bio,
					private: anonymous,
					turnstile_token: turnstileToken,
					language: 'es',
					honeypot
				})
			})
			if (response.status === 429) {
				const seconds = Number(response.headers.get('Retry-After'))
				retryAt = Date.now() + (Number.isFinite(seconds) && seconds > 0 ? seconds : 60) * 1000
			}
			body = (await response.json()) as SignResponse
		} catch {
			// A network failure, or a refusal that isn't JSON.
		}

		// Tokens are single use, whatever the answer.
		turnstileToken = ''
		if (turnstile && widgetId) turnstile.reset(widgetId)
		submitting = false

		if (body.ok) {
			signed = true
			await tick()
			thanks?.focus()
			return
		}
		errorMessage = errorFor(body)
		await focusFirstError()
	}
</script>

<section class="card" aria-labelledby="sign-heading">
	<h2 id="sign-heading" class="heading">Firma la declaración</h2>

	<!-- Always in the page, as a live region only announces changes to one it already knows. -->
	<div class="thanks" role="status" tabindex="-1" bind:this={thanks}>
		{#if signed}
			<div class="panel">
				<div class="icon" aria-hidden="true">✉</div>
				<h3 class="toc-exclude thanks-heading">¡Gracias por tu firma!</h3>
				<p class="verify">
					¡Revisa tu bandeja de entrada (y la carpeta de correo no deseado) para verificar tu
					dirección de correo electrónico!
				</p>
				<p>
					Cuando la verifiques, tu firma se añadirá a la lista. La página de confirmación está en
					inglés, en pauseai.info.
				</p>
				<p class="note">
					¿Ya habías firmado y quieres cambiar algo, por ejemplo, firmar de forma anónima? Escribe a
					<Link href="mailto:contact@pauseai.info">contact@pauseai.info</Link>, porque volver a
					firmar no cambia tu firma.
				</p>
			</div>
		{/if}
	</div>

	{#if !signed}
		<form onsubmit={sign}>
			<!-- Honeypot: real people leave this empty. -->
			<div class="honey" aria-hidden="true">
				<label for="statement-website">Sitio web</label>
				<input
					type="text"
					id="statement-website"
					name="website"
					tabindex="-1"
					autocomplete="off"
					bind:value={honeypot}
				/>
			</div>

			<div class="field">
				<label class="field-label" for="statement-name">Nombre completo *</label>
				<input
					type="text"
					id="statement-name"
					name="name"
					autocomplete="name"
					required
					maxlength={MAX_LENGTH.name}
					bind:value={name}
					aria-invalid={!!fieldErrors.name}
					aria-describedby={fieldErrors.name ? 'statement-name-error' : undefined}
				/>
				{#if fieldErrors.name}
					<p class="field-error" id="statement-name-error">{fieldErrors.name}</p>
				{/if}
			</div>

			<label class="checkbox">
				<input
					type="checkbox"
					name="private"
					bind:checked={anonymous}
					aria-describedby="statement-private-note"
				/>
				<span>Quiero firmar de forma anónima</span>
			</label>
			<p class="private-note" id="statement-private-note">
				Si firmas de forma anónima, se ocultará tu nombre, pero se publicarán tu país y lo que
				escribas abajo. En ese caso, no incluyas datos que puedan identificarte. Tu firma se envía a
				PauseAI Global, que publica la lista. Consulta nuestra
				<!-- New tabs, as leaving the page would lose what's been typed. -->
				<Link href="/privacy" target="_blank">política de privacidad</Link> y la
				<Link href="https://pauseai.info/privacy" target="_blank">de PauseAI Global</Link>.
			</p>

			<div class="field">
				<label class="field-label" for="statement-email">Correo electrónico *</label>
				<input
					type="email"
					id="statement-email"
					name="email"
					autocomplete="email"
					required
					maxlength={MAX_LENGTH.email}
					bind:value={email}
					aria-invalid={!!fieldErrors.email}
					aria-describedby={fieldErrors.email
						? 'statement-email-error statement-email-note'
						: 'statement-email-note'}
				/>
				<p class="field-note" id="statement-email-note">
					Te enviaremos un correo para verificar tu dirección. Tu dirección nunca se publica.
				</p>
				{#if fieldErrors.email}
					<p class="field-error" id="statement-email-error">{fieldErrors.email}</p>
				{/if}
			</div>

			<div class="field">
				<label class="field-label" for="statement-country">País de residencia *</label>
				<select
					id="statement-country"
					name="country"
					autocomplete="country-name"
					required
					bind:value={country}
					aria-invalid={!!fieldErrors.country}
					aria-describedby={fieldErrors.country ? 'statement-country-error' : undefined}
				>
					<option value="" disabled>Selecciona tu país</option>
					{#each COUNTRIES as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
				{#if fieldErrors.country}
					<p class="field-error" id="statement-country-error">{fieldErrors.country}</p>
				{/if}
			</div>

			<div class="field">
				<label class="field-label" for="statement-bio">
					Comparte con el mundo quién eres y por qué es importante para ti abordar los riesgos de la
					IA
				</label>
				<textarea
					id="statement-bio"
					name="bio"
					rows="4"
					maxlength={MAX_LENGTH.bio}
					bind:value={bio}
					aria-invalid={!!fieldErrors.bio}
					aria-describedby={fieldErrors.bio ? 'statement-bio-error' : undefined}></textarea>
				{#if fieldErrors.bio}
					<p class="field-error" id="statement-bio-error">{fieldErrors.bio}</p>
				{/if}
			</div>

			<div class="turnstile">
				<div bind:this={turnstileContainer}></div>
				<div role="alert">
					{#if turnstileFailed}
						<p class="turnstile-error">
							No se ha podido cargar la verificación antispam. Recarga la página e inténtalo de
							nuevo.
						</p>
					{/if}
				</div>
			</div>

			<!-- The field errors are repeated for screen readers, which can't see them highlighted. -->
			<div role="alert">
				{#if errorMessage}
					<p class="form-error" tabindex="-1" bind:this={errorSummary}>
						{errorMessage}
						{#each Object.entries(fieldErrors) as [field, fieldError] (field)}
							<span class="visually-hidden">{fieldError}</span>
						{/each}
					</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={!canSubmit}
				aria-describedby={waitingForTurnstile && !rateLimited && !turnstileFailed
					? 'statement-submit-hint'
					: undefined}>{submitting ? 'Enviando…' : 'Firmar'}</button
			>
			<div role="status">
				{#if rateLimited}
					<p class="submit-hint">
						Podrás volver a intentarlo en {retrySeconds}
						{retrySeconds === 1 ? 'segundo' : 'segundos'}.
					</p>
				{:else if waitingForTurnstile && !turnstileFailed}
					<p class="submit-hint" id="statement-submit-hint">
						Podrás firmar cuando se complete la verificación antispam.
					</p>
				{/if}
			</div>
		</form>
	{/if}
</section>

<style>
	.card {
		box-sizing: border-box;
		margin: 2rem auto;
		padding: 2.25rem;
		width: 100%;
		max-width: 800px;
		background-color: var(--bg-subtle);
		border-radius: 32px;
		box-shadow: 0 4px 20px rgba(var(--black-rgb), 0.1);
	}

	@media (max-width: 600px) {
		.card {
			padding: 1.5rem;
			border-radius: 24px;
		}
	}

	.heading {
		margin: 0 0 1.25rem;
		font-size: 1.5rem;
	}

	/* Focused from code to carry on after the form goes, never reached by keyboard. */
	.thanks:focus {
		outline: none;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		width: 100%;
		/* The global `form` rule caps at 30rem, which would leave the card's width empty. */
		max-width: none;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.field-label {
		margin-left: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.field input,
	.field select,
	.field textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.8rem 1.2rem;
		color: var(--text);
		font-family: var(--font-body);
		font-size: 1rem;
		background-color: var(--bg);
		border: 1px solid var(--brand-subtle);
		border-radius: 20px;
	}

	.field textarea {
		resize: vertical;
	}

	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		outline: 2px solid var(--brand);
		border-color: transparent;
	}

	.field [aria-invalid='true'] {
		border: 2px solid var(--lookup-error);
	}

	/* Honeypot: off screen, still there for the bots that fill every input. */
	.honey {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.checkbox {
		display: flex;
		/* Override the global `form label { flex-direction: column }`. */
		flex-direction: row;
		align-items: center;
		gap: 0.6rem;
		margin-left: 0.5rem;
		cursor: pointer;
	}

	.checkbox input {
		flex-shrink: 0;
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--brand);
	}

	.field-error,
	.form-error {
		margin: 0;
		color: var(--text);
		font-weight: 500;
	}

	.field-error {
		margin-left: 0.5rem;
		font-size: 0.9rem;
	}

	.field-error::before {
		content: '⚠ ';
	}

	.form-error {
		padding: 0.7rem 1rem;
		border-left: 4px solid var(--brand);
		background-color: var(--bg);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.field-note,
	.submit-hint,
	.private-note,
	.turnstile-error {
		margin: 0;
		font-size: 0.9rem;
	}

	.field-note {
		margin-left: 0.5rem;
	}

	/* Reads as part of the checkbox above, across the form's usual gap. */
	.private-note {
		margin-top: -0.6rem;
		margin-left: 0.5rem;
	}

	.turnstile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		/* The widget's height, so the form does not jump as it loads. */
		min-height: 65px;
	}

	.turnstile-error {
		text-align: center;
	}

	button {
		align-self: flex-start;
		padding: 0.8rem 3rem;
		color: white;
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: bold;
		background-color: var(--brand);
		border: none;
		border-radius: 50px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	button:hover:not(:disabled) {
		opacity: 0.9;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.panel {
		padding: 2rem 1.5rem;
		background-color: var(--bg);
		border-radius: 20px;
		text-align: center;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		margin: 0 auto 1rem;
		color: var(--bg);
		font-size: 2rem;
		background-color: var(--brand);
		border-radius: 50%;
	}

	.thanks-heading {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.6rem;
	}

	.panel p {
		max-width: 32rem;
		margin: 1rem auto 0;
	}

	.verify {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.note {
		font-size: 0.9rem;
	}
</style>
