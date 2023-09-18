export enum TokenVal {
	EN_MODULE = 'module', JP_MODULE = 'モジュール',
	EN_IMPORT = 'import', JP_IMPORT = 'インポート',
	HW_EQUALS = '=', FW_EQUALS = '＝',
	HW_OPEN_PAREN = '(', FW_OPEN_PAREN = '（',
	HW_CLOSE_PAREN = ')', FW_CLOSE_PAREN = '）',
	HW_OPEN_BRACKET = '[', FW_OPEN_BRACKET = '【',
	HW_CLOSE_BRACKET = ']', FW_CLOSE_BRACKET = '】',
	HW_OPEN_BRACE = '{', FW_OPEN_BRACE = '｛',
	HW_CLOSE_BRACE = '}', FW_CLOSE_BRACE = '｝',
	HW_COLON = ':', FW_COLON = '：',
	HW_PERIOD = '.', FW_PERIOD = '。',
	HW_SEMICOLON = ';', FW_SEMICOLON = '；',
	HW_COMMA = ',', FW_COMMA_1 = '，', FW_COMMA_2 = '、',
	HW_QUESTION = '?', FW_QUESTION = '？',
	HW_BANG = '!', FW_BANG = '！',
	EN_COMMENT = '#', JP_COMMENT = '＃',
	EN_STRING = "'", JP_STRING = "”",
	EN_FUNCTION = 'func', JP_FUNCTION = '関数',
	EN_WHILE = 'while', JP_WHILE = '繰り返す',
	EN_LET = 'let', JP_LET = '宣言',
	EN_CONST = 'const', JP_CONST = '定数',
	EN_NIL = 'nil', JP_NIL = '無',
	EN_TRUE = 'true', JP_TRUE = '本当',
	EN_FALSE = 'false', JP_FALSE = '嘘',
	EN_IF = 'if', JP_IF = 'もし',
	EOF = 'EOF'
}

export enum TokenType {
	Module = 'MODULE',
	Import = 'IMPORT',
	Int = 'INT',
	Float = 'FLOAT',
	Boolean = 'BOOLEAN',
	String = 'STRING',
	Nil = 'NIL',
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
	Period = 'PERIOD',
	Semicolon = 'SEMICOLON',
	Comma = 'COMMA',
	Question = 'QUESTION',
	Bang = 'BANG',
	Let = 'LET',
	Const = 'CONST',
	Function = 'FUNCTION',
	If = 'IF',
	While = 'WHILE',
	EOF = 'EOF'
}

const RESERVED: Record<string, TokenType> = {
	[TokenVal.EN_MODULE]: TokenType.Module,
	[TokenVal.JP_MODULE]: TokenType.Module,
	[TokenVal.EN_IMPORT]: TokenType.Import,
	[TokenVal.JP_IMPORT]: TokenType.Import,
	[TokenVal.EN_LET]: TokenType.Let,
	[TokenVal.JP_LET]: TokenType.Let,
	[TokenVal.EN_CONST]: TokenType.Const,
	[TokenVal.JP_CONST]: TokenType.Const,
	[TokenVal.EN_NIL]: TokenType.Nil,
	[TokenVal.JP_NIL]: TokenType.Nil,
	[TokenVal.EN_TRUE]: TokenType.Boolean,
	[TokenVal.JP_TRUE]: TokenType.Boolean,
	[TokenVal.EN_FALSE]: TokenType.Boolean,
	[TokenVal.JP_FALSE]: TokenType.Boolean,
	[TokenVal.EN_IF]: TokenType.If,
	[TokenVal.JP_IF]: TokenType.If,
	[TokenVal.EN_WHILE]: TokenType.While,
	[TokenVal.JP_WHILE]: TokenType.While,
	[TokenVal.EN_FUNCTION]: TokenType.Function,
	[TokenVal.JP_FUNCTION]: TokenType.Function
}

