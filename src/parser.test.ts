import { beforeEach, describe, expect, it } from "bun:test";
import Parser from "./parser";
import { fail } from "assert";
import { BinaryExpr, Identifier, NullLiteral, NumericLiteral } from "./ast";

describe('parser', () => {
    let parser: Parser

    beforeEach(() => {
        parser = new Parser()
    })

    it('works on empty program', () => {
        const program = parser.produceAST('')
        expect(program.kind).toBe('Program')
        expect(program.body.length).toBe(0)
    })

    it('throws error on unrecognized tokens', () => {
        try {
            const program = parser.produceAST('%')
            fail('Produced an AST with invalid tokens')
        } catch (e) { }
    })

    it('parses number literal', () => {
        const program = parser.produceAST('777')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as NumericLiteral
        expect(token.kind).toBe("NumericLiteral")
        expect(token.value).toBe(777)
    })

    it('parses identifier', () => {
        const program = parser.produceAST('id')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as Identifier
        expect(token.kind).toBe("Identifier")
        expect(token.symbol).toBe('id')
    })

    it('parses binary additive expression', () => {
        const program = parser.produceAST('a + 1')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        const { kind, left, right, operator } = token
        expect(kind).toBe("BinaryExpr")
        expect(operator).toBe('+')
        expect(left.kind).toBe('Identifier')
        expect(right.kind).toBe('NumericLiteral')
    })

    it('parses binary multiplicative expression', () => {
        const program = parser.produceAST('a*b + 1')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        const { kind, left, right, operator } = token
        expect(kind).toBe("BinaryExpr")
        expect(right.kind).toBe('NumericLiteral')
        expect(operator).toBe('+')
        const {
            kind: leftKind,
            left: leftLeft,
            right: leftRight,
            operator: leftOp
        } = left as BinaryExpr
        expect(leftKind).toBe('BinaryExpr')
        expect(leftLeft.kind).toBe('Identifier')
        expect(leftRight.kind).toBe('Identifier')
        expect(leftOp).toBe('*')
    })

    it('parses modulo operator expression', () => {
        const program = parser.produceAST('n % 2')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        expect(token.operator).toBe('%')
        expect(token.left.kind).toBe('Identifier')
        expect(token.right.kind).toBe('NumericLiteral')
    })

    it('parses exponential opeator expressions', () => {
        const program = parser.produceAST('n ^ m ^ k')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        expect(token.operator).toBe('^')
        expect(token.left.kind).toBe('Identifier')
        expect(token.right.kind).toBe('BinaryExpr')
        const { kind, left, right, operator } = token.right as BinaryExpr
        expect(kind).toBe('BinaryExpr')
        expect(left.kind).toBe('Identifier')
        expect(right.kind).toBe('Identifier')
        expect(operator === '^').toBeTrue()
    })

    it('parses parenthesized expressions', () => {
        const program = parser.produceAST('(1)+a')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        expect(token.operator).toBe('+')
        expect(token.left.kind).toBe('NumericLiteral')
        expect(token.right.kind).toBe('Identifier')
    })

    it('parses null literals', () => {
        const program = parser.produceAST('無')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as NullLiteral
        expect(token.kind).toBe('NullLiteral')
        expect(token.value).toBe('無')
    })

    it('parses boolean literals', () => {
        const program = parser.produceAST('本当 + 嘘')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        const { kind, left, right } = token
        expect(kind).toBe('BinaryExpr')
        expect(left.kind).toBe('BooleanLiteral')
        expect(right.kind).toBe('BooleanLiteral')
    })
})