<script lang="ts">
	import PresentBox from '$lib/components/PresentBox.svelte'
	import SubmitButton from '$lib/components/SubmitButton.svelte'
	import ValidatedInput from '$lib/components/ValidatedInput.svelte'
	import type { PageData } from './+page.server'

	let { data }: { data: PageData } = $props()

	let message = $state('')
	let contact = $derived(data.registration?.phone ?? '')
</script>

<svelte:head>
	<title>Kontakt | Geschenk Trans*port</title>
</svelte:head>

<h1>Kontakt</h1>

<p>Hast du ein Anliegen? Dann schreib uns eine Nachricht.</p>

<PresentBox withRibbon={false}>
	<form method="post" action="/kontakt/submit">
		<ValidatedInput
			type="textarea"
			name="message"
			label="Worum geht es?"
			bind:value={message}
			required="Das Feld darf nicht leer sein."
			error={false}
		/>

		<ValidatedInput
			type="text"
			name="contact"
			label="Telefonnummer oder E-Mail-Adresse"
			label2="Gib eine Kontaktmöglichkeit an, damit wir dir antworten können."
			bind:value={contact}
			required="Das Feld darf nicht leer sein."
			error={false}
		/>

		{#if data.registration}
			<p>
				Deine {data.registration.status === 'deleted' ? 'gelöschte' : ''} Anmeldung am {new Date(
					data.registration.created,
				).toLocaleDateString()} wird an die Nachricht angehängt.
			</p>
		{/if}

		<SubmitButton>Abschicken</SubmitButton>
	</form>
</PresentBox>

<p>
	Du erreichst uns auch <strong>per E-Mail</strong> an
	<a href="mailto:queer_referat@asta.uni-kassel.de">queer_referat@asta.uni-kassel.de</a>
</p>