export interface Token {
	value: string,
	type: TokenType,
	line: number,
	column: number
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
	| '||' | '｜｜'
	| '&&' | '＆＆'
	| '==' | '＝＝'
	| '!=' | '！＝'
	| '<=' | '＜＝'
	| '>=' | '＞＝'

const singleCharBinaryOps: BinaryOperator[] = [
	'+', '＋',
	'-',
	'*', '＊',
	'/', '／',
	'%', '％',
	'^', '＾',
]

export function identifierBeginAllowed(source: string): boolean {
	const regex = /[a-zA-Z\u3041-\u3096\u30a1-\u30f6\u4e00-\u9faf\u30fc]/u
	return regex.test(source)
}

export function isDigit(source: string): boolean {
	return /\d|[０-９]/.test(source)
}

export function identifierAllowed(source: string): boolean {
	return identifierBeginAllowed(source)
		|| isDigit(source)
		|| source === '_'
		|| source === '＿'
}

function skippable(source: string): boolean {
	return source === ' '
		|| source === '\t'
		|| source === '　'
		|| source === '\r'
		|| source === '\n'
		|| source === TokenVal.EN_COMMENT
		|| source === TokenVal.JP_COMMENT
}

export function unrecognizedError(line: number, position: number, c: string) {
	return `Unrecognized character found on line ${line}, position ${position}: '${c}'`
}

export default class GomiLexer {
	private src: string = ''
	private i: number = 0
	private line: number = 1
	private column: number = 1

	constructor(src: string) {
		this.src = src
		this.i = 0
		this.line = 1
	}

	at(): string {
		return this.src[this.i]
	}

	not_eof(): boolean {
		return this.i < this.src.length
	}

	cursor_right(): void {
		this.i++
		this.column++
	}

	mk_token(value: string, type: TokenType): Token {
		const token = { type, value, line: this.line, column: this.column }
		this.i++
		this.column += value.length
		return token
	}

