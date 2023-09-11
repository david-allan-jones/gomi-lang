import { describe, expect, it } from "bun:test"
import { Token, TokenType, TokenVal, identifierBeginAllowed, isInt, tokenize, unrecognizedError } from "./lexer"
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
    const testSources = (sources: string[], type: TokenType): void => {
        for (let i = 0; i < sources.length; i++) {
            const tokens = tokenize(sources[i])
            expect(tokens[0].value).toBe(sources[i])
            expect(tokens[0].type).toBe(type)
        }
    }

    it('gives only EOF token on empty string', () => {
        const [ token ] = tokenize('')
        expect(token.type).toBe(TokenType.EOF)
        expect(token.value).toBe(TokenVal.EOF)
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
    it('number', () => {
        testSources(['1', '１', '10', '１０'], TokenType.Number)
    })
    it('null', () => {
        testSources(['null', '無'], TokenType.Null)
    })
    it('true', () => {
        testSources(['true', '本当'], TokenType.Boolean)
    })
    it('false', () => {
        testSources(['false', '嘘'], TokenType.Boolean)
    })
    it('let', () => {
        testSources(['let', '宣言'], TokenType.Let)
    })
    it('identifier', () => {
        testSources(['a', 'a1', 'あ', 'あ１', 'a_x', 'あ＿え'], TokenType.Identifier)
    })
    it('equals', () => {
        testSources(['=', '＝'], TokenType.Equals)
    })
    it('binary operator', () => {
        testSources(['+', '-', '*', '/', '%', '^', '>', '<', '＋', '＊', '／', '％', '＾', '＞', '＜'], TokenType.BinaryOperator)
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