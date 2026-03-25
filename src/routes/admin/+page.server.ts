import { error, redirect } from '@sveltejs/kit'
import { tryAuthentication } from '$backend/auth'
import { registrationFromDb, type DbRegistration, type Registration } from '$lib/data.js'
import { resolve } from '$app/paths'

export interface AdminSantaData {
	activeRegistrations: Registration[]
	deletedRegistrations: Registration[]
}

export async function load({ platform, request }): Promise<AdminSantaData> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		redirect(303, resolve('/admin/login'))
	}

	const registrations = await platform.env.DB.prepare(
		'SELECT * FROM secret_santa ORDER BY created DESC',
	).all<DbRegistration>()

	const mapped = registrations.results.map(registrationFromDb)

	return {
		activeRegistrations: mapped.filter(r => r.status !== 'deleted'),
		deletedRegistrations: mapped.filter(r => r.status === 'deleted'),
	}
}
