export enum TokenVal {
	Equals = '=',
	OpenParen = '(',
	CloseParen = ')',
	Let = 'sengen',
	EOF = 'EOF'
}

export enum TokenType {
	Number = 'NUMBER',
	Identifier = 'IDENTIFIER',
	Equals = 'EQUALS',
	OpenParen = 'OPEN_PAREN',
	CloseParen = 'CLOSE_PAREN',
	BinaryOperator = 'BINARY_EXPR',
	Let = 'LET',
	EOF = 'EOF'
}

const KEYWORD: Record<string, TokenType> = {
	"sengen": TokenType.Let
}

export interface Token {
	value: string,
	type: TokenType
}

const binaryOperators = ['+', '-', '*', '/', '%', '^']

export function isAlpha(source: string): boolean {
	return /^[a-zA-Z]+$/.test(source)
}

export function isInt(source: string): boolean {
	return /^(0|[-]?[1-9]+\d*)$/.test(source)
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

		if (isAlpha(src[i])) {
			let value = `${src[i++]}`
			while (i < src.length && isAlpha(src[i])) {
				value += src[i++]
			}
			const reserved = KEYWORD[value]
			if (reserved !== undefined) {
				tokens.push({ type: KEYWORD[value], value })
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
