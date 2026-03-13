<script lang="ts">
	import { marked } from 'marked'
	import datenschutz from './datenschutz.md?raw'
</script>

<svelte:head>
	<title>Datenschutz | Geschenk Trans*port</title>
</svelte:head>

<div class="box">
	{@html marked(datenschutz)}
</div>
