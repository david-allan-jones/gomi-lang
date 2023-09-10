import { beforeEach, describe, expect, it } from "bun:test";
import Parser from "./parser";
import { fail } from "assert";
import { BinaryExpr, Identifier, NumericLiteral } from "./ast";

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
        } catch(e) {}
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

    it('parses binary expression', () => {
        const program = parser.produceAST('a + 1')
        expect(program.body.length).toBe(1)
        const token = program.body[0] as BinaryExpr
        const { kind, left, right, operator } = token
        expect(kind).toBe("BinaryExpr")
        expect(operator).toBe('+')
        expect(left.kind).toBe('Identifier')
        expect(right.kind).toBe('NumericLiteral')
    })
})