<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import type { Registration } from '$lib/data'
	import { SvelteSet } from 'svelte/reactivity'

	interface Props {
		registrations: Registration[]
		deleted?: boolean
	}

	let { registrations = $bindable(), deleted }: Props = $props()

	let dirty = $state(new SvelteSet<string>())

	const rtf1 = new Intl.RelativeTimeFormat('de', { style: 'short', localeMatcher: 'best fit' })
	const now = $state(Date.now())

	function formatCreated(timestamp: number) {
		const seconds = (timestamp - now) / 1000
		return seconds > -60
			? 'gerade eben'
			: seconds > -3600
				? rtf1.format(Math.round(seconds / 60), 'minute')
				: seconds > -86400
					? rtf1.format(Math.round(seconds / 3600), 'hour')
					: new Date(timestamp).toLocaleDateString('de', {
							year: '2-digit',
							month: '2-digit',
							day: '2-digit',
						})
	}

	function auto_grow(element: HTMLTextAreaElement) {
		element.style.minHeight = '5px'
		element.style.minHeight = Math.min(element.scrollHeight, 300) + 'px'
	}

	type RegistrationPatch = { id: string } & Partial<Pick<Registration, 'status' | 'notes'>>

	async function patchReg(patch: RegistrationPatch, invalidate = true) {
		await fetch(`/admin/api/registration`, { method: 'PATCH', body: JSON.stringify(patch) })
		if (invalidate) invalidateAll()
	}

	async function setNotes(id: string, notes: string) {
		await patchReg({ id, notes }, false)
		dirty.delete(id)
	}

	async function setVerified(id: string, verified: boolean) {
		await patchReg({ id, status: verified ? 'verified' : 'pending' })
	}

	async function remove(id: string) {
		await patchReg({ id, status: 'deleted' })
	}

	async function restore(id: string) {
		await patchReg({ id, status: 'pending' })
	}

	async function removePermanently(id: string) {
		if (confirm('Registrierung endgültig löschen?')) {
			await fetch(`/admin/api/registration?id=${id}`, { method: 'DELETE' })
			invalidateAll()
		}
	}
</script>

{#if registrations.length === 0}
	Keine Einträge
{:else}
	<table class="reg-table">
		<thead>
			<tr>
				<th>Telefon</th>
				<th>Anmeldung</th>
				<th>Name</th>
				<th>Adresse</th>
				<th>Alter</th>
				<th>Infos</th>
				<th>Verifiz.</th>
				<th>Notizen</th>
				<th></th>
			</tr>
		</thead>

		<tbody>
			{#each registrations as reg (reg.id)}
				<tr>
					<td>{reg.phone}</td>
					<td title={new Date(reg.created).toLocaleString()}>{formatCreated(reg.created)}</td>
					<td>{reg.name}</td>
					<td class="multiline">{reg.address}</td>
					<td>{reg.age}</td>
					<td>{reg.moreInfo}</td>
					<td>
						<input
							type="checkbox"
							checked={reg.status === 'verified'}
							oninput={e => setVerified(reg.id, e.currentTarget.checked)}
						/>
					</td>
					<td>
						<textarea
							oninput={e => {
								dirty.add(reg.id)
								auto_grow(e.currentTarget)
							}}
							onblur={e => setNotes(reg.id, e.currentTarget.value)}
							{@attach auto_grow}
							value={reg.notes}
							class:dirty={dirty.has(reg.id)}
						></textarea>
					</td>
					<td>
						<div class="actions">
							{#if deleted}
								<button class="formi action" onclick={() => restore(reg.id)}>
									Wiederherstellen
								</button>
								<!--
                <button class="formi action red" onclick={() => removePermanently(reg.id)}>
									Endgültig löschen
								</button>
                -->
							{:else}
								<button class="formi action red" onclick={() => remove(reg.id)}>Löschen</button>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style lang="scss">
	.reg-table {
		display: table;
		width: 100%;
		min-width: 900px;
		border-collapse: collapse;
		font-size: 0.8rem;
		line-height: 150%;
	}

	td,
	th {
		border: 1px solid #0007;
		border-width: 1px 0;
		padding: 5px;
		vertical-align: top;
		text-align: left;

		&:first-child {
			padding-left: 0;
		}
		&:last-child {
			padding-right: 0;
		}
	}

	.multiline {
		white-space: pre-wrap;
	}

	textarea {
		display: flex;
		box-sizing: border-box;
		resize: none;
		overflow: hidden;
		width: calc(100% + 10px);
		height: 100%;
		min-height: 36px;
		border: none;
		background-color: transparent;
		color: inherit;
		margin: -5px;
		padding: 5px;
		font: inherit;
		border-radius: 1px;

		&:focus {
			outline: 2.4px solid #3784ff;
		}

		&.dirty {
			outline: 2.4px solid #e0914c;
		}
	}

	.actions {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
		justify-content: end;
	}

	.action {
		font-size: 0.7rem;
		padding: 3px 6px;
		line-height: 1rem;
	}
</style>
