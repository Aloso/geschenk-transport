import { registrationFromDb, type DbRegistration, type Registration } from '$lib/data'
import { error } from '@sveltejs/kit'

type Env = App.Platform['env']

export async function getRegistration(
	id: string,
	env: Env,
	admin = false,
): Promise<Registration | undefined> {
	const dbRegistration = await env.DB.prepare('SELECT * FROM secret_santa WHERE id = ?1')
		.bind(id)
		.first<DbRegistration>()

	if (!dbRegistration) {
		return
	}

	if (admin) return registrationFromDb(dbRegistration)

	const { notes: _, ...registration } = registrationFromDb(dbRegistration)
	return registration
}

export async function getRegistrationsCount(env: Env) {
	const result = await env.DB.prepare(
		`SELECT COUNT(*) count FROM secret_santa WHERE status != 'deleted'`,
	).first<{ count: number }>()
	if (!result) error(400, 'Error accessing database')
	return result.count
}

export async function addRegistration(env: Env, registration: Omit<Registration, 'status'>) {
	const { id, created, name, phone, email, address, age, moreInfo } = registration

	await env.DB.prepare(
		`INSERT INTO secret_santa (id, created, name, phone, email, address, age, moreInfo)
		VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
	)
		.bind(id, created, name, phone ?? null, email ?? null, address, age, moreInfo ?? null)
		.run()
}

export async function deleteRegistration(env: Env, id: string) {
	await env.DB.prepare(`DELETE FROM secret_santa WHERE id = ?1`).bind(id).run()
}
