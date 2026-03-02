import { error } from '@sveltejs/kit'
import { formDataText } from '../../../backend/helper'
import { escapeHtml } from '../../../backend/sanitize'
import { getCookies } from '$lib/cookie'
import { getRegistration } from '../../../backend/registration'
import type { Registration } from '$lib/data'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if ((platform.cf?.botManagement.score ?? 100) < 30) {
		error(403, 'Error: bot detected')
	}

	const formData = await request.formData()
	const message = formDataText(formData, 'message') ?? error(400, 'Missing message')
	const contact = (formDataText(formData, 'contact') ?? error(400, 'Missing contact')).trim()

	const { 'registration-id': id } = getCookies(request.headers)
	let registration: Registration | undefined
	try {
		registration = await getRegistration(id, platform.env)
	} catch {
		// do nothing
	}

	const subjectContact = registration?.name ?? contact
	const registrationInfo = registration
		? `<hr>
			<p>Anmeldedaten der Person:</p>
			<ul>
			<li><b>Datum</b>: ${new Date(registration.created).toLocaleString()}</li>
			<li><b>Name</b>: ${escapeHtml(registration.name)}</li>
			<li><b>Alter</b>: ${registration.age} Jahre</li>
			<li style="white-space: pre-wrap"><b>Anschrift</b>: ${escapeHtml(registration.address)}</li>
			<li><b>Telefon</b>: ${escapeHtml(registration.phone)}</li>
			<li><b>Weitere Informationen</b>: ${escapeHtml(registration.moreInfo ?? '')}</li>
			<li><b>Status</b>: ${registration.status === 'deleted' ? 'Gelöscht' : registration.status === 'verified' ? 'Verifiziert' : 'Eingereicht'}</li>
			</ul>`
		: ''

	const isEmail = /^.+@\S+\.\S+$/.test(contact)

	const { WorkerMailer } = await import('worker-mailer')

	// Connect to SMTP server
	const mailer = await WorkerMailer.connect({
		credentials: {
			username: platform.env.SMTP_USERNAME,
			password: platform.env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: platform.env.SMTP_HOST,
		port: 465, // try 587 if this fails
		secure: true,
	})

	// Send email
	await mailer.send({
		from: { name: 'Trans* Santa', email: 'contact@queereszentrumkassel.de' },
		to: platform.env.ADMIN_RECIPIENTS.split(','),
		reply: isEmail ? contact : undefined,
		subject: `Kontaktanfrage: ${subjectContact}`,
		html: `<!DOCTYPE html>
<html>
<body style="font-family: Segoe UI, Roboto, sans-serif; font-size: 16px;">
	<p>Neue Nachricht über das Kontaktformular von Geschenk-Trans*port</p>
  <p><b>Kontakt</b>: ${escapeHtml(contact)}</p>
	<p style="white-space: pre-wrap;margin-bottom:3em"><b>Nachricht</b>:
${escapeHtml(message)}</p>
	${registrationInfo}
</body>
</html>`,
	})

	const url = new URL('/kontakt/abgesendet', request.url)
	return Response.redirect(url, 303)
}
