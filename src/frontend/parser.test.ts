import { beforeEach, describe, expect, it } from "bun:test";
import Parser from "./parser";
import { fail } from "assert";
import { BinaryExpr, BooleanLiteral, Identifier, NullLiteral, NumericLiteral, VarAssignment, VarDeclaration } from "./ast";

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
            fail(`Produced an AST with invalid tokens ${JSON.stringify(program)}`)
        } catch (e) { }
    })

    it('parses number literal', () => {
        const halfWidth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const fullWidth = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '１０']
        for (let i = 0; i < fullWidth.length; i++) {
            let program = parser.produceAST(halfWidth[i])
            let node = program.body[0] as NumericLiteral
            expect(node.kind).toBe('NumericLiteral')
            expect(node.value).toBe(i + 1)

            program = parser.produceAST(fullWidth[i])
            node = program.body[0] as NumericLiteral
            expect(node.kind).toBe('NumericLiteral')
            expect(node.value).toBe(i + 1)
        }
    })

    it('parses identifier', () => {
        const identifiers = ['a', 'a0', 'a_b', 'あ', 'あ_１', 'あ０', 'あa', 'aあ']
        for (let i = 0; i < identifiers.length; i++) {
            const program = parser.produceAST(identifiers[i])
            const node = program.body[0] as Identifier
            expect(node.kind).toBe('Identifier')
            expect(node.symbol).toBe(identifiers[i])
        }
    })

    it('parses binary additive expression', () => {
        const program = parser.produceAST('a + 1')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as BinaryExpr
        const { kind, left, right, operator } = node
        expect(kind).toBe("BinaryExpr")
        expect(operator).toBe('+')
        expect(left.kind).toBe('Identifier')
        expect(right.kind).toBe('NumericLiteral')
    })

    it('parses binary multiplicative expression', () => {
        const program = parser.produceAST('a*b + 1')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as BinaryExpr
        const { kind, left, right, operator } = node
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
        const expressions = ['n%2', 'n % 2', 'あ　％　２', 'あ％２']
        for (let i = 0; i < expressions.length; i++) {
            const program = parser.produceAST(expressions[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.operator).toBe('%')
            expect(node.left.kind).toBe('Identifier')
            expect(node.right.kind).toBe('NumericLiteral')
        }
    })

    it('parses exponential operator expressions', () => {
        const expressions = ['n^m^k', 'n ^ m ^ k', 'あ　＾　い＾　う', 'あ＾い＾う']
        for (let i = 0; i < expressions.length; i++) {
            const program = parser.produceAST(expressions[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.operator).toBe('^')
            expect(node.left.kind).toBe('Identifier')
            expect(node.right.kind).toBe('BinaryExpr')
            const { kind, left, right, operator } = node.right as BinaryExpr
            expect(kind).toBe('BinaryExpr')
            expect(left.kind).toBe('Identifier')
            expect(right.kind).toBe('Identifier')
            expect(operator === '^').toBeTrue()
        }
    })

    it('parses parenthesized expressions', () => {
        const program = parser.produceAST('(1)+a')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as BinaryExpr
        expect(node.operator).toBe('+')
        expect(node.left.kind).toBe('NumericLiteral')
        expect(node.right.kind).toBe('Identifier')
    })

    it('parses null literals', () => {
        const literals = ['null', '無']
        for (let i = 0; i < literals.length; i++) {
            const { body } = parser.produceAST(literals[i])
            expect(body.length).toBe(1)
            const node = body[0] as NullLiteral
            expect(node.kind).toBe('NullLiteral')
            expect(node.value).toBe(null)
        }
    })

    it('parses boolean literals', () => {
        const literals = ['true', 'false', '本当', '嘘']
        const values = [true, false, true, false]
        for (let i = 0; i < literals.length; i++) {
            const { body } = parser.produceAST(literals[i])
            expect(body.length).toBe(1)
            const node = body[0] as BooleanLiteral
            expect(node.kind).toBe('BooleanLiteral')
            expect(node.value).toBe(values[i])
        }
    })

    it('parses variable declaration with literals', () => {
        const stmts = ['let a = 1', '宣言　あ　＝１']
        const symbols = ['a', 'あ']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as VarDeclaration
            expect(node.kind).toBe('VarDeclaration')
            expect(node.declarations[0].identifier).toBe(symbols[i])
            expect(node.declarations[0].value.kind).toBe('NumericLiteral')
        }
    })

    it('parses variable declaration with multiple assignments', () => {
        const stmt = 'let a, b = 1, 2'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)

        const node = program.body[0] as VarDeclaration
        expect(node.kind).toBe('VarDeclaration')
        const [a, b] = node.declarations

        expect(a.identifier).toBe('a')
        const aExpr = node.declarations[0].value as NumericLiteral
        expect(aExpr.kind).toBe('NumericLiteral')
        expect(aExpr.value).toBe(1)

        expect(b.identifier).toBe('b')
        const bExpr = b.value as NumericLiteral
        expect(bExpr.kind).toBe('NumericLiteral')
        expect(bExpr.value).toBe(2)
    })

    it('can handle multiple assignments together', () => {
        const stmt = 'let a,b=1,2; let c=3'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(2)
    })

    it('parses variable assignemnt with literals', () => {
        const stmts = ['a = 1', 'あ　＝　１']
        const symbols = ['a', 'あ']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as VarAssignment
            expect(node.kind).toBe('VarAssignment')
            const assignee = node.assignee as Identifier
            expect(assignee.symbol).toBe(symbols[i])
            expect(node.value.kind).toBe('NumericLiteral')
        }
    })
})