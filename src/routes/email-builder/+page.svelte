<script lang="ts">
	import PostMeta from '$lib/components/PostMeta.svelte'
	import Button from '$lib/components/Button.svelte'
	// Risks
	import Xrisk from './concerns/xrisk.svelte'
	/* import Bio from './concerns/bio.svelte' */
	import Cyber from './concerns/cyber.svelte'
	// Actions
	import Meeting from './actions/meeting.svelte'
	import Debate from './actions/debate.svelte'
	import Treaty from './actions/treaty.svelte'
	import Acknowledge from './actions/acknowledge.svelte'
	import { meta } from './meta'
	import * as clipboard from 'clipboard-polyfill'
	import toast from 'svelte-french-toast'
	import Link from '$lib/components/Link.svelte'
	import Card from '$lib/components/Card.svelte'
	import { type Component } from 'svelte'

	const { title, description, date } = meta

	const letterId = 'letter'

	function copyHTMLWithoutStyles() {
		var element = document.getElementById(letterId)
		var clonedElement = element?.cloneNode(true) as HTMLElement

		// Check for unreplaced placeholders
		const content = element?.textContent || ''
		const placeholders = content.match(/__[A-Z\s]+__/g)

		clipboard
			.write([
				new clipboard.ClipboardItem({
					'text/html': new Blob([clonedElement?.outerHTML], { type: 'text/html' })
				})
			])
			.then(() => {
				if (placeholders && placeholders.length > 0) {
					const uniquePlaceholders = [...new Set(placeholders)]
					toast.error(
						`¡Carta copiada! Pero aún falta reemplazar ${uniquePlaceholders.length} términos temporales: ${uniquePlaceholders.join(', ')}`,
						{
							duration: 5000
						}
					)
				} else {
					toast.success('¡Carta copiada al portapapeles!')
				}
			})
			.catch((err) => {
				window.alert(`Error al copiar: ${err}`)
			})
	}

	const concerns: Section[] = [
		{
			name: 'Riesgo existencial',
			section: Xrisk
		},
		{
			name: 'Riesgo de ciberseguridad',
			section: Cyber
		}
	]

	const actions: Section[] = [
		{
			name: 'Preparar tratado para la cumbre',
			section: Treaty
		},
		{
			name: 'Reconocer el riesgo existencial',
			section: Acknowledge
		},
		{
			name: 'Tener una reunión con usted',
			section: Meeting
		},
		{
			name: 'Organizar un debate',
			section: Debate
		}
	]

	let selectedAction = $state(actions[0])
	let selectedConcern = $state(concerns[0])

	type Section = {
		name: string
		section: Component
	}

	function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement
		const anchor = target.closest('a')

		if (anchor) {
			event.preventDefault()
			window.open(anchor.href, '_blank')
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const target = event.target as HTMLElement
			const anchor = target.closest('a')
			if (anchor) {
				event.preventDefault()
				window.open(anchor.href, '_blank')
			}
		}
	}
</script>

<PostMeta {title} {description} {date} />

<div class="header">
	<h1>{title}</h1>
	<em>{description}</em>
</div>

<h2>Por qué enviar un email es genial</h2>
<ul>
	<li>
		<b>Sales de tu burbuja.</b> Si hablas de los riesgos de la IA o de la pausa en un servidor de Discord
		o en Twitter, lo más probable es que les estés hablando a los ya convencidos. Con el correo, puedes
		llegar a personas que no leen sobre estos temas normalmente.
	</li>
	<li>
		<b>Es el medio de los profesionales.</b> Políticos, periodistas, lobistas: todos usan correos electrónicos.
		Si quieres que te tomen en serio, tú también deberías usarlo.
	</li>
	<li>
		<b>Hacer que el riesgo de la IA sea de público conocimiento es clave.</b> Necesitamos que todos
		sepan que todos los demás saben sobre el riesgo de la IA, para que sea de conocimiento común y
		la gente se sienta más cómoda hablando de ello. No sólo convencer a personas influyentes, como
		políticos, periodistas y lobistas. (Vea la explicación de Connor sobre por qué hacer que el
		riesgo de la IA sea de público conocimiento es súper importante
		<Link href="https://youtu.be/OUjnVeydhCM?t=1969">aquí</Link> y
		<Link href="https://youtu.be/1j--6JYRLVk?t=5716">aquí</Link>.)
	</li>
	<li>
		<b>Sin presión social.</b> Si publicas algo abiertamente, un político puede dudar en responder a
		un tema sobre el cual aún no ha tomado una decisión.
	</li>
	<li>
		<b>No mucha gente lo hace realmente.</b> Eso significa que tu correo electrónico destacará.
	</li>
