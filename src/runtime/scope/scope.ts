import { RuntimeVal } from "../types"
import globals from './globals'

export function createGlobalScope(): Scope {
    const scope = new Scope()
    for (let i = 0; i < globals.length; i++) {
        const { identifiers, value } = globals[i]
        for (let j = 0; j < identifiers.length; j++) {
            scope.declareVar(identifiers[j], value) 
        }
    }
    return scope
}

export function declareError(symbol: string): string {
    return `Cannot declare variable ${symbol} as it is already define.`
}

export function resolveError(symbol: string): string {
    return `Cannot resolve ${symbol} as it has not be declared.`
}

export default class Scope {
    // undefined => global scope
    private parent?: Scope
    private vars: Map<string, RuntimeVal<unknown>>

    constructor(parent?: Scope) {
        this.parent = parent
        this.vars = new Map()
    }

    public declareVar(symbol: string, val: RuntimeVal<unknown>): RuntimeVal<unknown> {
        if (this.vars.has(symbol)) {
            throw declareError(symbol)
        }
        this.vars.set(symbol, val)
        return val
    }

    public assignVar(symbol: string, val: RuntimeVal<unknown>): RuntimeVal<unknown> {
        const scope = this.resolve(symbol) 
        scope.vars.set(symbol, val)
        return val
    }

    public lookupVar(symbol: string): RuntimeVal<unknown> {
        const scope = this.resolve(symbol)
        return scope.vars.get(symbol) as RuntimeVal<unknown>
    }

    public resolve(symbol: string): Scope {
        if (this.vars.has(symbol)) return this
        if (this.parent === undefined) {
            throw resolveError(symbol)
        }
        return this.parent.resolve(symbol)
    }
    
}