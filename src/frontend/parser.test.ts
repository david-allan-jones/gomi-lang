import { beforeEach, describe, expect, it } from "bun:test";
import Parser from "./parser";
import { fail } from "assert";
import { BinaryExpr, BooleanLiteral, Identifier, NullLiteral, NumericLiteral, VarDeclaration } from "./ast";

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

    it('parses exponential operator expressions', () => {
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
        const literals = ['null', '無']
        for (let i = 0; i < literals.length; i++) {
            const { body } = parser.produceAST(literals[i])
            expect(body.length).toBe(1)
            const stmt = body[0] as NullLiteral
            expect(stmt.kind).toBe('NullLiteral')
            expect(stmt.value).toBe(null)
        }
    })

    it('parses boolean literals', () => {
        const literals = ['true', 'false', '本当', '嘘']
        const values = [true, false, true, false]
        for (let i = 0; i < literals.length; i++) {
            const { body } = parser.produceAST(literals[i])
            expect(body.length).toBe(1)
            const stmt = body[0] as BooleanLiteral
            expect(stmt.kind).toBe('BooleanLiteral')
            expect(stmt.value).toBe(values[i])
        }
    })

    it('parses variable declaration with literals', () => {
        const stmts = ['宣言　あ　＝１', 'let a = 1']
        const symbols = ['あ', 'a']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const token = program.body[0] as VarDeclaration
            expect(token.kind).toBe('VarDeclaration')
            expect(token.symbol).toBe(symbols[i])
            expect(token.value.kind).toBe('NumericLiteral')
        }
    })

    it('parses variable declaration with binary expressions', () => {
        const stmts = ['宣言　あ　＝１+２', 'let a = 1 + 2']
        const symbols = ['あ', 'a']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const token = program.body[0] as VarDeclaration
            expect(token.kind).toBe('VarDeclaration')
            expect(token.symbol).toBe(symbols[i])
            expect(token.value.kind).toBe('BinaryExpr')
        }
    })

    it('parses full-width identifier properly', () => {
        const identifiers = ['あ', 'あ１', 'あ０', 'あa', 'aあ']
        for (let i = 0; i < identifiers.length; i++) {
            const program = parser.produceAST(identifiers[i])
            const token = program.body[0] as Identifier
            expect(token.kind).toBe('Identifier')
            expect(token.symbol).toBe(identifiers[i])
        }
    })

    it('parses full-width numbers properly', () => {
        const numbers = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '１０']
        for (let i = 0; i < numbers.length; i++) {
            const program = parser.produceAST(numbers[i])
            const token = program.body[0] as NumericLiteral
            expect(token.kind).toBe('NumericLiteral')
            expect(token.value).toBe(i + 1)
        }
    })
})