export enum TokenVal {
	Equals = '=',
	OpenParen = '(',
	CloseParen = ')',
	Let = '宣言',
	Null = '無',
	True = '本当',
	False = '嘘',
	EOF = 'EOF'
}

export enum TokenType {
	Number = 'NUMBER',
	Boolean = 'BOOLEAN',
	Null = 'NULL',
	Identifier = 'IDENTIFIER',
	Equals = 'EQUALS',
	OpenParen = 'OPEN_PAREN',
	CloseParen = 'CLOSE_PAREN',
	BinaryOperator = 'BINARY_EXPR',
	Let = 'LET',
	EOF = 'EOF'
}

const RESERVED: Record<string, TokenType> = {
	[TokenVal.Let]: TokenType.Let,
	[TokenVal.Null]: TokenType.Null,
	[TokenVal.True]: TokenType.Boolean,
	[TokenVal.False]: TokenType.Boolean
}

export interface Token {
	value: string,
	type: TokenType
}

export type BinaryOperator = '+' | '-' | '*' | '/' | '%' | '^'
const binaryOperators: BinaryOperator[] = [
	'+',
	'-',
	'*',
	'/',
	'%',
	'^'
]

export function identifierBeginAllowed(source: string): boolean {
	const regex = /[\p{L}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
	return regex.test(source)
}

export function isInt(source: string): boolean {
	return /^(0|[-]?[1-9]+\d*)$/.test(source)
}

export function identifierAllowed(source: string): boolean {
	return identifierBeginAllowed(source) || isInt(source) || source === '_'
}

function skippable(source: string): boolean {
	return source === ' ' || source === '\t'
}

export function unrecognizedError(line: number, c: string) {
	return `Unrecognized character found on line ${line}: '${c}'`
}

export function tokenize(source: string): Token[] {
	const tokens = new Array<Token>()
	const src = source.split("")

	// Build tokens until end of source
	let i = 0
	let line = 1
	while (i < src.length) {
		if (src[i] === '\n') {
			i++
			line++
			continue
		}

		// Single character tokens
		if (src[i] === TokenVal.Equals) {
			tokens.push({ type: TokenType.Equals, value: TokenVal.Equals })
			i++
			continue
		}
		if (src[i] === TokenVal.OpenParen) {
			tokens.push({ type: TokenType.OpenParen, value: TokenVal.OpenParen })
			i++
			continue
		}
		if (src[i] === TokenVal.CloseParen) {
			tokens.push({ type: TokenType.CloseParen, value: TokenVal.CloseParen })
			i++
			continue
		}
		if (binaryOperators.includes(src[i])) {
			tokens.push({ type: TokenType.BinaryOperator, value: src[i] })
			i++
			continue
		}

		// Multiple character tokens
		if (isInt(src[i])) {
			let value = `${src[i++]}`
			while (i < src.length && isInt(src[i])) {
				value += src[i++]
			}
			tokens.push({ type: TokenType.Number, value: value })
			continue
		}

		if (identifierBeginAllowed(src[i])) {
			let value = `${src[i++]}`
			while (i < src.length && identifierAllowed(src[i])) {
				value += src[i++]
			}
			const reserved = RESERVED[value]
			if (reserved !== undefined) {
				tokens.push({ type: RESERVED[value], value })
				continue
			}
			tokens.push({ type: TokenType.Identifier, value })
			continue
		}

		if (skippable(src[i])) {
			i++
			continue
		}

		throw unrecognizedError(line, src[i])
	}

	tokens.push({ type: TokenType.EOF, value: TokenVal.EOF })
	return tokens
}