	read_token(): Token {
		let inComment = false
		while ((skippable(this.at()) || inComment) && this.i < this.src.length) {
			if (this.at() === TokenVal.EN_COMMENT || this.at() === TokenVal.JP_COMMENT) {
				this.column++
				inComment = true
			}
			if (this.at() === '\n') {
				this.line++
				this.column = 1
				inComment = false
			} else {
				this.column++
			}
			this.i++
		}
		if (this.i >= this.src.length) {
			return this.mk_token(TokenVal.EOF, TokenType.EOF)
		}

		// =========================
		// Single character tokens
		// =========================

		if (this.at() === TokenVal.HW_OPEN_PAREN || this.at() === TokenVal.FW_OPEN_PAREN) {
			return this.mk_token(this.src[this.i], TokenType.OpenParen)
		}
		if (this.at() === TokenVal.HW_CLOSE_PAREN || this.at() === TokenVal.FW_CLOSE_PAREN) {
			return this.mk_token(this.src[this.i], TokenType.CloseParen)
		}
		if (this.at() === TokenVal.HW_OPEN_BRACKET || this.at() === TokenVal.FW_OPEN_BRACKET) {
			return this.mk_token(this.src[this.i], TokenType.OpenBracket)
		}
		if (this.at() === TokenVal.HW_CLOSE_BRACKET || this.at() === TokenVal.FW_CLOSE_BRACKET) {
			return this.mk_token(this.src[this.i], TokenType.CloseBracket)
		}
		if (this.at() === TokenVal.HW_OPEN_BRACE || this.at() === TokenVal.FW_OPEN_BRACE) {
			return this.mk_token(this.src[this.i], TokenType.OpenBrace)
		}
		if (this.at() === TokenVal.HW_PERIOD || this.at() === TokenVal.FW_PERIOD) {
			return this.mk_token(this.src[this.i], TokenType.Period)
		}
		if (this.at() === TokenVal.HW_CLOSE_BRACE || this.at() === TokenVal.FW_CLOSE_BRACE) {
			return this.mk_token(this.src[this.i], TokenType.CloseBrace)
		}
		if (this.at() === TokenVal.HW_COLON || this.at() === TokenVal.FW_COLON) {
			return this.mk_token(this.src[this.i], TokenType.Colon)
		}
		if (this.at() === TokenVal.HW_SEMICOLON || this.at() === TokenVal.FW_SEMICOLON) {
			return this.mk_token(this.src[this.i], TokenType.Semicolon)
		}
		if (this.at() === TokenVal.HW_COMMA || this.at() === TokenVal.FW_COMMA_1 || this.at() === TokenVal.FW_COMMA_2) {
			return this.mk_token(this.src[this.i], TokenType.Comma)
		}
		if (this.at() === TokenVal.HW_QUESTION || this.at() === TokenVal.FW_QUESTION) {
			return this.mk_token(this.src[this.i], TokenType.Question)
		}
		// We need to lie to the TS compiler here just to check
		if (singleCharBinaryOps.includes(this.at() as BinaryOperator)) {
			return this.mk_token(this.src[this.i], TokenType.BinaryOperator)
		}

		// =========================
		// Multiple character tokens
		// =========================

		// Bang, inequality check
		if (this.at() === TokenVal.HW_BANG) {
			this.i++
			if (this.at() === TokenVal.HW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}
		if (this.at() === TokenVal.FW_BANG) {
			this.i++
			if (this.at() === TokenVal.FW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}

		// Greater than or equal, less than or equal
		if (this.at() === '<') {
			this.i++
			if (this.at() === TokenVal.HW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}
		if (this.at() === '＜') {
			this.i++
			if (this.at() === TokenVal.FW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}
		if (this.at() === '>') {
			this.i++
			if (this.at() === TokenVal.HW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}
		if (this.at() === '＞') {
			this.i++
			if (this.at() === TokenVal.FW_EQUALS) {
				return this.mk_token(this.src[this.i - 1] + this.at(), TokenType.BinaryOperator)
			}
			this.i--
			return this.mk_token(this.src[this.i], TokenType.Bang)
		}

		// Equality check
		if (this.at() === TokenVal.HW_EQUALS || this.at() === TokenVal.FW_EQUALS) {
			let value = this.src[this.i++]
			if (this.at() === this.src[this.i - 1]) {
				return this.mk_token(this.src[this.i].repeat(2), TokenType.BinaryOperator)
			}
			// Make up for the factory side effect
			this.i--
			return this.mk_token(value, TokenType.Equals)
		}

		// String check
		if (this.at() === TokenVal.EN_STRING || this.at() === TokenVal.JP_STRING) {
			let value = ''
			this.i++
			while (this.at() !== TokenVal.EN_STRING && this.at() !== TokenVal.JP_STRING) {
				if (this.at() === '\\') {
					this.i++
				}
				if (this.at() === '\n' || !this.not_eof()) {
					throw 'Strings must be closed and expressed on one line.'
				}
				value += this.at()
				this.i++
			}
			return this.mk_token(value, TokenType.String)
		}

		// Binary operators
		if (['|', '&', '｜', '＆'].includes(this.at())) {
			this.i++
			if (this.at() === this.src[this.i - 1]) {
				return this.mk_token(this.src[this.i].repeat(2), TokenType.BinaryOperator)
			}
		}
		if (isDigit(this.at())) {
			let float = false
			let value = `${this.src[this.i++]}`
			while (this.i < this.src.length && (isDigit(this.at()) || this.at() === '.' || this.at() === '．')) {
				// it's a float. Go to end of numbers
				if (this.at() === '.' || this.at() === '．') {
					float = true
					value += this.src[this.i++]
					if (!isDigit(this.at())) {
						throw `Unexpected character while parsing float: '${this.at()}'`
					}
					while (this.i < this.src.length && isDigit(this.at())) {
						value += this.src[this.i++]
					}
				} else {
					value += this.src[this.i++]
				}
			}
			// Go back to adjust for mk_token side effect
			this.i--
			return this.mk_token(value, float ? TokenType.Float : TokenType.Int)
		}
		if (identifierBeginAllowed(this.at())) {
			let value = `${this.src[this.i++]}`
			while (this.i < this.src.length && identifierAllowed(this.at())) {
				value += this.src[this.i++]
			}
			// Go back to adjust for mk_token side effect
			this.i--
			const reserved = RESERVED[value]
			return (reserved !== undefined)
				? this.mk_token(value, RESERVED[value])
				: this.mk_token(value, TokenType.Identifier)
		}
		throw unrecognizedError(this.line, this.i, this.at())
	}
}
