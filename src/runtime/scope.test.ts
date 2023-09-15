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
            scope.declareVar(symbol, { value: 0, type: 'number' })
            scope.declareVar(symbol, { value: 0, type: 'number' })
            fail(`Was able to declare a variable twice: ${symbol}`)
        } catch(e) {
            expect(e).toBe(declareError(symbol))
        }
    })

    it('can declare variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        const val = scope.declareVar(symbol, { value: 0, type: 'number' })
        expect(val.type).toBe('number')
        expect(val.value).toBe(0)
    })

    it('can reassign variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        scope.declareVar(symbol, { value: 0, type: 'number' })
        const val = scope.assignVar(symbol, { value: 1, type: 'number' })
        expect(val.type).toBe('number')
        expect(val.value).toBe(1)
    })

    it('can lookup variables', () => {
        const symbol = 'a'
        const scope = new Scope()
        scope.declareVar(symbol, { value: 0, type: 'number' })
        const val = scope.lookupVar(symbol)
        expect(val.type).toBe('number')
        expect(val.value).toBe(0)
    })

    it('can assign variables in parent scope', () => {
        const symbol = 'a'
        const globalScope = new Scope()
        globalScope.declareVar(symbol, { value: 0, type: 'number' })
        const childScope = new Scope(globalScope)
        const val = childScope.assignVar(symbol, { value: 1, type: 'number' })
        expect(val.type).toBe('number')
        expect(val.value).toBe(1)
    })

    it('can lookup variables in parent scope', () => {
        const symbol = 'a'
        const globalScope = new Scope()
        globalScope.declareVar(symbol, { value: 0, type: 'number' })
        const childScope = new Scope(globalScope)
        const val = childScope.lookupVar(symbol)
        expect(val.type).toBe('number')
        expect(val.value).toBe(0)
    })
})