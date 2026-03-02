<script lang="ts">
	import PresentBox from '$lib/components/PresentBox.svelte'
	import SecretSantaForm from '$lib/components/SecretSantaForm.svelte'
	import type { PageData } from './+page.server'

	let { data }: { data: PageData } = $props()
</script>

<h1 style="line-height: 100%;">
	Geschenk<br />Trans<span style="color:#d2b;margin:0 -0.05em">*</span>port
</h1>
<p>Hallo du wunderbarer Mensch! 🏳️‍⚧️</p>

<p>
	Die Weihnachtszeit steht vor der Tür – eine Zeit, die manchmal laut und trubelig ist, aber auch
	die Chance bietet, innezuhalten und einander eine Freude zu machen. Wir finden: Du hast ein
	Lächeln verdient!
</p>

<p>
	Deshalb starten wir dieses Jahr unser gemeinsames Wichtel-Projekt exklusiv für Trans* Kinder und
	Jugendliche. Ganz egal, wo du auf deinem Weg gerade stehst – wir möchten, dass du weißt: Du bist
	gesehen, du bist wertvoll und du bist Teil einer großartigen Gemeinschaft.
</p>

<p>So funktioniert’s:</p>

<ul>
	<li><p><strong>Anmelden</strong>: Trag dich kurz in unsere Liste ein.</p></li>
	<li>
		<p>
			<strong>Überraschung erhalten</strong>: Pünktlich zu Weihnachten landet ein liebevoll
			ausgesuchtes, kleines Geschenk direkt in deinem Briefkasten.
		</p>
	</li>
	<li>
		<p>
			<strong>Freude teilen</strong>: Erzähl deinen Lieblingsmenschen von uns, damit wir noch mehr
			Menschen erreichen.
		</p>
	</li>
</ul>

<p>
	Lass uns die Feiertage ein bisschen bunter und herzlicher machen. Melde dich jetzt an und lass
	dich von uns beschenken!
</p>

<PresentBox>
	{#if data.registration}
		<h2>Hallo, {data.registration.name}!</h2>
		<p>Du wurdest für den Geschenk-Trans*port angemeldet.</p>
		<p>Folgende Daten wurden gespeichert:</p>
		<ul>
			<li>
				<strong>Telefonnummer:</strong>
				{data.registration.phone}
			</li>
			<li style="white-space: pre-wrap;">
				<strong>Liefer-Adresse:</strong>{'\n'}{data.registration.address}
			</li>
			<li style="white-space: pre-wrap;">
				<strong>Weitere Informationen:</strong>{'\n'}{data.registration.moreInfo ??
					'Keine angegeben'}
			</li>
		</ul>
		{#if data.registration.status === 'verified'}
			<p>
				Deine Angaben wurden von uns geprüft. Du kannst dich jetzt zurücklehnen und auf dein
				Geschenk warten 🎉
			</p>
		{/if}
		<p>Stimmt etwas nicht? Dann nimm bitte mit uns Kontakt auf:</p>

		<p><a class="formi button primary" href="/kontakt">Kontaktformular</a></p>
	{:else if data.error}
		{#if data.error === 'not-found'}
			<h2>Deine Registrierung wurde gelöscht.</h2>
			<p>
				Deine Anmeldung konnte nicht gefunden werden. Das heißt wahrscheinlich, dass sie nach einer
				Prüfung deiner Angaben entfernt wurde.
			</p>
			<p>Wenn du glaubst, dass das ein Fehler ist, nimm bitte mit uns Kontakt auf:</p>
		{:else}
			<h2>Fehler</h2>
			<p>Beim Abrufen deiner Anmeldung ist ein Fehler aufgetreten.</p>
			<p>Wenn du glaubst, dass das ein Fehler ist, nimm bitte mit uns Kontakt auf:</p>
		{/if}

		<p><a class="formi button primary" href="/kontakt">Kontaktformular</a></p>
	{:else}
		<SecretSantaForm />
	{/if}
</PresentBox>

<svelte:head>
	<title>Trans Santa Kassel</title>
</svelte:head>
