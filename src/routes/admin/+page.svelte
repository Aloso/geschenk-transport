<script lang="ts">
	import type { AdminSantaData } from './+page.server'
	import RegistrationList from '$lib/components/RegistrationList.svelte'

	interface Props {
		data: AdminSantaData
	}

	let { data }: Props = $props()
</script>

<svelte:head>
	<title>Admin | Trans* Santa Kassel</title>
</svelte:head>

<h1>Administration</h1>

<h2>Registrierungen</h2>

<RegistrationList registrations={data.activeRegistrations} />

<details>
	<summary class="h2">
		<h2>Gelöschte Registrierungen</h2>
	</summary>

	<RegistrationList registrations={data.deletedRegistrations} deleted />
</details>
