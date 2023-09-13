import { beforeEach, describe, expect, it } from "bun:test";
import GomiParser from "./parser";
import { fail } from "assert";
import { BinaryExpr, BooleanLiteral, Identifier, NullLiteral, NumericLiteral, TernaryExpr, UnaryExpr, VarAssignment, VarDeclaration } from "./ast";

describe('parser', () => {
    let parser: GomiParser

    beforeEach(() => {
        parser = new GomiParser()
    })

    it('works on empty program', () => {
        const program = parser.produceAST('')
        expect(program.kind).toBe('Program')
        expect(program.body.length).toBe(0)
    })

    it('throws error on unrecognized tokens', () => {
        const thrown = 'thrown'
        const t = () => {
            try {
                parser.produceAST('#')
            } catch(e) {
                throw thrown
            }
        }
        expect(t).toThrow(thrown)
    })

    it('parses number literal', () => {
        const halfWidth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const fullWidth = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '１０']
        for (let i = 0; i < fullWidth.length; i++) {
            let program = parser.produceAST(halfWidth[i])
            let node = program.body[0] as NumericLiteral
            expect(node.kind).toBe('NumericLiteral')
            expect(node.value).toBe(BigInt(i + 1))

            program = parser.produceAST(fullWidth[i])
            node = program.body[0] as NumericLiteral
            expect(node.kind).toBe('NumericLiteral')
            expect(node.value).toBe(BigInt(i + 1))
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
        expect(node.kind).toBe("BinaryExpr")
    })

    it('parses binary multiplicative expression', () => {
        const program = parser.produceAST('a * b')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as BinaryExpr
        expect(node.kind).toBe("BinaryExpr")
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

    it('bang operators', () => {
        const stmt = '!a'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as UnaryExpr
        expect(node.kind).toBe('UnaryExpr')
        expect(node.operator).toBe('!')
        expect(node.operand.kind).toBe('Identifier')
    })

    it('double bang opeator not allowed', () => {
        const thrown = 'throw'
        const t = () => {
            try {
                parser.produceAST('!!a')
            } catch(e) {
                throw thrown
            }
        }
        expect(t).toThrow(thrown)
    })

    it('unary precedence', () => {
        const ops = ['!', '-']
        for (let i = 0; i < ops.length; i++) {
            const stmt = `${ops[i]}a ^ b`
            const program = parser.produceAST(stmt)
            const node = program.body[0] as BinaryExpr
            expect(node.left.kind).toBe('UnaryExpr')
        }
    })

    it('double negative unary not allowed', () => {
        const thrown = 'throw'
        const t = () => {
            try {
                parser.produceAST('--a')
            } catch(e) {
                throw thrown
            }
        }
        expect(t).toThrow(thrown)
    })

    it('parses parenthesized expressions', () => {
        const program = parser.produceAST('(1)')
        const node = program.body[0] as NumericLiteral
        expect(node.kind).toBe('NumericLiteral')
    })

    it('parses null literals', () => {
        const literals = ['nil', '無']
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

    it('parses half width variable declaration with literals', () => {
        const program = parser.produceAST('let a = 1')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as VarDeclaration
        expect(node.kind).toBe('VarDeclaration')
        expect(node.declarations[0].identifier).toBe('a')
        expect(node.declarations[0].value.kind).toBe('NumericLiteral')
    })
    it('parses full width variable declaration with literals', () => {
        const program = parser.produceAST('宣言　あ＝１')
        expect(program.body.length).toBe(1)
        const node = program.body[0] as VarDeclaration
        expect(node.kind).toBe('VarDeclaration')
        expect(node.declarations[0].identifier).toBe('あ')
        expect(node.declarations[0].value.kind).toBe('NumericLiteral')
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
        expect(aExpr.value).toBe(1n)

        expect(b.identifier).toBe('b')
        const bExpr = b.value as NumericLiteral
        expect(bExpr.kind).toBe('NumericLiteral')
        expect(bExpr.value).toBe(2n)
    })

    it('can handle multiple assignments together', () => {
        const stmt = 'let a,b=1,2; let c=3'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(2)
    })

    it('parses variable assignment with literals', () => {
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

    it('assignment expression is right associative', () => {
        const stmt = 'a = b = c'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as VarAssignment
        expect(node.kind).toBe('VarAssignment')
        expect(node.value.kind).toBe('VarAssignment')
    })

    it('parses logical or operator expressions', () => {
        const stmts = ['a||b', 'あ｜｜い']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.kind).toBe('BinaryExpr')
            expect(node.left.kind).toBe('Identifier')
            expect(node.right.kind).toBe('Identifier')
        } 
    })

    it('parses logical and operator expressions', () => {
        const stmts = ['a&&b', 'あ＆＆い']
        for (let i = 0; i < stmts.length; i++) {
            const program = parser.produceAST(stmts[i])
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.kind).toBe('BinaryExpr')
            expect(node.left.kind).toBe('Identifier')
            expect(node.right.kind).toBe('Identifier')
        } 
    })

    it('left associative operators', () => {
        const ops = ['||', '&&', '<', '+', '-', '*', '/', '%']
        for (let i = 0; i < ops.length; i++) {
            const stmt = `a ${ops[i]} a ${ops[i]} a`
            const program = parser.produceAST(stmt)
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.kind).toBe('BinaryExpr')
            if (node.left.kind !== 'BinaryExpr') {
                fail(`Failed left associative check on: ${ops[i]}`)
            }
        } 
    })

    it('right associative operators', () => {
        const ops = ['^']
        for (let i = 0; i < ops.length; i++) {
            const stmt = `a ${ops[i]} a ${ops[i]} a`
            const program = parser.produceAST(stmt)
            expect(program.body.length).toBe(1)
            const node = program.body[0] as BinaryExpr
            expect(node.kind).toBe('BinaryExpr')
            if (node.right.kind !== 'BinaryExpr') {
                fail(`Failed left associative check on: ${ops[i]}`)
            }
        } 
    })

    it('boolean operator precedence is respected', () => {
        // order from least to most precedence to make a long right tree
        const ops = ['||', '&&', '<', '+', '*', '^']
        const stmt = `operand ${ops.join(' operand ')} operand`
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        let node = program.body[0] as BinaryExpr
        for (let i = 0; i < ops.length; i++) {
            expect(node.kind).toBe('BinaryExpr')
            if (node.left.kind !== 'Identifier') {
                fail(`Precedence check failed at operand: ${ops[i]}`)
            }
            expect(node.operator).toBe(ops[i])
            node = node.right as BinaryExpr
        }
    })

    it('ternary expression', () => {
        const stmt = 'a ? b : c'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as TernaryExpr
        expect(node.kind).toBe('TernaryExpr')
        expect(node.left.kind).toBe('Identifier')
        expect(node.mid.kind).toBe('Identifier')
        expect(node.right.kind).toBe('Identifier')
    })

    it('ternary expression has less precedence than comparison', () => {
    const stmt = 'a<b ? a<b : a<b'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as TernaryExpr
        expect(node.kind).toBe('TernaryExpr')
        expect(node.left.kind).toBe('BinaryExpr')
        expect(node.mid.kind).toBe('BinaryExpr')
        expect(node.right.kind).toBe('BinaryExpr')
    })

    it('ternary expression is left associative', () => {
        const stmt = 'a ? b : c ? d : e'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as TernaryExpr
        expect(node.kind).toBe('TernaryExpr')
        expect(node.left.kind).toBe('Identifier')
        expect(node.mid.kind).toBe('Identifier')
        expect(node.right.kind).toBe('TernaryExpr')
    })

    it('ternary expression in mid of ternary is evaluated correctly', () => {
        const stmt = 'a ? b ? c : d : e'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as TernaryExpr
        expect(node.kind).toBe('TernaryExpr')
        expect(node.left.kind).toBe('Identifier')
        expect(node.mid.kind).toBe('TernaryExpr')
        expect(node.right.kind).toBe('Identifier')
    })

    it('double nested ternary expressions', () => {
        const stmt = 'a ? b ? c : d : e ? f : g'
        const program = parser.produceAST(stmt)
        expect(program.body.length).toBe(1)
        const node = program.body[0] as TernaryExpr
        expect(node.kind).toBe('TernaryExpr')
        expect(node.left.kind).toBe('Identifier')
        expect(node.mid.kind).toBe('TernaryExpr')
        expect(node.right.kind).toBe('TernaryExpr')
    })
})