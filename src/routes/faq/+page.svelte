<script lang="ts">
	import { Marked } from 'marked'
	import faq from './faq.md?raw'
	import { faqExtension } from '$lib/markedExtensions'
	import { resolve } from '$app/paths'
</script>

<svelte:head>
	<title>Häufige Fragen | Geschenk-Trans*port</title>
</svelte:head>

<div class="box">
	{@html new Marked(faqExtension({ level: 2 })).parse(faq)}

	<p>
		Deine Frage wurde nicht beantwortet? Dann
		<a href={resolve('/kontakt')}>schreib uns eine Nachricht</a>.
	</p>

	<p class="button-wrapper">
		<a class="button formi block primary" href={resolve('/')}>Geschenk bestellen</a>
	</p>
</div>

<style>
	.box {
		:global(summary) {
			font-size: 1.25rem;
			line-height: 150%;
			margin-top: 0;
		}
		:global(hr) {
			margin-bottom: 1rem;
		}
	}

	.button-wrapper {
		margin-top: 2rem;
	}
</style>
