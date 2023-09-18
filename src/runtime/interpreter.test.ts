import { describe, expect, it } from "bun:test";
import { evaluate } from "./interpreter";
import { ArrayLiteral, BooleanLiteral, Expr, MemberExpr, NilLiteral, IntLiteral, ObjectLiteral, StringLiteral, VarAssignment, VarDeclaration, mk_identifier, mk_int_literal, mk_float_literal } from "../frontend/ast";
import Scope from "./scope/scope";
import { fail } from "assert";
import { ArrayVal, IntVal, ObjectVal, VoidVal } from "./types";
import GomiParser from "../frontend/parser";

describe('Gomi Interpreter', () => {
    const runProgram = (src: string, scope: Scope) => {
        const parser = new GomiParser()
        const program = parser.produceAST(src)
        return evaluate(program, scope)
    }

    it('int literal', () => {
        const result = runProgram('1', new Scope())
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('float literal', () => {
        const result = runProgram('1.0', new Scope())
        expect(result.type).toBe('float')
        expect(result.value).toBe(1)
    })

    it('boolean literals', () => {
        const result = runProgram('true', new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(true)
    })

    it('string literals', () => {
        const result = runProgram("'abc'", new Scope())
        expect(result.type).toBe('string')
        expect(result.value).toBe('abc')
    })

    it('nil literals', () => {
        const result = runProgram('nil', new Scope())
        expect(result.type).toBe('object')
        expect(result.value).toBe(undefined)
    })

    it('array literals', () => {
        const result = runProgram('[1, 2]', new Scope())
        expect(result.type).toBe('array')
        const [val1, val2] = result.value as IntVal[]
        expect(val1.type).toBe('int')
        expect(val1.value).toBe(1n)
        expect(val2.type).toBe('int')
        expect(val2.value).toBe(2n)
    })

    it('object literal', () => {
        const result = runProgram('{a: 1}', new Scope())
        expect(result.type).toBe('object')
        const a = (result as ObjectVal).value?.get('a')
        expect(a?.type).toBe('int')
        expect(a?.value).toBe(1n)
    })

    it('var declaration', () => {
        const scope = new Scope()
        const result = runProgram('let a, b = 1, 2;', scope)
        expect(result.type).toBe('void')
        expect(result.value).toBe(null)
        expect(scope.lookupVar('a')?.val.value).toBe(1n)
        expect(scope.lookupVar('b')?.val.value).toBe(2n)
    })

    it('var assignment', () => {
        const scope = new Scope() 
        const result = runProgram(`
            let a = 1;
            a = 2 
        `, scope)
        expect(result.type).toBe('int')
        expect(scope.lookupVar('a')?.val.value).toBe(2n)
    })

    it('const assignment throws an error', () => {
        try {
            runProgram(`
                const a = 1;
                a = 2
            `, new Scope())
            fail('You were able to assign to a const')
        } catch(e) {
            expect(e).toInclude("'a'")
        }
    })
})