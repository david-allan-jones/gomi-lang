export enum TokenVal {
	HW_EQUALS = '=', 		FW_EQUALS = '＝',
	HW_OPEN_PAREN = '(', 	FW_OPEN_PAREN = '（',
	HW_CLOSE_PAREN = ')', 	FW_CLOSE_PAREN = '）',
	HW_OPEN_BRACKET = '[', 	FW_OPEN_BRACKET = '【',
	HW_CLOSE_BRACKET = ']', FW_CLOSE_BRACKET = '】',
	HW_OPEN_BRACE = '{', 	FW_OPEN_BRACE = '｛',
	HW_CLOSE_BRACE = '}', 	FW_CLOSE_BRACE = '｝',
	HW_COLON = ':', 		FW_COLON = '：',
	HW_SEMICOLON = ';', 	FW_SEMICOLON = '；',
	HW_COMMA = ',', 		FW_COMMA_1 = '，',			FW_COMMA_2 = '、',
	HW_QUESTION = '?',		FW_QUESTION = '？',
	HW_BANG = '!',			FW_BANG = '！',
	EN_LET = 'let', 		JP_LET = '宣言',
	EN_NULL = 'nil', 		JP_NULL = '無',
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
	Semicolon = 'SEMICOLON',
	Comma = 'COMMA',
	Question = 'QUESTION',
	Bang = 'BANG',
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
	| '+'  | '＋'
	| '-'
	| '*'  | '＊'
	| '/'  | '／'
	| '%'  | '％'
	| '^'  | '＾'
	| '>'  | '＞'
	| '<'  | '＜'
	| '||' | '｜｜'
	| '&&' | '＆＆'

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
	const regex = /[a-zA-Z\u3041-\u3096\u30a1-\u30f6\u4e00-\u9faf]/u
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
		|| source === '\n'
}

export function unrecognizedError(line: number, c: string) {
	return `Unrecognized character found on line ${line}: '${c}'`
}

export default class Tokenizer {
	private src: string = ''
	private i: number = 0
	private lineCount: number = 1

	constructor(src: string) {
		this.src = src
		this.i = 0
		this.lineCount = 1
	}

	get_position() {
		return this.i + 1
	}

	get_line() {
		return this.lineCount
	}

	at(): string {
		return this.src[this.i]
	}
	
	not_eof(): boolean {
		return this.i < this.src.length
	}

	read_token(): Token {
		if (this.i === this.src.length) {
			return { type: TokenType.EOF, value: TokenVal.EOF }
		}

		while (skippable(this.at())) {
			if (this.at() === '\n') {
				this.lineCount++
			}
			this.i++
		}

		// =========================
		// Single character tokens
		// =========================
		
		if (this.at() === TokenVal.HW_EQUALS || this.at() === TokenVal.FW_EQUALS) {
			return { type: TokenType.Equals, value: this.src[this.i++] }
		}
		if (this.at() === TokenVal.HW_OPEN_PAREN || this.at() === TokenVal.FW_OPEN_PAREN) {
			return { type: TokenType.OpenParen, value: this.src[this.i++] }
		}
		if (this.at() === TokenVal.HW_CLOSE_PAREN || this.at() === TokenVal.FW_CLOSE_PAREN) {
			return { type: TokenType.CloseParen, value: this.src[this.i++] }
		}
		if (this.at() === TokenVal.HW_OPEN_BRACKET || this.at() === TokenVal.FW_OPEN_BRACKET) {
			return { type: TokenType.OpenBracket, value: this.src[this.i++] }
		}	
		if (this.at() === TokenVal.HW_CLOSE_BRACKET || this.at() === TokenVal.FW_CLOSE_BRACKET) {
			return { type: TokenType.CloseBracket, value: this.src[this.i++] }
		}		
		if (this.at() === TokenVal.HW_OPEN_BRACE || this.at() === TokenVal.FW_OPEN_BRACE) {
			return { type: TokenType.OpenBrace, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_CLOSE_BRACE || this.at() === TokenVal.FW_CLOSE_BRACE) {
			return { type: TokenType.CloseBrace, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_COLON || this.at() === TokenVal.FW_COLON) {
			return { type: TokenType.Colon, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_SEMICOLON || this.at() === TokenVal.FW_SEMICOLON) {
			return { type: TokenType.Semicolon, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_COMMA || this.at() === TokenVal.FW_COMMA_1 || this.at() === TokenVal.FW_COMMA_2) {
			return { type: TokenType.Comma, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_QUESTION || this.at() === TokenVal.FW_QUESTION) {
			return { type: TokenType.Question, value: this.src[this.i++] }
		}			
		if (this.at() === TokenVal.HW_BANG || this.at() === TokenVal.FW_BANG) {
			return { type: TokenType.Bang, value: this.src[this.i++] }
		}			
		// We need to lie to the TS compiler here just to check
		if (binaryOperators.includes(this.at() as BinaryOperator)) {
			return { type: TokenType.BinaryOperator, value: this.src[this.i++] }
		}	

		// =========================
		// Multiple character tokens
		// =========================

		// Binary operators
		if (['|', '&', '｜', '＆'].includes(this.at())) {
			this.i++
			if (this.at() === this.src[this.i - 1]) {
				const token = { type: TokenType.BinaryOperator , value: this.src[this.i].repeat(2)}
				this.i++
				return token
			}
		}
		if (isInt(this.at())) {
			let value = `${this.src[this.i++]}`
			while (this.i < this.src.length && isInt(this.at())) {
				value += this.src[this.i++]
			}
			return { type: TokenType.Number, value: value }
		}
		if (identifierBeginAllowed(this.at())) {
			let value = `${this.src[this.i++]}`
			while (this.i < this.src.length && identifierAllowed(this.at())) {
				value += this.src[this.i++]
			}
			const reserved = RESERVED[value]
			return (reserved !== undefined)
				? { type: RESERVED[value], value }
				: { type: TokenType.Identifier, value }
		}
		throw unrecognizedError(this.lineCount, this.at())
	}
}

export function tokenize(src: string): Token[] {
	const tokens = new Array<Token>()

	// Build tokens until end of source
	let i = 0
	let line = 1
	while (i < src.length) {
		if (src[i] === '\n') {
			i++
			line++
			continue
		}

		// =========================
		// Single character tokens
		// =========================
		
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
		if (src[i] === TokenVal.HW_SEMICOLON || src[i] === TokenVal.FW_SEMICOLON) {
			tokens.push({ type: TokenType.Semicolon, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_COMMA || src[i] === TokenVal.FW_COMMA_1 || src[i] === TokenVal.FW_COMMA_2) {
			tokens.push({ type: TokenType.Comma, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_QUESTION || src[i] === TokenVal.FW_QUESTION) {
			tokens.push({ type: TokenType.Question, value: src[i] })
			i++
			continue
		}
		if (src[i] === TokenVal.HW_BANG || src[i] === TokenVal.FW_BANG) {
			tokens.push({ type: TokenType.Bang, value: src[i] })
			i++
			continue
		}
		// We need to lie to the TS compiler here just to check
		if (binaryOperators.includes(src[i] as BinaryOperator)) {
			tokens.push({ type: TokenType.BinaryOperator, value: src[i] })
			i++
			continue
		}

		// =========================
		// Multiple character tokens
		// =========================

		// Binary operators
		if (['|', '&', '｜', '＆'].includes(src[i])) {
			i++
			if (src[i] === src[i-1]) {
				tokens.push({ type: TokenType.BinaryOperator, value: src[i].repeat(2)})
				i++
				continue
			}
		}

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
