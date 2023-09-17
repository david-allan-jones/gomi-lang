import { describe, expect, it } from "bun:test";
import Scope, { declareError, resolveError } from "./scope/scope";
import { fail } from "assert";

describe('Scope class', () => {
    it('throws error when resolving from global scope', () => {
        const symbol = 'a'
        try {
            const scope = new Scope()
            scope.resolve(symbol)
            fail(`Was able to resolve a non-existent global var: ${symbol}`)
        } catch(e) {
            expect(e).toBe(resolveError(symbol))
        }
    })

    it('throws error when resolving from global scope', () => {
        const symbol = 'a'
        try {
            const scope = new Scope()
            scope.declareVar(symbol, { value: 0, type: 'int' }, true)
            scope.declareVar(symbol, { value: 0, type: 'int' }, true)
            fail(`Was able to declare a variable twice: ${symbol}`)
        } catch(e) {
            expect(e).toBe(declareError(symbol))
        }
    })

    it('can declare variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        const val = scope.declareVar(symbol, { value: 0, type: 'int' }, true)
        expect(val.type).toBe('int')
        expect(val.value).toBe(0)
    })

    it('can reassign variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        scope.declareVar(symbol, { value: 0, type: 'int' }, true)
        const val = scope.assignVar(symbol, { value: 1, type: 'int' })
        expect(val.type).toBe('int')
        expect(val.value).toBe(1)
    })

    it('can lookup variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        scope.declareVar(symbol, { value: 0, type: 'int' }, true)
        const { val, mutable } = scope.lookupVar(symbol)
        expect(val.type).toBe('int')
        expect(val.value).toBe(0)
        expect(mutable).toBe(true)
    })

    it('can assign variables in parent scope', () => {
        const symbol = 'a'
        const globalScope = new Scope()
        globalScope.declareVar(symbol, { value: 0, type: 'int' }, true)
        const childScope = new Scope(globalScope)
        const val = childScope.assignVar(symbol, { value: 1, type: 'int' })
        expect(val.type).toBe('int')
        expect(val.value).toBe(1)
    })

    it('can lookup variables in parent scope', () => {
        const symbol = 'a'
        const globalScope = new Scope()
        globalScope.declareVar(symbol, { value: 0, type: 'int' }, true)
        const childScope = new Scope(globalScope)
        const { val, mutable } = childScope.lookupVar(symbol)
        expect(val.type).toBe('int')
        expect(val.value).toBe(0)
        expect(mutable).toBe(true)
    })
})