</ul>

<h2>A quién enviárselo</h2>
<ul>
	<li>
		<b>Idealmente, a alguien que pueda asistir a la próxima <Link href="/summit">cumbre</Link>.</b> Muchos
		países asistirán a la próxima Cumbre de Seguridad de la IA. ¿Quién es probable que represente a su
		país? ¿Quizás un ministro de Asuntos Exteriores o de Ciencia?
	</li>
	<li>
		<b>Alguien que sea propenso a actuar.</b> ¿Hay algún político que esté a menudo al frente del debate
		sobre nuevos temas digitales o científicos? ¿Quizás incluso alguien que ya haya compartido inquietudes
		sobre la IA? ¿O alguien que simplemente sea bueno presentando temas nuevos y controversiales y convenciendo
		a los demás?
	</li>
	<li>
		<b>Alguien que te represente políticamente.</b> Quizás un político de un partido por el que
		votaste. <Link
			href="https://github.com/Campaign-for-AI-Safety-archive/.github/tree/main/email-templates#email-your-politician"
			>Encuentra su dirección de correo electrónico</Link
		>.
	</li>
</ul>

<h2>Elige una preocupación</h2>
<ul>
	<li>
		<b>¿Qué es lo que más te preocupa?</b> No tengas miedo de ser juzgado por tus inquietudes. El trabajo
		de los políticos es representarte, incluyendo las cosas que te preocupan.
	</li>
	<li>
		<b>Ten en cuenta a la persona</b> a la que escribes y lo que ya puede creer. Si estás escribiendo
		a alguien que ya ha trabajado en temas de TI y ciberseguridad, considera enfocarte en ese tema en
		particular.
	</li>
	<li>
		<b>Selecciona una:</b>
		{#each concerns as section}
			<button
				class={selectedConcern == section ? 'tag tag--selected' : 'tag'}
				onclick={() => (selectedConcern = section)}>{section.name}</button
			>&nbsp;
		{/each}
	</li>
</ul>

<h2>Elige una acción</h2>
<ul>
	<li>
		¿Qué quieres que haga el destinatario después de recibir tu correo? ¿Preparar para la cumbre,
		organizar un debate, tener una reunión? Al igual que con cada sección, puedes reemplazar el
		texto sugerido si tienes una mejor idea.
	</li>
	<li>
		<b>Selecciona una:</b>
		{#each actions as section}
			<button
				class={selectedAction == section ? 'tag tag--selected' : 'tag'}
				onclick={() => (selectedAction = section)}>{section.name}</button
			>&nbsp;
		{/each}
	</li>
</ul>

<h2>Últimos pasos</h2>
<p>
	Antes de enviar el correo electrónico, debes reemplazar manualmente los placeholders "__NOMBRE__",
	"__TEMA__", "__PAÍS__" y "__TU NOMBRE__". También puede ser eficaz personalizar aún más el
	mensaje. Aquí tienes algunos consejos:
</p>
<ul>
	<li>
		<b>Conoce a tu destinatario.</b> Infórmate sobre la persona a la que envías la carta. ¿En qué están
		trabajando? ¿Qué opinan sobre la IA? ¿Qué ha sucedido en su vida profesional las últimas semanas?
	</li>
	<li>
		<b>Comparte algo sobre ti.</b> ¿Por qué te importa la seguridad de la IA? ¿Por qué te tomaste el
		tiempo de enviar esta carta?
	</li>
	<li>
		<b>Hazlo noticioso.</b> La plantilla de correo no siempre está actualizada. Asegúrate de mencionar
		los avances recientes en políticas de IA (especialmente los locales).
	</li>
</ul>
<p>
	Para obtener más información, puedes echar un vistazo a nuestra página sobre <Link
		href="/writing-a-letter"
		>cómo escribir una carta o un correo electrónico a alguien en el poder</Link
	>.
</p>

<!-- eslint-disable svelte/no-restricted-html-elements -- 
 No link l10n needed, Link component messes up the rich text -->

<h2>Resultado</h2>
<p>Puedes editar el mensaje directamente en el navegador.</p>
<div>
	<Card className="letter">
		<div
			id={letterId}
			contenteditable="true"
			onclick={handleClick}
			onkeydown={handleKeydown}
			role="document"
			tabindex="-1"
		>
			<p>Estimado/a __NOMBRE__,</p>
			<p>
				En primer lugar, muchas gracias por todo lo que ha hecho por __TEMA__. Le escribo hoy para
				llamar su atención sobre un asunto en el que creo que __PAÍS__ y usted en particular pueden
				desempeñar un papel muy importante. El tema es la amenaza existencial de la inteligencia
				artificial.
			</p>

			<selectedConcern.section />

			<p>
				Los avances en el panorama de la IA han progresado mucho más rápido de lo previsto. En 2020,
				se <a
					href="https://www.metaculus.com/questions/3479/date-weakly-general-ai-is-publicly-known"
					>estimaba</a
				>
				que una IA superaría los exámenes de ingreso a la universidad para 2050. Este objetivo se logró
				en marzo de 2023. Ahora, la IA ya está escribiendo
				<a href="https://www.youtube.com/watch?t=1042&v=wUOjTR1511M&feature=youtu.be"
					>hasta el 90 %</a
				>
				del código en las empresas de IA. En algún momento, posiblemente en un futuro cercano, la IA
				podrá construir directamente IA más poderosas, lo que conducirá a un aumento rápido de las capacidades
				de la IA. Miles de expertos han
				<a href="https://futureoflife.org/open-letter/pause-giant-ai-experiments/"
					>pedido una pausa</a
				>
				en el desarrollo de la IA más avanzada, y también parece haber un amplio apoyo para frenar el
				desarrollo de la IA entre el público. Una
				<a
					href="https://www.vox.com/future-perfect/2023/9/19/23879648/americans-artificial-general-intelligence-ai-policy-poll"
					>encuesta</a
				>
				indica que el 63 % de los estadounidenses apoya regulaciones para evitar que las empresas de
				IA construyan IA superinteligente. Más de 100 000 personas (incluidos los investigadores de IA
				más citados) han firmado una
				<a href="https://superintelligence-statement.org/"
					>declaración sobre la prohibición del desarrollo de una superinteligencia</a
				>.
			</p>

			<p>
				Incluso entre los directores ejecutivos de las empresas de IA, hay un <a
					href="https://www.pbs.org/newshour/politics/watch-overwhelming-consensus-for-artificial-intelligence-regulation-musk-says-after-senate-tech-meeting"
					>“consenso abrumador”</a
				> de que la regulación es necesaria, pero parece que las empresas no están dispuestas a poner
				en peligro su posición competitiva deteniendo voluntariamente el desarrollo. Un gobierno tendría
				que imponer una pausa. Desafortunadamente, la dinámica de carrera no solo se aplica a las empresas:
				los países también tienen incentivos para no quedarse atrás en las capacidades de IA y priorizan
				el crecimiento sobre la seguridad. Estas dinámicas son la razón por la que necesitamos urgentemente
				una solución internacional. Necesitamos coordinación internacional, necesitamos que los políticos
				inicien negociaciones de tratados.
			</p>

			<selectedAction.section />

			<p>Atentamente,</p>

			<p>__TU NOMBRE__</p>
		</div>
	</Card>
</div>

<div class="actionBar">
	<Button onclick={() => copyHTMLWithoutStyles()}>Copiar</Button>
</div>

<style>
	ul {
		list-style: disc;
		margin-left: 2rem;
	}

	div :global(.letter) {
		/* Edit mouse cursor, indicate editable */
		cursor: text;
		/* make it lookt like a letter! */
		padding: 1rem;
		margin: 1rem;
		/* shadow */
		font-family: 'Times New Roman', Times, serif;
	}

	.actionBar {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		gap: 1rem;
		justify-content: end;
	}

	.tag {
		padding: 0.3rem 0.5rem;
		border-radius: 10px;
		border: var(--brand) 2px solid;
		background-color: var(--bg);

		color: var(--brand);
		cursor: pointer;
		font-size: 0.8rem;
		margin-bottom: 0.3rem;
	}
	.tag:hover {
		color: var(--brand-dark);
		border-color: var(--brand-dark);
	}

	.tag--selected {
		color: var(--bg);
		background-color: var(--brand);
	}

	.tag--selected:hover {
		background-color: var(--brand-dark);
		color: var(--bg);
	}
</style>
