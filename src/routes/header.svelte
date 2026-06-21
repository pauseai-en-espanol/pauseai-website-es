<script lang="ts">
	import Navbar from '$lib/components/navbar/Navbar.svelte'
	import Navlink from '$lib/components/navbar/Navlink.svelte'
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte'
	import SearchIcon from '@lucide/svelte/icons/search'

	export let inverted = false
</script>

<Navbar {inverted}>
	<Navlink {inverted} first href="/nosotros">Nosotros</Navlink>
	<Navlink {inverted} href="/riesgos">Riesgos</Navlink>
	<Navlink {inverted} href="/pausa">La pausa</Navlink>
	<Navlink {inverted} href="/debate">IA con ñ</Navlink>
	<Navlink {inverted} external href="https://pauseaispanish.substack.com">Noticias</Navlink>
	<Navlink {inverted} c2a href="/inscripcion">Únete</Navlink>
	<LanguageSwitcher {inverted} />
	<Navlink {inverted} href="/search" ariaLabel="Buscar">
		<SearchIcon size="0.8em" />
	</Navlink>
</Navbar>
