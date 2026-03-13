<script lang="ts">
	import { resolve } from '$app/paths'
</script>

<svelte:head>
	<title>Angemeldet | Geschenk Trans*port</title>
</svelte:head>

<div class="box">
	<p>Du bist jetzt angemeldet 🎉</p>
	<p>Nächste Schritte:</p>

	<ul>
		<li>
			<p>
				<strong>Telefonnummer prüfen</strong>: Wenn du von uns eine SMS erhältst, bestätige deine
				Teilnahme. (Das kann ein paar Tage dauern)
			</p>
		</li>
		<li><p><strong>Weitersagen</strong>: Erzähle deinen Lieblingsmenschen von uns!</p></li>
		<li><p><strong>Freuen</strong>: Bald kommt dein persönliches Weihnachtsgeschenk!</p></li>
	</ul>

	<p>
		Wenn du uns unterstützen willst, freuen wir uns über eine Spende.
		<a href={resolve('/unterstuetzen')}>Mehr Informationen</a>
	</p>
</div>
