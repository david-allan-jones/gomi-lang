import { describe, expect, it } from "bun:test";
import { evalVarDeclaration } from "./statements";
import Scope from "../scope";
import { BinaryExpr, NumericLiteral } from "../../frontend/ast";

describe('GOMI Statements:', () => {
    describe("VarDeclaration", () => {
        it('can persist numeric literals', () => {
            const symbol = 'a'
            const scope = new Scope()
            const val = evalVarDeclaration({
                kind: 'VarDeclaration',
                symbol,
                value: { value: 1, kind: 'NumericLiteral' } as NumericLiteral
            }, scope)

            expect(val.type).toBe('number')
            expect(val.value).toBe(1)
            expect(scope.lookupVar(symbol).type).toBe('number')
            expect(scope.lookupVar(symbol).value).toBe(1)
        })

        it('can persist binary expressions', () => {
            const symbol = 'a'
            const scope = new Scope()
            const val = evalVarDeclaration({
                kind: 'VarDeclaration',
                symbol,
                value: {
                    kind: 'BinaryExpr',
                    left: { kind: 'NumericLiteral', value: 1 },
                    right: { kind: 'NumericLiteral', value: 1},
                    operator: '+'
                } as BinaryExpr
            }, scope)

            expect(val.type).toBe('number')
            expect(val.value).toBe(2)
            expect(scope.lookupVar(symbol).type).toBe('number')
            expect(scope.lookupVar(symbol).value).toBe(2)
        })
    })
})