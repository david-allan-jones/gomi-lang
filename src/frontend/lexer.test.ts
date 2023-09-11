import { describe, expect, it } from "bun:test"
import { TokenType, identifierBeginAllowed, isInt, tokenize, unrecognizedError } from "./lexer"
import { fail } from "assert"

describe('isAlpha', () => {
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
})

describe('isInteger', () => {
    it('zero accepted', () => {
        expect(isInt('0')).toBe(true)
    });

    it('positive numbers accepted', () => {
        expect(isInt('42')).toBe(true)
    })

    it('floating numbers not accepted', () => {
        expect(isInt('1.23')).toBe(false)
    })

    it('empty string not accepted', () => {
        expect(isInt('')).toBe(false)
    })

    it('no numeric characters not accepted', () => {
        expect(isInt('abc')).toBe(false)
    })

    it('leading zeros not accepted', () => {
        expect(isInt('01')).toBe(false)
    })

    it('negative zero not acceepted', () => {
        expect(isInt('-0')).toBe(false)
    })
})

describe('tokenize', () => {
    it('gives only EOF token on empty string', () => {
        const src = ''
        expect(tokenize(src)).toHaveLength(1)
    })

    it('open paren', () => {
        const src = '('
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('(')
        expect(tokens[0].type).toBe(TokenType.OpenParen)
    })

    it('close paren', () => {
        const src = ')'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe(')')
        expect(tokens[0].type).toBe(TokenType.CloseParen)
    })

    it('number', () => {
        const src = '5'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('5')
        expect(tokens[0].type).toBe(TokenType.Number)
    })

    it('null', () => {
        const src = '無'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('無')
        expect(tokens[0].type).toBe(TokenType.Null)
    })

    it('true', () => {
        const src = '本当'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('本当')
        expect(tokens[0].type).toBe(TokenType.Boolean)
    })

    it('false', () => {
        const src = '嘘'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('嘘')
        expect(tokens[0].type).toBe(TokenType.Boolean)
    })

    it('let', () => {
        const src = '宣言 a = 5'
        const tokens = tokenize(src)
        expect(tokens[0].value).toBe('宣言')
        expect(tokens[0].type).toBe(TokenType.Let)
    })

    it('identifier', () => {
        const src = 'let x_1 = 5'
        const tokens = tokenize(src)
        expect(tokens[1].value).toBe('x_1')
        expect(tokens[1].type).toBe(TokenType.Identifier)
    })

    it('equals', () => {
        const src = 'let a = 5'
        const tokens = tokenize(src)
        expect(tokens[2].value).toBe('=')
        expect(tokens[2].type).toBe(TokenType.Equals)
    })

    it('binary operator', () => {
        const src = 'let a = 1 + 2 - 3 * 4 / 5 % 6 ^ 7 > 8 < 9'
        const tokens = tokenize(src)
        expect(tokens[4].value).toBe('+')
        expect(tokens[4].type).toBe(TokenType.BinaryOperator)
        expect(tokens[6].value).toBe('-')
        expect(tokens[6].type).toBe(TokenType.BinaryOperator)
        expect(tokens[8].value).toBe('*')
        expect(tokens[8].type).toBe(TokenType.BinaryOperator)
        expect(tokens[10].value).toBe('/')
        expect(tokens[10].type).toBe(TokenType.BinaryOperator)
        expect(tokens[12].value).toBe('%')
        expect(tokens[12].type).toBe(TokenType.BinaryOperator)
        expect(tokens[14].value).toBe('^')
        expect(tokens[14].type).toBe(TokenType.BinaryOperator)
        expect(tokens[16].value).toBe('>')
        expect(tokens[16].type).toBe(TokenType.BinaryOperator)
        expect(tokens[18].value).toBe('<')
        expect(tokens[18].type).toBe(TokenType.BinaryOperator)
    })

    it('skips whitespace, newlines and tabs', () => {
        const src = `
            let a = 1
            let b = 2
            let c = a + b
            let d = c / a
        `
        const tokens = tokenize(src)
        // Add 1 for EOF
        expect(tokens.length).toBe(21)
    })

    it('errors on unrecognized character', () => {
        try {
            const src = `
                let a = 1$
            `
            tokenize(src)
            fail('Was able to tokenize bad characters')
        } catch (e) {
            expect(e).toBe(unrecognizedError(2, '$'))
        }
    })
})