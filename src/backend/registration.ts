import { registrationFromDb, type DbRegistration, type Registration } from '$lib/data'

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
