<script lang="ts">
	import { marked } from 'marked'
	import unterstuetzen from './unterstuetzen.md?raw'
</script>

<svelte:head>
	<title>Unterstützen | Geschenk-Trans*port</title>
</svelte:head>

<div class="box">
	{@html marked(unterstuetzen)}

	<a
		class="formi button primary block"
		href="https://www.goodcrowd.org/support-trans-kinder-oder-jugendliche-weihnachtszeit"
		target="_blank"
	>
		Spenden
	</a>
</div>
