export enum TokenVal {
	Equals1 = '=',
	Equals2 = '＝',
	OpenParen1 = '(',
	OpenParen2 = '（',
	CloseParen1 = ')',
	CloseParen2 = '）',
	Let1 = 'let',
	Let2 = '宣言',
	Null1 = 'null',
	Null2 = '無',
	True1 = 'true',
	True2 = '本当',
	False1 = 'false',
	False2 = '嘘',
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
	BinaryOperator = 'BINARY_OP',
	Let = 'LET',
	EOF = 'EOF'
}

const RESERVED: Record<string, TokenType> = {
	[TokenVal.Let1]: TokenType.Let,
	[TokenVal.Let2]: TokenType.Let,
	[TokenVal.Null1]: TokenType.Null,
	[TokenVal.Null2]: TokenType.Null,
	[TokenVal.True1]: TokenType.Boolean,
	[TokenVal.True2]: TokenType.Boolean,
	[TokenVal.False1]: TokenType.Boolean,
	[TokenVal.False2]: TokenType.Boolean
}

export interface Token {
	value: string,
	type: TokenType
}

export type BinaryOperator = 
	| '+' | '＋'
	| '-' | 'ー'
	| '*' | '＊'
	| '/' | '／'
	| '%' | '％'
	| '^' | '＾'
	| '>' | '＞'
	| '<' | '＜'

const binaryOperators: BinaryOperator[] = [
	'+', '＋',
	'-', 'ー',
	'*', '＊',
	'/', '／',
	'%', '％',
	'^', '＾',
	'>', '＞',
	'<', '＜',
]

export function identifierBeginAllowed(source: string): boolean {
	const regex = /[\p{L}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
	return regex.test(source)
}

export function isInt(source: string): boolean {
	return /^((0|[-]?[1-9]+\d*)|(０|[ー]?[１-９]+[０-９]*))$/.test(source)
}

export function identifierAllowed(source: string): boolean {
	return identifierBeginAllowed(source) || isInt(source) || source === '_'
}

function skippable(source: string): boolean {
	return source === ' ' || source === '\t' || source === '　'
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
		if (src[i] === TokenVal.Equals1 || src[i] === TokenVal.Equals2) {
			tokens.push({ type: TokenType.Equals, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.OpenParen1 || src[i] === TokenVal.OpenParen2) {
			tokens.push({ type: TokenType.OpenParen, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.CloseParen1 || src[i] === TokenVal.CloseParen2) {
			tokens.push({ type: TokenType.CloseParen, value: src[i] })
			i++
			continue
		}
		// We need to lie to the TS compiler here just to check
		if (binaryOperators.includes(src[i] as BinaryOperator)) {
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
