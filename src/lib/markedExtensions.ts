import type { MarkedExtension, Token } from 'marked'

const blockHtml = (text: string) => ({ type: 'html', text, raw: text, block: true, pre: false })

interface FaqOptions {
	level: number
	open?: boolean
}

export function faqExtension({ level, open }: FaqOptions): MarkedExtension {
	return {
		hooks: {
			processAllTokens(tokens) {
				let unclosed = false
				let i = 0
				const result = tokens.flatMap(token => {
					if (token.type === 'heading' && token.depth === level) {
						const newTokens: Token[] = []
						if (unclosed) {
							newTokens.push(blockHtml('<hr/></details>\n\n'))
						}
						const isOpen = open && i++ === 0
						newTokens.push(
							blockHtml(
								`<details class="big-summary-title" name="faq"${isOpen ? 'open' : ''}>\n<summary class="h${level}"><h${level}>`,
							),
						)
						newTokens.push(...(token.tokens ?? []))
						newTokens.push(blockHtml(`</h${level}></summary>\n\n`))
						unclosed = true
						return newTokens
					}
					return token
				})

				if (unclosed) {
					result.push(blockHtml('<hr/></details>\n\n'))
				}
				return result
			},
		},
	}
}
