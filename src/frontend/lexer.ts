export enum TokenVal {
	HW_EQUALS = '=', 		FW_EQUALS = '＝',
	HW_OPEN_PAREN = '(', 	FW_OPEN_PAREN = '（',
	HW_CLOSE_PAREN = ')', 	FW_CLOSE_PAREN = '）',
	HW_OPEN_BRACKET = '[', 	FW_OPEN_BRACKET = '【',
	HW_CLOSE_BRACKET = ']', FW_CLOSE_BRACKET = '】',
	HW_OPEN_BRACE = '{', 	FW_OPEN_BRACE = '｛',
	HW_CLOSE_BRACE = '}', 	FW_CLOSE_BRACE = '｝',
	HW_COLON = ':', 		FW_COLON = '：',
	HW_COMMA = ',', 		FW_COMMA = '、',
	EN_LET = 'let', 		JP_LET = '宣言',
	EN_NULL = 'null', 		JP_NULL = '無',
	EN_TRUE = 'true', 		JP_TRUE = '本当',
	EN_FALSE = 'false', 	JP_FALSE = '嘘',
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
	OpenBracket = 'OPEN_BRACKET',
	CloseBracket = 'CLOSE_BRACKET',
	OpenBrace = 'OPEN_BRACE',
	CloseBrace = 'CLOSE_BRACE',
	Colon = 'COLON',
	Comma = 'COMMA',
	Let = 'LET',
	EOF = 'EOF'
}

const RESERVED: Record<string, TokenType> = {
	[TokenVal.EN_LET]: TokenType.Let,
	[TokenVal.JP_LET]: TokenType.Let,
	[TokenVal.EN_NULL]: TokenType.Null,
	[TokenVal.JP_NULL]: TokenType.Null,
	[TokenVal.EN_TRUE]: TokenType.Boolean,
	[TokenVal.JP_TRUE]: TokenType.Boolean,
	[TokenVal.EN_FALSE]: TokenType.Boolean,
	[TokenVal.JP_FALSE]: TokenType.Boolean
}

export interface Token {
	value: string,
	type: TokenType
}

export type BinaryOperator = 
	| '+' | '＋'
	| '-'
	| '*' | '＊'
	| '/' | '／'
	| '%' | '％'
	| '^' | '＾'
	| '>' | '＞'
	| '<' | '＜'

const binaryOperators: BinaryOperator[] = [
	'+', '＋',
	'-',
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
	return /^((0|[1-9]+\d*)|(０|[１-９]+[０-９]*))$/.test(source)
}

export function identifierAllowed(source: string): boolean {
	return identifierBeginAllowed(source)
		|| isInt(source)
		|| source === '_'
		|| source === '＿'
}

function skippable(source: string): boolean {
	return source === ' '
		|| source === '\t'
		|| source === '　'
		|| source === '\r'
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
		if (src[i] === TokenVal.HW_EQUALS || src[i] === TokenVal.FW_EQUALS) {
			tokens.push({ type: TokenType.Equals, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_OPEN_PAREN || src[i] === TokenVal.FW_OPEN_PAREN) {
			tokens.push({ type: TokenType.OpenParen, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_CLOSE_PAREN || src[i] === TokenVal.FW_CLOSE_PAREN) {
			tokens.push({ type: TokenType.CloseParen, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_OPEN_BRACKET || src[i] === TokenVal.FW_OPEN_BRACKET) {
			tokens.push({ type: TokenType.OpenBracket, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_CLOSE_BRACKET || src[i] === TokenVal.FW_CLOSE_BRACKET) {
			tokens.push({ type: TokenType.CloseBracket, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_OPEN_BRACE || src[i] === TokenVal.FW_OPEN_BRACE) {
			tokens.push({ type: TokenType.OpenBrace, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_CLOSE_BRACE || src[i] === TokenVal.FW_CLOSE_BRACE) {
			tokens.push({ type: TokenType.CloseBrace, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_COLON || src[i] === TokenVal.FW_COLON) {
			tokens.push({ type: TokenType.Colon, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_COMMA || src[i] === TokenVal.FW_COMMA) {
			tokens.push({ type: TokenType.Comma, value: src[i] })
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
