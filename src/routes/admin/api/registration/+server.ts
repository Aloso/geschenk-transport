import { error } from '@sveltejs/kit'
import { tryAuthentication } from '../../../../backend/auth'

export async function DELETE({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return Response.redirect(new URL('/admin/loginForm?m=loggedOut', request.url), 303)
	}

	const id = new URL(request.url).searchParams.get('id') ?? error(400, 'Missing id')
	await platform.env.DB.prepare('DELETE FROM secret_santa WHERE id = ?1').bind(id).run()

	return new Response(null, { status: 200 })
}

export async function PATCH({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return Response.redirect(new URL('/admin/loginForm?m=loggedOut', request.url), 303)
	}

	const { id, status, notes } = await request.json()
	if (!id) error(400, 'Missing id')

	if (status != null) {
		await platform.env.DB.prepare('UPDATE secret_santa SET `status` = ?1 WHERE id = ?2')
			.bind(status, id)
			.run()
	} else if (notes != null) {
		await platform.env.DB.prepare('UPDATE secret_santa SET notes = ?1 WHERE id = ?2')
			.bind(notes, id)
			.run()
	} else {
		error(400, 'verified or notes required')
	}

	return new Response(null, { status: 200 })
}
