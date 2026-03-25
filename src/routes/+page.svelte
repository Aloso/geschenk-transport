<script lang="ts">
	import { resolve } from '$app/paths'
	import PresentBox from '$lib/components/PresentBox.svelte'
	import SecretSantaForm from '$lib/components/SecretSantaForm.svelte'
	import type { PageData } from './+page.server'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>Geschenk Trans*port</title>
</svelte:head>

<div class="box">
	<p>Hallo du wunderbarer Mensch! 🏳️‍⚧️</p>

	<p>
		Die Weihnachtszeit ist eine Zeit, die manchmal laut und trubelig ist, aber auch die Chance
		bietet, innezuhalten und einander eine Freude zu machen. Wir finden: Du hast ein Lächeln
		verdient!
	</p>

	<p>
		Deshalb starten wir dieses Jahr unser gemeinsames Wichtel-Projekt exklusiv für trans Kinder und
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

	<p>
		Noch Fragen? Dann schau auf unsere <a href={resolve('/faq')}>Hilfe-Seite</a>.
	</p>
</div>

<PresentBox>
	{#if data.registration}
		<h2>Hallo, {data.registration.name}!</h2>
		{#if data.registration.status === 'deleted'}
			<p>Deine Anmeldung wurde vom Support gelöscht.</p>
			<p>Wenn du glaubst, dass das ein Fehler ist, nimm bitte mit uns Kontakt auf:</p>
			<a class="formi button primary wide" href={resolve('/kontakt')} style="margin-bottom: 0">
				Kontaktformular
			</a>
		{:else}
			<p>Du wurdest für den Geschenk-Trans*port angemeldet.</p>
			<p>Folgende Daten wurden gespeichert:</p>
			<ul>
				{#if data.registration.email}
					<li>
						<strong>E-Mail-Adresse:</strong>
						{data.registration.email}
					</li>
				{/if}
				{#if data.registration.phone}
					<li>
						<strong>Telefonnummer:</strong>
						{data.registration.phone}
					</li>
				{/if}
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
					Deine Angaben wurden von uns bereits geprüft. Du kannst dich jetzt zurücklehnen und auf
					dein Geschenk warten 🎉
				</p>
			{/if}

			<p>Stimmt etwas nicht? Dann nimm bitte mit uns Kontakt auf:</p>
			<a class="formi button primary wide" href={resolve('/kontakt')} style="margin-bottom: 0">
				Kontaktformular
			</a>
		{/if}
	{:else if data.error}
		{#if data.error === 'not-found'}
			<h2>Deine Registrierung wurde gelöscht.</h2>
			<p>
				Deine Anmeldung konnte nicht gefunden werden. Das heißt wahrscheinlich, dass sie nach einer
				Prüfung deiner Angaben entfernt wurde.
			</p>
			<p>Wenn du glaubst, dass das ein Fehler ist, nimm bitte mit uns Kontakt auf:</p>
		{:else if data.error === 'limit-exceeded'}
			<h2>Anmeldungen sind im Moment nicht möglich.</h2>
			<p>
				Bei uns sind in letzter Zeit viele Anmeldungen eingegangen, daher ist das Formular
				deaktiviert. Schau wannanders nochmal vorbei.
			</p>
			<p>
				Bitte bedenke, dass dieses Projekt ehrenamtlich organisiert wird. Wir können daher nur eine
				begrenzte Anzahl an Anmeldungen bearbeiten.
			</p>
			<a class="formi button wide" href={resolve('/unterstuetzen')}>Unterstützen</a>
		{:else}
			<h2>Fehler</h2>
			<p>Beim Abrufen deiner Anmeldung ist ein Fehler aufgetreten.</p>
			<p>Wenn du glaubst, dass das ein Fehler ist, nimm bitte mit uns Kontakt auf:</p>
		{/if}

		<a class="formi button primary wide" href={resolve('/kontakt')} style="margin-bottom: 0">
			Kontaktformular
		</a>
	{:else}
		<SecretSantaForm />
	{/if}
</PresentBox>
