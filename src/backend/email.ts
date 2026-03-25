import type { Registration } from '$lib/data'
import { escapeHtml } from './sanitize'

type Env = App.Platform['env']

export async function sendRegistrationEmail(env: Env, registration: Registration) {
	const mailer = await createMailer(env)

	await mailer.send({
		from: { name: 'Geschenk Trans*port', email: 'kontakt@geschenk-transport.de' },
		to: env.ADMIN_RECIPIENTS.split(','),
		subject: `Anmeldung: ${registration.name}`,
		html: emailLayout(registrationDataAsHtml(registration)),
	})
}

export async function sendContactEmail(
	env: Env,
	contact: string,
	message: string,
	registration?: Registration,
) {
	const mailer = await createMailer(env)
	const isEmail = /^.+@\S+\.\S+$/.test(contact)

	await mailer.send({
		from: { name: 'Geschenk Trans*port', email: 'kontakt@geschenk-transport.de' },
		to: env.ADMIN_RECIPIENTS.split(','),
		reply: isEmail ? contact : undefined,
		subject: `Kontaktanfrage: ${registration?.name ?? contact}`,
		html: emailLayout(
			`<p>Neue Nachricht über das Kontaktformular von Geschenk-Trans*port</p>
      <p><b>Kontakt</b>: ${escapeHtml(contact)}</p>
      <p style="white-space: pre-wrap;margin-bottom:3em"><b>Nachricht</b>:\n${escapeHtml(message)}</p>
      <hr />
	    ${registration ? registrationDataAsHtml(registration) : '<p>Keine Anmeldung zu der Person gefunden</p>'}`,
		),
	})
}

async function createMailer(env: Env) {
	const { WorkerMailer } = await import('worker-mailer')

	const mailer = await WorkerMailer.connect({
		credentials: {
			username: env.SMTP_USERNAME,
			password: env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: env.SMTP_HOST,
		port: 465,
		secure: true,
	})

	return mailer
}

function emailLayout(body: string) {
	return `<!DOCTYPE html>
<html>
<body style="font-family: Segoe UI, Roboto, sans-serif; font-size: 16px;">
  ${body}
</body>
</html>`
}

export function registrationDataAsHtml(registration: Registration) {
	const { name, age, address, phone, email, moreInfo, status, created } = registration

	return `<p>Anmeldedaten:</p>
  <ul>
    <li><b>Datum der Anmeldung</b>: ${new Date(created).toLocaleString('de-DE')}</li>
    <li><b>Name</b>: ${escapeHtml(name)}</li>
    <li><b>Alter</b>: ${age} Jahre</li>
    <li style="white-space: pre-wrap"><b>Anschrift</b>: ${escapeHtml(address)}</li>
    ${phone ? `<li><b>Telefon</b>: ${escapeHtml(phone)}</li>` : ''}
    ${email ? `<li><b>E-Mail</b>: ${escapeHtml(email)}</li>` : ''}
    <li><b>Weitere Informationen</b>: ${escapeHtml(moreInfo ?? '')}</li>
    <li><b>Status</b>: ${status === 'deleted' ? 'Gelöscht' : registration.status === 'verified' ? 'Verifiziert' : 'Eingereicht'}</li>
  </ul>`
}
