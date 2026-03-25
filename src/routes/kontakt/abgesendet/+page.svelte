<script lang="ts">
	import { resolve } from '$app/paths'
</script>

<div class="box small">
	<h1>Nachricht abgesendet</h1>

	<p>Wir haben deine Nachricht erhalten und werden uns umgehend um dein Anliegen kümmern.</p>

	<a class="button formi primary wide" href={resolve('/')} style="margin-bottom: 0">
		Zur Startseite
	</a>
</div>

<svelte:head>
	<title>Nachricht übermittelt | Geschenk Trans*port</title>
</svelte:head>
