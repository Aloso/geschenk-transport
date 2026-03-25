<script lang="ts">
	import { browser } from '$app/environment'
	import { resolve } from '$app/paths'
	import SubmitButton from '$lib/components/SubmitButton.svelte'
	import ValidatedInput from '$lib/components/ValidatedInput.svelte'
	import { isValidEmailAddress, isValidPhoneNumber } from '$lib/data'

	let name = $state('')
	let age = $state<number>()
	let address = $state('')
	let phone = $state('')
	let email = $state('')
	let moreInfo = $state('')

	let nameError = $state<string | false>(false)
	let ageError = $state<string | false>(false)
	let addressError = $state<string | false>(false)
	let phoneError = $state<string | false>(false)
	let emailError = $state<string | false>(false)
	let moreInfoError = $state<string | false>(false)
	let formError = $derived(nameError || ageError || addressError || phoneError)

	let submitClicked = $state(false)

	let turnstile = $state<'off' | 'invalid' | 'valid'>('off')
</script>

<svelte:head>
	{#if browser && location.protocol === 'https:'}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js"
			async
			defer
			onload={() => {
				turnstile = 'invalid'
				console.log('rendering turnstile')

				window.turnstile.render('#turnstile-container', {
					sitekey: import.meta.env.VITE_PUBLIC_TURNSTILE_SITE_KEY,
					theme: 'light',
					size: 'flexible',
					callback: () => {
						turnstile = 'valid'
					},
					'expired-callback': () => {
						turnstile = 'invalid'
					},
				})
			}}
		></script>
	{/if}
</svelte:head>

<form
	method="POST"
	action={resolve('/api/registration')}
	onsubmit={event => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<ValidatedInput
		type="text"
		label="Dein Name"
		label2="Der Name, mit dem du angesprochen werden möchtest. Das muss nicht der Name in deinem Ausweis sein."
		name="name"
		bind:value={name}
		bind:error={nameError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
	/>
	<ValidatedInput
		type="number"
		label="Dein Alter"
		name="age"
		bind:value={age}
		bind:error={ageError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
		hasError={age =>
			(age ?? 0) >= 12 ? false : 'Um teilzunehmen, musst du mindestens 12 Jahre alt sein.'}
	/>
	<ValidatedInput
		type="textarea"
		label="Bevorzugte Anschrift"
		label2="Gib deine Adresse an. Das kann auch die Adresse von Freund*innen oder anderen Menschen sein, denen du vertraust. Du kannst hier auch den Namen angeben, der auf dem Paket stehen soll."
		name="address"
		bind:value={address}
		bind:error={addressError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
		hasError={address => {
			const lines = address.split(/[\n,]/)
			return lines.length >= 2 && lines.every(line => line.length > 5)
				? false
				: 'Gib eine Adresse mit Straße, Hausnummer, Postleitzahl und Ort ein'
		}}
		style="--min-height: 100px"
		placeholder={'Adresszeile 1\nAdresszeile 2'}
	/>
	<div class="label-text">Kontakt</div>
	<div class="label2-text">
		Vor dem Versand werden wir dir eine Nachricht schicken. Du musst darauf antworten, um den
		Versand zu bestätigen.
	</div>
	<div class="label2-text">
		Wir brauchen dafür deine Telefonnummer oder E-Mail. Nur eines davon ist verpflichtend.
	</div>
	<ValidatedInput
		type="tel"
		label="Telefonnummer (Bestätigung per SMS)"
		name="phone"
		bind:value={phone}
		bind:error={phoneError}
		required={() =>
			email ? undefined : 'Telefonnummer oder E-Mail-Adresse dürfen nicht leer sein'}
		{submitClicked}
		hasError={phone =>
			!phone || isValidPhoneNumber(phone) ? false : 'Die Telefonnummer ist ungültig'}
		smaller
	/>
	<ValidatedInput
		type="email"
		label="E-Mail-Adresse"
		name="email"
		bind:value={email}
		bind:error={emailError}
		required={() =>
			phone ? undefined : 'Telefonnummer oder E-Mail-Adresse dürfen nicht leer sein'}
		{submitClicked}
		hasError={email =>
			!email || isValidEmailAddress(email) ? false : 'Die E-Mail-Adresse ist ungültig'}
		smaller
	/>
	<ValidatedInput
		type="textarea"
		label="Weitere Informationen"
		label2="Hast du besondere Wünsche oder möchtest etwas zu dir sagen? Dann gib es hier ein."
		name="moreInfo"
		bind:value={moreInfo}
		bind:error={moreInfoError}
		{submitClicked}
		style="--min-height: 150px"
	/>

	<div id="turnstile-container"></div>

	<SubmitButton disabled={turnstile === 'invalid' || (submitClicked && !!formError)}>
		{turnstile === 'invalid' ? 'Captcha wird noch gelöst...' : 'Anmelden'}
	</SubmitButton>
</form>

<style lang="scss">
	.label-text {
		display: block;
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
		font-weight: 650;
	}

	.label2-text {
		display: block;
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		opacity: 0.8;
		line-height: 140%;
	}
</style>
