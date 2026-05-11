---
title: Únete a PauseAI
description: Regístrate para unirte al movimiento PauseAI
---

<!-- end of frontmatter metadata, dashes above need to stay -->

<script>
    import TallyEmbed from '$lib/components/TallyEmbed.svelte'
    import NewsletterSignup from '$lib/components/NewsletterSignup.svelte'
    import CollagenSignup from '$lib/components/CollagenSignup.svelte'

    let newsletterEmail = ''
    let userHasUid = false
    let subscribeEmail = ''
</script>

<<<<<<< HEAD
Este es un momento crítico.
El rápido avance de la inteligencia artificial representa uno de los cambios tecnológicos más trascendentales y peligrosos de la historia.
Exigimos que los líderes políticos y las empresas detengan el desarrollo de la inteligencia artificial general (AGI) hasta que se establezcan acuerdos internacionales de seguridad.
Únete a nuestra red global que aboga por la supervisión democrática de la inteligencia artificial.
=======
<CollagenSignup bind:newsletterEmail bind:userHasUid bind:subscribeEmail />

This is our nuclear moment.
Rapid AI advancement represents one of history's most consequential and dangerous technological shifts.
We demand that politicians and companies pause AGI development until international safety agreements are established.
Join our global network standing for democratic oversight of AI.
>>>>>>> upstream/main

PauseAI Global une a ciudadanos preocupados —científicos, padres, estudiantes, trabajadores y líderes comunitarios— que creen que las tecnologías transformadoras requieren la participación y el control público antes de progresar más allá de nuestra capacidad para gestionarlas.
Ya sea que puedas dedicar 5 minutos (compartiendo publicaciones), una hora (repartiendo folletos, escribiendo cartas), 5 horas (protestas, reuniones con políticos) o 5 días a la semana (desarrollo de estrategias), tu voz es importante.
Después de registrarte, únete a nuestra sesión de incorporación en línea o local para conocer las acciones actuales y cómo puedes participar.

<TallyEmbed formId="wbGvKe" />

<<<<<<< HEAD
## Mantente informado {#stay-updated}
=======
## After signing up

Join one of our Member Community Welcome Meetings, or a local social event to find out more about PauseAI’s community: [Events](/communities#events).
If you want to get kick-started into action straight away, check out our [list of them](/action).

## Stay Updated
>>>>>>> upstream/main

<NewsletterSignup bind:email={newsletterEmail} />

{#if userHasUid && subscribeEmail}

<p><em>Consider becoming an active PauseAI member using the form above!</em></p>
{/if}
