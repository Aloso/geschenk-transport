<script lang="ts">
	import { marked } from 'marked'
	import impressum from './impressum.md?raw'
</script>

<svelte:head>
	<title>Impressum | Geschenk Trans*port</title>
</svelte:head>

<div class="box">
	{@html marked(impressum)}
</div>
