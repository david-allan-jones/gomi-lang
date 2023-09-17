import { describe, expect, it } from "bun:test";
import { evaluate } from "./interpreter";
import { ArrayLiteral, BooleanLiteral, Expr, MemberExpr, NilLiteral, IntLiteral, ObjectLiteral, StringLiteral, VarAssignment, VarDeclaration, mk_identifier, mk_int_literal } from "../frontend/ast";
import Scope from "./scope/scope";
import { fail } from "assert";
import { IntVal, ObjectVal, VoidVal } from "./types";

describe('Gomi Interpreter', () => {
    it('numeric literals', () => {
        const stmt = mk_int_literal(1n)
        const result = evaluate(stmt, new Scope())
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('boolean literals', () => {
        const stmt = {
            kind: 'BooleanLiteral',
            value: true
        } as BooleanLiteral
        const result = evaluate(stmt, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(true)
    })

    it('string literals', () => {
        const stmt = {
            kind: 'StringLiteral',
            value: 'abc'
        } as StringLiteral
        const result = evaluate(stmt, new Scope())
        expect(result.type).toBe('string')
        expect(result.value).toBe('abc')
    })

    it('nil literals', () => {
        const stmt = {
            kind: 'NilLiteral',
            value: null
        } as NilLiteral
        const result = evaluate(stmt, new Scope())
        expect(result.type).toBe('object')
        expect(result.value).toBe(undefined)
    })

    it('array literals', () => {
        const stmt = {
            kind: 'ArrayLiteral',
            values: [
                mk_int_literal(1n),
                mk_int_literal(2n),
            ]
        } as ArrayLiteral
        const result = evaluate(stmt, new Scope())
        const [val1, val2] = result.value as IntVal[]
        expect(result.type).toBe('array')
        expect(val1.type).toBe('int')
        expect(val1.value).toBe(1n)
        expect(val2.type).toBe('int')
        expect(val2.value).toBe(2n)
    })

    it('object literal', () => {
        const stmt = {
            kind: 'ObjectLiteral',
            props: [
                {
                    kind: 'Property',
                    key: 'a',
                    value: mk_int_literal(1n)
                },
            ]
        } as Expr
        const result = evaluate(stmt, new Scope()) as ObjectVal
        expect(result.type).toBe('object')
        const a = result.value?.get('a')
        expect(a?.type).toBe('int')
        expect(a?.value).toBe(1n)
    })

    it('var declaration', () => {
        const stmt = {
            kind: 'VarDeclaration',
            declarations: [
                {
                    identifier: 'a',
                    value: mk_int_literal(1n)
                },
                {
                    identifier: 'b',
                    value: mk_int_literal(2n)
                },
            ],
            mutable: true
        } as VarDeclaration
        const scope = new Scope()
        const result = evaluate(stmt, scope) as VoidVal
        expect(result.type).toBe('void')
        expect(result.value).toBe(null)

        expect(scope.lookupVar('a')?.val.value).toBe(1n)
        expect(scope.lookupVar('b')?.val.value).toBe(2n)
    })

    it('var assignment', () => {
        const declaration = {
            kind: 'VarDeclaration',
            declarations: [
                {
                    identifier: 'a',
                    value: mk_int_literal(1n)
                }
            ],
            mutable: true
        } as VarDeclaration
        const scope = new Scope()
        evaluate(declaration, scope) as VoidVal

        const stmt = {
            kind: 'VarAssignment',
            assignee: mk_identifier('a'),
            value: mk_int_literal(2n)
        } as VarAssignment

        const result = evaluate(stmt, scope)
        expect(result.type).toBe('int')
        expect(scope.lookupVar('a')?.val.value).toBe(2n)
    })

    it('const assignment throws an error', () => {
        const declaration = {
            kind: 'VarDeclaration',
            declarations: [
                {
                    identifier: 'a',
                    value: mk_int_literal(1n)
                }
            ],
            mutable: false
        } as VarDeclaration
        const scope = new Scope()
        evaluate(declaration, scope) as VoidVal

        const stmt = {
            kind: 'VarAssignment',
            assignee: mk_identifier('a'),
            value: mk_int_literal(2n)
        } as VarAssignment

        try {
            const result = evaluate(stmt, scope)
            fail('You were able to assign to a const')
        } catch(e) {
            expect(e).toInclude("'a'")
        }
    })
})