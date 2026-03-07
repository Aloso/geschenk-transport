<script lang="ts">
	import { Marked } from 'marked'
	import faq from './faq.md?raw'
	import { faqExtension } from '$lib/markedExtensions'
</script>

<svelte:head>
	<title>Häufige Fragen | Geschenk-Trans*port</title>
</svelte:head>

{@html new Marked(faqExtension({ level: 2 })).parse(faq)}
