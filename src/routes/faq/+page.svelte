<script lang="ts">
	import { Marked } from 'marked'
	import faq from './faq.md?raw'
	import { faqExtension } from '$lib/markedExtensions'
</script>

<svelte:head>
	<title>Häufige Fragen | Geschenk-Trans*port</title>
</svelte:head>

<div class="box">
	{@html new Marked(faqExtension({ level: 2 })).parse(faq)}
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
</style>
