import { describe, expect, it } from "bun:test"
import GomiLexer, { Token, TokenType, TokenVal, identifierBeginAllowed, isDigit, unrecognizedError } from "./lexer"
import { fail } from "assert"

describe('identifierBeginAllowed', () => {
    it('return false on empty string', () => {
        expect(identifierBeginAllowed('')).toBe(false)
    })
    it('returns false on numbers', () => {
        expect(identifierBeginAllowed('1234567890')).toBe(false)
    })
    it('returns true on lower case alpha strings', () => {
        expect(identifierBeginAllowed('abcdefghijklmnopqrstuvwxyz')).toBe(true)
    })
    it('returns true on upper case alpha strings', () => {
        expect(identifierBeginAllowed('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true)
    })
    it('returns true on hiragana strings', () => {
        const hiraganaStart = parseInt('0x3041', 16)
        const hiraganaEnd = parseInt('0x3096', 16)
        for (let i = hiraganaStart; i <= hiraganaEnd; i++) {
            expect(identifierBeginAllowed(String.fromCharCode(i))).toBe(true)
        }
    })
    it('returns true on katakana strings', () => {
        const katakanaStart = parseInt('0x30a1', 16)
        const katakanaEnd = parseInt('0x30f6', 16)
        for (let i = katakanaStart; i <= katakanaEnd; i++) {
            expect(identifierBeginAllowed(String.fromCharCode(i))).toBe(true)
        }
    })
    it('returns true on cjk unified', () => {
        const cjkStart = parseInt('0x4e00', 16)
        const cjkEnd = parseInt('0x9faf', 16)
        for (let i = cjkStart; i <= cjkEnd; i++) {
            expect(identifierBeginAllowed(String.fromCharCode(i))).toBe(true)
        }
    })
})

describe('isDigit', () => {
    it('hw digits', () => {
        const digits = '0123456789'
        for (const d of digits) {
            expect(isDigit(d)).toBe(true)
        }
    })
    it('fw digits', () => {
        const digits = '０１２３４５６７８９'
        for (const d of digits) {
            expect(isDigit(d)).toBe(true)
        }
    })
})

describe('Gomi Lexer', () => {
    const testSources = (sources: string[], type: TokenType): void => {
        const errors = []
        for (let i = 0; i < sources.length; i++) {
            const tokenizer = new GomiLexer(sources[i])
            const token = tokenizer.read_token()
            if (token.value !== sources[i]) {
                errors.push({ received: token.value, expected: sources[i]})
            }
            if (token.type !== type) {
                errors.push({ received: token.type, expected: type })
            }
        }
        if (errors.length) {
            fail(`Failures: ${JSON.stringify(errors)}`)
        }
    }

    it('gives only EOF token on empty string', () => {
        const tokenizer = new GomiLexer('')
        const token = tokenizer.read_token()
        expect(token.type).toBe(TokenType.EOF)
        expect(token.value).toBe(TokenVal.EOF)
    })
    it('line comment', () => {
        const tokenizer = new GomiLexer(`#b
            1 
        `)   
        const token = tokenizer.read_token()
        expect(token.type).toBe(TokenType.Int)
        expect(token.value).toBe('1')
    })
    it('open paren', () => {
        testSources(['(', '（'], TokenType.OpenParen)
    })
    it('close paren', () => {
        testSources([')', '）'], TokenType.CloseParen)
    })
    it('open bracket', () => {
        testSources(['[', '【'], TokenType.OpenBracket)
    })
    it('close paren', () => {
        testSources([']', '】'], TokenType.CloseBracket)
    })
    it('open brace', () => {
        testSources(['{', '｛'], TokenType.OpenBrace)
    })
    it('close paren', () => {
        testSources(['}', '｝'], TokenType.CloseBrace)
    })
    it('colon', () => {
        testSources([':', '：'], TokenType.Colon)
    })
    it('semicolon', () => {
        testSources([';', '；'], TokenType.Semicolon)
    })
    it('comma', () => {
        testSources([',', '，', '、'], TokenType.Comma)
    })
    it('question', () => {
        testSources(['?', '？'], TokenType.Question)
    })
    it('bang', () => {
        testSources(['!', '！'], TokenType.Bang)
    })
    it('int', () => {
        testSources(['1', '１', '10', '１０'], TokenType.Int)
    })
    it('float', () => {
        testSources(['1.0', '１．０', '10.01', '１０．０１'], TokenType.Float)
    })
    it('string', () => {
        const tests = ["''", "'Test'", '””', '”テスト”']
        for (let i = 0; i < tests.length; i++) {
           let tokenizer = new GomiLexer(tests[i]) 
           const token = tokenizer.read_token()
           expect(token.type).toBe(TokenType.String)
           expect(token.value).toBe(tests[i].substring(1, tests[i].length - 1))
        }
    })
    it('null', () => {
        testSources(['nil', '無'], TokenType.Nil)
    })
    it('true', () => {
        testSources(['true', '本当'], TokenType.Boolean)
    })
    it('false', () => {
        testSources(['false', '嘘'], TokenType.Boolean)
    })
    it('if', () => {
        testSources(['if', 'もし'], TokenType.If)
    })
    it('while', () => {
        testSources(['while', '繰り返す'], TokenType.While)
    })
    it('let', () => {
        testSources(['let', '宣言'], TokenType.Let)
    })
    it('const', () => {
        testSources(['const', '定数'], TokenType.Const)
    })
    it('module', () => {
        testSources(['module', 'モジュール'], TokenType.Module)
    })
    it('import', () => {
        testSources(['import', 'インポート'], TokenType.Import)
    })
    it('function', () => {
        testSources(['func', '関数'], TokenType.Function)
    })
    it('identifier', () => {
        testSources(['a', 'a1', 'あ', 'あ１', 'a_x', 'あ＿え'], TokenType.Identifier)
    })
    it('assignment', () => {
        testSources(['=', '＝'], TokenType.Equals)
    })
    it('single character binary operator', () => {
        testSources(
            ['+', '-', '*', '/', '%', '^', '>', '<', '＋', '＊', '／', '％', '＾', '＞', '＜'],
            TokenType.BinaryOperator,
        )
    })
    it('multi character binary operators', () => {
        testSources([
            '||', 
            '&&', 
            '==', 
            '!=',
            '<=',
            '>=',
            '｜｜', 
            '＆＆', 
            '＝＝',
            '！＝',
            '＜＝',
            '＞＝',
        ], TokenType.BinaryOperator)
    })

    it('skips whitespace at end of file', () => {
        const tokenizer = new GomiLexer('a ')
        tokenizer.read_token()
        const token = tokenizer.read_token()
        expect(token.type).toBe(TokenType.EOF)
        expect(token.value).toBe(TokenVal.EOF)
    })

    it('skips whitespace, newlines and tabs', () => {
        const tokens: Token[] = []
        const tokenizer = new GomiLexer(`
            a
        `)
        while (tokenizer.not_eof()) {
            tokens.push(tokenizer.read_token())
        }
        // Add 1 for EOF
        expect(tokens.length).toBe(2)
    })

    it('errors on unrecognized character', () => {
        try {
            const tokenizer = new GomiLexer(`
                let a = 1$
            `)
            while (tokenizer.not_eof()) {
                tokenizer.read_token()
            }
            fail('Was able to tokenize bad characters')
        } catch (e) {
            expect(e).toBe(unrecognizedError(2, 26, '$'))
        }
    })

    it('tracks line number correctly', () => {
        const tokenizer = new GomiLexer(`
            a
            b
        `)
        expect(tokenizer.read_token().line).toBe(2) //a
        expect(tokenizer.read_token().line).toBe(3) //b
        expect(tokenizer.read_token().line).toBe(4) //EOF
    })

    it('tracks position correctly', () => {
        const tokenizer = new GomiLexer('ab cd e')
        expect(tokenizer.read_token().column).toBe(1) //a
        expect(tokenizer.read_token().column).toBe(4) //a
        expect(tokenizer.read_token().column).toBe(7) //a
    })
})